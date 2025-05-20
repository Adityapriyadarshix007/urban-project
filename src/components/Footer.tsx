import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  const [showGithub, setShowGithub] = useState(false);
  const [showLinkedin, setShowLinkedin] = useState(false);

  const githubTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const linkedinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHover = (type: "github" | "linkedin") => {
    if (type === "github") {
      if (githubTimeoutRef.current) clearTimeout(githubTimeoutRef.current);
      setShowGithub(true);
    } else {
      if (linkedinTimeoutRef.current) clearTimeout(linkedinTimeoutRef.current);
      setShowLinkedin(true);
    }
  };

  const handleMouseLeave = (type: "github" | "linkedin") => {
    if (type === "github") {
      githubTimeoutRef.current = setTimeout(() => setShowGithub(false), 500);
    } else {
      linkedinTimeoutRef.current = setTimeout(() => setShowLinkedin(false), 500);
    }
  };

  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Urban Fix</h3>
            <p className="text-sm text-muted-foreground">
              A smart civic issue reporting platform connecting citizens with local
              authorities.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  My Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help-center"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-urban-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                <span>Email: support@urbanfix.com</span>
              </li>
              <li className="text-sm text-muted-foreground">
                <span>Phone: (123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Urban Fix. All rights reserved.
            </p>

            {/* Social icons container */}
            <div className="flex space-x-6 relative">
              {/* GitHub icon with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleHover("github")}
                onMouseLeave={() => handleMouseLeave("github")}
              >
                <FaGithub className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
                {showGithub && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-background/90 border border-border rounded-lg shadow-md p-3 flex flex-col gap-3 z-50 backdrop-blur-md min-w-[140px]">
                    <a
                      href="https://github.com/anusha1808"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaGithub className="h-5 w-5" />
                      Account 1
                    </a>
                    <a
                      href="https://github.com/adityapriyadarshix007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaGithub className="h-5 w-5" />
                      Account 2
                    </a>
                  </div>
                )}
              </div>

              {/* LinkedIn icon with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleHover("linkedin")}
                onMouseLeave={() => handleMouseLeave("linkedin")}
              >
                <FaLinkedin className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
                {showLinkedin && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-background/90 border border-border rounded-lg shadow-md p-3 flex flex-col gap-3 z-50 backdrop-blur-md min-w-[140px]">
                    <a
                      href="https://www.linkedin.com/in/anushagupta18"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaLinkedin className="h-5 w-5" />
                      Profile 1
                    </a>
                    <a
                      href="https://linkedin.com/in/aditya-priyadarshi-026816282"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FaLinkedin className="h-5 w-5" />
                      Profile 2
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}