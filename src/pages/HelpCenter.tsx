import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import helpAnimation from "@/assets/help-center.json"; // Make sure this file exists

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-muted text-muted-foreground py-12 px-6 md:px-12 overflow-hidden">

      {/* Lottie animation at the top */}
      <div className="w-full max-w-md mx-auto mb-8">
        <Lottie animationData={helpAnimation} loop autoplay />
      </div>

      <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Help Center</h1>

        <p className="mb-4">
          Welcome to the Urban Fix Help Center. Below you'll find answers to common questions and
          guidance on how to report and track civic issues using our platform.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. How do I report an issue?</h2>
        <p className="mb-4">
          Simply click the <Link to="/report" className="text-urban-primary hover:underline transition">Report Issue</Link> button in the navigation menu. Fill in the
          details such as issue category, photo, location, and an optional description, then submit.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How can I track my reports?</h2>
        <p className="mb-4">
          Visit the <Link to="/reports" className="text-urban-primary hover:underline transition">My Reports</Link> section to view the status of all issues you’ve reported.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Who resolves the issues?</h2>
        <p className="mb-4">
          Your reports are forwarded to the relevant municipal or local authority for resolution.
          Urban Fix serves as the platform to connect citizens and officials.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. What if I entered the wrong information?</h2>
        <p className="mb-4">
          Once a report is submitted, you cannot edit it through the platform. You may reach out to
          our support team to request a correction.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Need more help?</h2>
        <p className="mb-4">
          Email our team at{" "}
          <a href="mailto:support@urbanfix.com" className="text-urban-primary underline">
            support@urbanfix.com
          </a>{" "}
          and we’ll assist you as soon as possible.
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

export default HelpCenter;