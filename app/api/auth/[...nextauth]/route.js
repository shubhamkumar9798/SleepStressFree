import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `
            openid email profile
            https://www.googleapis.com/auth/fitness.activity.read
            https://www.googleapis.com/auth/fitness.sleep.read
            https://www.googleapis.com/auth/fitness.heart_rate.read
            https://www.googleapis.com/auth/fitness.body.read
            https://www.googleapis.com/auth/fitness.location.read
            https://www.googleapis.com/auth/fitness.blood_pressure.read
            https://www.googleapis.com/auth/fitness.body_temperature.read
          `.replace(/\s+/g, ' ').trim(),
          access_type: 'offline',
          prompt: 'consent'
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at * 1000 || Date.now() + 3600 * 1000;
      }

      console.log(`Token Expires At: ${new Date(token.expiresAt).toLocaleString()}`);

      if (Date.now() < token.expiresAt) {
        console.log("Token is still valid");
        return token; 
      }

      console.log("Token expired, attempting to refresh");
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: token.refreshToken,
            grant_type: 'refresh_token',
          }),
        });

        const refreshedTokens = await response.json();
        console.log("Refreshed Tokens:", refreshedTokens);

        if (!response.ok) throw refreshedTokens;

        token.accessToken = refreshedTokens.access_token;
        token.expiresAt = Date.now() + refreshedTokens.expires_in * 1000;

        return token;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error; 
      console.log("Session Access Token:", session.accessToken);
      return session;
    },
  },
});

export { handler as GET, handler as POST };