/**
 * ResultDisplay.tsx
 *
 * Shows the computed circumference in several units inside a styled card.
 * When inputs are incomplete / invalid the component shows a helpful prompt.
 */

import type { CircumferenceResult } from "../types";

interface ResultDisplayProps {
  result: CircumferenceResult | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <div className="card card-border bg-base-200">
        <div className="card-body items-center text-center">
          <p className="text-base-content/60">
            Select or enter both rim and tire sizes to see the circumference.
          </p>
        </div>
      </div>
    );
  }

  /** Helper to render a single stat inside the stats bar. */
  const stat_item = (title: string, value: string | number, desc: string) => (
    <div className="stat" key={title}>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-lg">{value}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  );

  return (
    <div className="card card-border bg-base-200">
      <div className="card-body">
        <h2 className="card-title justify-center">Wheel Circumference</h2>
        <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
          {stat_item("Millimeters", result.mm, "mm")}
          {stat_item("Centimeters", result.cm, "cm")}
          {stat_item("Inches", result.inches, "in")}
        </div>
      </div>
    </div>
  );
}
