"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [googleFitData, setGoogleFitData] = useState([]);

  const formatDate = (timestamp) =>
    new Date(Math.floor(parseInt(timestamp))).toLocaleString();

  const fetchGoogleFitData = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregateBy: [
              { dataTypeName: "com.google.step_count.delta" },
              { dataTypeName: "com.google.calories.expended" },
              { dataTypeName: "com.google.distance.delta" },
              { dataTypeName: "com.google.heart_rate.bpm" },
              { dataTypeName: "com.google.sleep.segment" },
            ],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000,
            endTimeMillis: Date.now(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Google Fit Response:", data);

      const formattedData = data.bucket.map((bucket) => {
        const heartRatePoints = bucket.dataset[3]?.point || [];
        const sleepPoints = bucket.dataset[4]?.point || [];

        const avgHeartRate =
          heartRatePoints.length > 0
            ? (
                heartRatePoints.reduce(
                  (sum, pt) => sum + pt.value?.[0]?.fpVal,
                  0
                ) / heartRatePoints.length
              ).toFixed(2)
            : "N/A";

        const sleepDetails =
          sleepPoints.length > 0
            ? sleepPoints
                .map((point) => {
                  const start = formatDate(point.startTimeNanos / 1e6);
                  const end = formatDate(point.endTimeNanos / 1e6);
                  return `${start} - ${end}`;
                })
                .join(", ")
            : "N/A";

        return {
          startTime: formatDate(bucket.startTimeMillis),
          endTime: formatDate(bucket.endTimeMillis),
          steps: bucket.dataset[0]?.point?.[0]?.value?.[0]?.intVal || 0,
          calories: bucket.dataset[1]?.point?.[0]?.value?.[0]?.fpVal || 0,
          distance: bucket.dataset[2]?.point?.[0]?.value?.[0]?.fpVal || 0,
          heartRate: avgHeartRate,
          sleep: sleepDetails,
        };
      });

      setGoogleFitData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchGoogleFitData(session.accessToken);
    } else {
      console.warn("Access token is missing in session.");
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <h1>Welcome to My App</h1>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>

      <h2>Your Google Fit Data:</h2>
      {googleFitData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Steps</th>
              <th>Calories</th>
              <th>Distance (m)</th>
              <th>Heart Rate (bpm)</th>
              <th>Sleep</th>
            </tr>
          </thead>
          <tbody>
            {googleFitData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.startTime}</td>
                <td>{entry.endTime}</td>
                <td>{entry.steps}</td>
                <td>{entry.calories}</td>
                <td>{entry.distance}</td>
                <td>{entry.heartRate}</td>
                <td>{entry.sleep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Google Fit data available. Make sure your account is synced with a fitness tracker.</p>
      )}
    </div>
  );
}
