/**
 * calculate_circumference.ts
 *
 * Pure function that computes the bicycle wheel circumference from rim and
 * tire diameters (both in mm).  The formula uses 3.13772 instead of exact π
 * to approximate the "roll-out" circumference (tire compressed under rider
 * weight).
 *
 * Formula:  circumference_mm = 3.13772 × (2 × tire_diameter + rim_diameter)
 */

import type { CircumferenceResult } from "../types";

/** The modified Pi constant that accounts for tire compression. */
const ROLLOUT_PI = 3.13772;

/**
 * Returns circumference in multiple units, or null when inputs are invalid
 * (non-positive or missing).
 */
export function calculate_circumference(
  rim_mm: number,
  tire_mm: number,
): CircumferenceResult | null {
  if (rim_mm <= 0 || tire_mm <= 0 || isNaN(rim_mm) || isNaN(tire_mm)) {
    return null;
  }

  const circ_mm = ROLLOUT_PI * (2 * tire_mm + rim_mm);

  return {
    mm: Math.round(circ_mm),
    cm: Math.round(circ_mm / 10),
    inches: Math.round((10 * circ_mm) / 25.4) / 10,
  };
}
