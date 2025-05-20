import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  suffix?: string;
}

export const CountUpNumber = ({ target, duration = 2000, suffix = "" }: CountUpNumberProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    let current = 0;
    const fps = 60;
    const steps = (duration / 1000) * fps;
    const increment = target / steps;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(counter);
        setCount(target);
        setHasAnimated(true);
      } else {
        setCount(Math.round(current));
      }
    }, 1000 / fps);

    return () => clearInterval(counter); // cleanup on unmount
  }, [isVisible, hasAnimated, target, duration]);

  // Reset animation state when not visible
  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      setHasAnimated(false);
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};
