/**
 * Type definitions for the tire size data used throughout the app.
 * Each size entry has a human-readable label and a diameter in millimeters.
 */

/** A single rim or tire size option from our reference data. */
export interface SizeOption {
  label: string;
  diameter_mm: number;
}

/** The shape of the imported tire_sizes.json file. */
export interface TireSizeData {
  wheel_sizes: SizeOption[];
  tire_sizes: SizeOption[];
}

/**
 * Results from the circumference calculation.
 * All values derived from: circumference = 3.13772 * (2 * tire + rim)
 */
export interface CircumferenceResult {
  mm: number;
  cm: number;
  inches: number;
}
