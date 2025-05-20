// src/context/GoogleAuthProvider.tsx
import { GoogleOAuthProvider } from "@react-oauth/google";

export const GOOGLE_CLIENT_ID = "734529005396-61h8k6ichq33uktiquis678vn1cejr0o.apps.googleusercontent.com";

export default function GoogleAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}