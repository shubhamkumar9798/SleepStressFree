// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // Add Google Fit API scopes for blood pressure, body temperature, and others
          scope: `
            openid
            email
            profile
            https://www.googleapis.com/auth/fitness.activity.read
            https://www.googleapis.com/auth/fitness.sleep.read
            https://www.googleapis.com/auth/fitness.heart_rate.read
            https://www.googleapis.com/auth/fitness.body.read
            https://www.googleapis.com/auth/fitness.location.read
            https://www.googleapis.com/auth/fitness.blood_pressure.read
            https://www.googleapis.com/auth/fitness.body_temperature.read
          `.trim(), // Trim unnecessary spaces
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at * 1000; // Store expiration time in milliseconds
      }

      // Check token expiration
      if (Date.now() < token.expiresAt) {
        return token; // Token is still valid
      } else {
        console.log("Token expired. Need to implement refresh logic.");
        return token; // Return token, consider adding refresh logic
      }
    },
    async session({ session, token }) {
      // Pass access and ID tokens to the session
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
