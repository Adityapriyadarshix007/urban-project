import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import privacyAnimation from "@/assets/privacy.json"; // Make sure this file exists

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-muted text-muted-foreground py-12 px-6 md:px-12 overflow-hidden">

      {/* Lottie animation at the top */}
      <div className="w-full max-w-md mx-auto mb-8">
        <Lottie animationData={privacyAnimation} loop autoplay />
      </div>

      <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>

        <p className="mb-4">
          Urban Fix is committed to protecting your privacy. This Privacy Policy outlines how we collect,
          use, disclose, and safeguard your information when you visit our platform or use our services.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>Personal identification information (Name, email, etc.)</li>
          <li>Location data (if you grant permission)</li>
          <li>Device and usage data through analytics</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>To facilitate civic issue reporting</li>
          <li>To improve the platform experience</li>
          <li>To communicate service updates</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Sharing of Information</h2>
        <p className="mb-4">
          We do not sell your information. Your data is shared only with local authorities for issue
          resolution, and third-party tools used strictly for service improvement.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your information from unauthorized
          access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h2>
        <p className="mb-4">
          You may request access to, correction of, or deletion of your personal data. Contact us
          for assistance at{" "}
          <a href="mailto:support@urbanfix.com" className="text-urban-primary underline">
            support@urbanfix.com
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. Changes will be posted on this page with the
          updated revision date.
        </p>

        <Link
          to="/"
          className="inline-block mt-4 text-sm text-urban-primary hover:underline transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;