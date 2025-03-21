"use client"; // Ensure this page is client-side rendered

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [googleFitData, setGoogleFitData] = useState([]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => new Date(Math.floor(parseInt(timestamp))).toLocaleString();

  // Function to fetch Google Fit data
  const fetchGoogleFitData = async (accessToken) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "aggregateBy": [
              { "dataTypeName": "com.google.step_count.delta" },
              { "dataTypeName": "com.google.calories.expended" },
              { "dataTypeName": "com.google.distance.delta" },
              { "dataTypeName": "com.google.heart_rate.bpm" },
              { "dataTypeName": "com.google.sleep.segment" }
            ],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": Date.now() - 7 * 24 * 60 * 60 * 1000,
            "endTimeMillis": Date.now(),
          }),
        }
      );

      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Google Fit API Response:", JSON.stringify(data, null, 2));

      const formattedData = data.bucket.map(bucket => ({
        startTime: formatDate(bucket.startTimeMillis),
        endTime: formatDate(bucket.endTimeMillis),
        steps: bucket.dataset[0]?.point?.[0]?.value?.[0]?.intVal || 0,
        calories: bucket.dataset[1]?.point?.[0]?.value?.[0]?.fpVal || 0,
        distance: bucket.dataset[2]?.point?.[0]?.value?.[0]?.fpVal || 0,
        heartRate: bucket.dataset[3]?.point?.length
          ? (bucket.dataset[3].point.reduce((sum, point) => sum + point.value?.[0]?.fpVal, 0) / bucket.dataset[3].point.length).toFixed(2)
          : 'N/A',
        sleep: bucket.dataset[4]?.point?.length
          ? bucket.dataset[4].point.map(point => {
              const start = formatDate(point.startTimeNanos / 1e6);
              const end = formatDate(point.endTimeNanos / 1e6);
              return `${start} - ${end}`;
            }).join(', ')
          : 'N/A'
      }));

      setGoogleFitData(formattedData);
    } catch (error) {
      console.error('Error fetching Google Fit data:', error.message || error);
    }
  };

  // Fetch data when session is available
  useEffect(() => {
    if (session && session.accessToken) {
      console.log("Session Access Token:", session.accessToken);
      fetchGoogleFitData(session.accessToken);
    } else {
      console.error("Access token is missing in the session.");
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>

        <div>
          <h2>Your Google Fit Data:</h2>
          {googleFitData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Steps</th>
                  <th>Calories (kcal)</th>
                  <th>Distance (m)</th>
                  <th>Heart Rate (bpm)</th>
                  <th>Sleep Duration</th>
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
            <p>No data available yet.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      <button onClick={() => signIn('google')}>
        Sign in with Google
      </button>
    </div>
  );
}