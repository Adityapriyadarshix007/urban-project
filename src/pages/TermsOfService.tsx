import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import termsAnimation from "@/assets/terms.json"; // Make sure this file exists

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-muted text-muted-foreground py-12 px-6 md:px-12 overflow-hidden">
      
      {/* Lottie animation at the top */}
      <div className="w-full max-w-md mx-auto mb-8">
        <Lottie animationData={termsAnimation} loop autoplay />
      </div>

      <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>

        <p className="mb-4">
          These Terms of Service ("Terms") govern your use of the Urban Fix website, services,
          and platform provided by Urban Fix. By accessing or using our platform, you agree to be
          bound by these Terms. If you do not agree with any part of the Terms, you must not use
          our services.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing our website or using our services, you confirm that you have read, understood,
          and agreed to be bound by these Terms and our Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Use of the Platform</h2>
        <p className="mb-4">
          You agree to use the Urban Fix platform only for lawful purposes. You may not use our
          services in any way that violates local, state, national, or international laws or
          regulations.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Conduct</h2>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>You will not impersonate others or provide false information.</li>
          <li>You will not upload harmful, obscene, or abusive content.</li>
          <li>You will not disrupt or interfere with the platform's functionality.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          All content, trademarks, and data on this website are the property of Urban Fix or its
          licensors. Unauthorized use is strictly prohibited without prior written permission.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">
          Urban Fix shall not be held liable for any direct, indirect, incidental, or consequential
          damages arising from your use or inability to use the platform.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Modifications</h2>
        <p className="mb-4">
          We reserve the right to update or change these Terms at any time. Changes will be effective
          immediately upon posting on this page. Your continued use of the platform after changes
          constitutes acceptance of those changes.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws of [Your Country/State],
          and you submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
        <p className="mb-6">
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:support@urbanfix.com" className="text-urban-primary underline">
            support@urbanfix.com
          </a>.
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

export default TermsOfService;