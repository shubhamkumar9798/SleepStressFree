"use client"; // Ensure this page is client-side rendered

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [googleFitData, setGoogleFitData] = useState(null);

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
            "aggregateBy": [{
              "dataTypeName": "com.google.step_count.delta"
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": Date.now() - 7 * 24 * 60 * 60 * 1000,
            "endTimeMillis": Date.now(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Google Fit Data:', data);
      setGoogleFitData(data);
    } catch (error) {
      console.error('Error fetching Google Fit data:', error.message || error);
    }
  };

  // Fetch data when session is available
  useEffect(() => {
    if (session && session.accessToken) {
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
          {googleFitData ? (
            <pre>{JSON.stringify(googleFitData, null, 2)}</pre>
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
