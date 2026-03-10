/**
 * App.tsx — root component for the Bicycle Wheel Circumference calculator.
 *
 * State management:
 *  - Each selector (rim / tire) tracks two pieces of state:
 *      1. The currently selected dropdown label (or "__custom__").
 *      2. The raw text-input value (kept as a string for UX).
 *  - When a dropdown option is chosen its diameter_mm fills the text input.
 *  - When the user types a number, we search for the first option whose
 *    diameter_mm matches; if none match we set the dropdown to "Custom".
 *  - The circumference result is derived (not stored) on every render.
 */

import { useState, useMemo } from "react";
import tire_size_data from "./data/tire_sizes.json";
import type { TireSizeData, SizeOption } from "./types";
import SizeSelector, { CUSTOM_VALUE } from "./components/SizeSelector";
import ResultDisplay from "./components/ResultDisplay";
import { calculate_circumference } from "./utils/calculate_circumference";

/** Typed reference to the imported JSON. */
const data: TireSizeData = tire_size_data;

/**
 * Given a numeric value, find the first option whose diameter_mm matches.
 * Returns the option's label, or CUSTOM_VALUE when nothing matches.
 */
function find_matching_option(value: number, options: SizeOption[]): string {
  const match = options.find((o) => o.diameter_mm === value);
  return match ? match.label : CUSTOM_VALUE;
}

export default function App() {
  /* ── Rim state ─────────────────────────────────────────────── */
  const [rim_option, set_rim_option] = useState<string>("");
  const [rim_input, set_rim_input] = useState<string>("");

  /* ── Tire state ────────────────────────────────────────────── */
  const [tire_option, set_tire_option] = useState<string>("");
  const [tire_input, set_tire_input] = useState<string>("");

  /* ── Derived circumference result ──────────────────────────── */
  const result = useMemo(
    () =>
      calculate_circumference(parseFloat(rim_input), parseFloat(tire_input)),
    [rim_input, tire_input],
  );

  /* ── Handlers: Rim ─────────────────────────────────────────── */
  const handle_rim_option = (label: string) => {
    set_rim_option(label);
    // When "Custom" is chosen, leave the text input alone.
    if (label === CUSTOM_VALUE) return;
    const match = data.wheel_sizes.find((o) => o.label === label);
    if (match) set_rim_input(String(match.diameter_mm));
  };

  const handle_rim_input = (raw: string) => {
    set_rim_input(raw);
    const num = parseFloat(raw);
    if (isNaN(num)) {
      set_rim_option(CUSTOM_VALUE);
      return;
    }
    set_rim_option(find_matching_option(num, data.wheel_sizes));
  };

  /* ── Handlers: Tire ────────────────────────────────────────── */
  const handle_tire_option = (label: string) => {
    set_tire_option(label);
    if (label === CUSTOM_VALUE) return;
    const match = data.tire_sizes.find((o) => o.label === label);
    if (match) set_tire_input(String(match.diameter_mm));
  };

  const handle_tire_input = (raw: string) => {
    set_tire_input(raw);
    const num = parseFloat(raw);
    if (isNaN(num)) {
      set_tire_option(CUSTOM_VALUE);
      return;
    }
    set_tire_option(find_matching_option(num, data.tire_sizes));
  };

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card card-border bg-base-100 shadow-xl w-full max-w-lg">
        <div className="card-body gap-6">
          <h1 className="card-title justify-center text-2xl">
          Tire Size Calculator
          </h1>

          {/* Rim size selector */}
          <SizeSelector
            label="Rim Size"
            options={data.wheel_sizes}
            selected_option={rim_option}
            input_value={rim_input}
            on_option_change={handle_rim_option}
            on_input_change={handle_rim_input}
          />

          {/* Tire size selector */}
          <SizeSelector
            label="Tire Size"
            options={data.tire_sizes}
            selected_option={tire_option}
            input_value={tire_input}
            on_option_change={handle_tire_option}
            on_input_change={handle_tire_input}
          />

          <div className="divider">Results</div>

          {/* Computed output */}
          <ResultDisplay result={result} />
        </div>
      </div>
    </div>
  );
}
