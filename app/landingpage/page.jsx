"use client"; // Ensure this page is client-side rendered

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [googleFitData, setGoogleFitData] = useState(null);

  // Function to fetch Google Fit data using access token
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
              "dataTypeName": "com.google.step_count.delta", // Example of fetching step count data
            }],
            "bucketByTime": { "durationMillis": 86400000 }, // Aggregate daily data
            "startTimeMillis": Date.now() - 7 * 24 * 60 * 60 * 1000, // Start time: last 7 days
            "endTimeMillis": Date.now(), // End time: now
          }),
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Try to parse the response JSON
      const data = await response.json();
      console.log('Google Fit Data:', data);
      setGoogleFitData(data); // Set the fetched data in state
    } catch (error) {
      console.error('Error fetching Google Fit data:', error.message || error);
    }
  };

  // Fetch Google Fit data when the session is available
  useEffect(() => {
    if (session) {
      const accessToken = session.accessToken;
      console.log('Access Token:', accessToken);
      fetchGoogleFitData(accessToken); // Fetch the data using the access token
    }
  }, [session]);

  // If session is loading, show a loading indicator
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // When the user is logged in, show their details and Google Fit data
  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <button
          onClick={() => {
            console.log('Signing out...');
            signOut(); // Sign out the user
          }}
        >
          Sign out
        </button>
        
        {/* Display fetched Google Fit data */}
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

  // If no session, show the sign-in button
  return (
    <div>
      <h1>Welcome to My App</h1>
      <button
        onClick={() => {
          console.log('Signing in...');
          signIn('google', {
            scope: 'https://www.googleapis.com/auth/fitness.activity.read', // Request access to Google Fit data
          }); // Sign in using Google provider with Fit API scope
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
