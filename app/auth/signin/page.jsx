// pages/auth/signin.js

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <h2>Sign in with Google</h2>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}
