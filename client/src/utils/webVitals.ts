import type { Metric } from "web-vitals";

export const reportWebVitals = () => {
  import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const logMetric = (metric: Metric) => {
      if (process.env.NODE_ENV === "development") {
        console.info(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}`);
      }
    };

    onCLS(logMetric);
    onINP(logMetric);
    onFCP(logMetric);
    onLCP(logMetric);
    onTTFB(logMetric);
  });
};
