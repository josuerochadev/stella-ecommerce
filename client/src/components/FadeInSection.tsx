import type React from "react";
import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "@/hooks";

interface FadeInSectionProps {
  children: React.ReactNode;
  duration?: number;
  translateY?: number;
  customClass?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  duration = 1000,
  translateY = 10,
  customClass = "",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (prefersReducedMotion) {
    return <div className={customClass}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-${duration} ease-out transform ${
        inView ? "opacity-100 translate-y-0" : `opacity-0 translate-y-${translateY}px`
      } ${customClass}`}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
