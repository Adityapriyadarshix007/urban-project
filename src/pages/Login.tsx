// src/pages/Login.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-animation.json";
import { db, auth, provider } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const buttonDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleCallback = async (response: any) => {
      const userObject: any = jwtDecode(response.credential);
      localStorage.setItem("user", JSON.stringify(userObject));
      localStorage.setItem("token", response.credential);

      // ✅ Store user data in Firestore
      if (userObject.email) {
        try {
          console.log("Saving to Firestore:", userObject.email);
          await setDoc(doc(db, "users", userObject.email), {
            name: userObject.name,
            email: userObject.email,
            picture: userObject.picture,
            loginAt: new Date().toISOString(),
          });
          console.log("✅ Saved to Firestore");
        } catch (err) {
          console.error("❌ Failed to save user in Firestore:", err);
        }
      }

      navigate("/");
    };

    const initializeGoogleSignIn = () => {
      if (window.google && buttonDivRef.current) {
        window.google.accounts.id.initialize({
          client_id: "734529005396-61h8k6ichq33uktiquis678vn1cejr0o.apps.googleusercontent.com",
          callback: handleCallback,
        });

        window.google.accounts.id.renderButton(buttonDivRef.current, {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at top left, #a8edea, #fed6e3),
                     radial-gradient(circle at bottom right, #f9f586, #a1c4fd)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="20%" cy="20%" r="60" fill="rgba(255,255,255,0.15)">
            <animate attributeName="r" values="60;80;60" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="80%" r="70" fill="rgba(255,255,255,0.12)">
            <animate attributeName="r" values="70;90;70" dur="12s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="50%" r="50" fill="rgba(255,255,255,0.1)">
            <animate attributeName="r" values="50;65;50" dur="14s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="relative p-10 rounded-lg shadow-xl bg-white bg-opacity-90 backdrop-blur-md w-full max-w-md flex flex-col items-center gap-8">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-urban-primary rounded-full flex items-center justify-center text-white font-bold text-lg select-none">
            UF
          </div>
          <span className="font-bold text-lg text-gray-900 select-none">Urban Fix</span>
        </div>

        <Lottie animationData={loginAnimation} loop style={{ width: 150, height: 150 }} />

        <h2 className="text-xl font-semibold mb-6 text-center mt-4 w-full text-gray-900">
          Sign in with Firebase Auth
        </h2>

        <div id="google-button" ref={buttonDivRef} className="w-full flex justify-center"></div>

        <button
          onClick={async () => {
            try {
              const result = await signInWithPopup(auth, provider);
              const user = result.user;

              localStorage.setItem("user", JSON.stringify(user));
              localStorage.setItem("token", await user.getIdToken());

              await setDoc(doc(db, "users", user.uid!), {
                name: user.displayName,
                email: user.email,
                // picture: user.photoURL,
                loginAt: serverTimestamp(),
              });

              navigate("/");
            } catch (err) {
              console.error("❌ Firebase Auth login failed:", err);
            }
          }}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Sign in using Firebase Auth
        </button>
      </div>
    </div>
  );
}
