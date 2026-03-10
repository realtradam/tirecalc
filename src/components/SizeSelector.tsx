/**
 * SizeSelector.tsx
 *
 * A reusable pair of <select> + <input> for choosing a rim or tire size.
 *
 * Behaviour:
 *  - Selecting a dropdown option fills the text input with its diameter_mm.
 *  - Typing a number in the text input auto-selects the first matching
 *    dropdown option, or falls back to "Custom" if no match exists.
 *  - Choosing "Custom" in the dropdown does nothing to the text input.
 */

import type { SizeOption } from "../types";

/** Sentinel value used as the <option> value for "Custom". */
const CUSTOM_VALUE = "__custom__";

interface SizeSelectorProps {
  /** Human-readable label shown above the controls. */
  label: string;
  /** The list of predefined size options to populate the dropdown. */
  options: SizeOption[];
  /** Currently selected dropdown value (a label string or CUSTOM_VALUE). */
  selected_option: string;
  /** Current numeric value in the text input (as a string so we can allow empty). */
  input_value: string;
  /** Called when the dropdown selection changes. */
  on_option_change: (option_value: string) => void;
  /** Called when the text input value changes. */
  on_input_change: (value: string) => void;
}

export default function SizeSelector({
  label,
  options,
  selected_option,
  input_value,
  on_option_change,
  on_input_change,
}: SizeSelectorProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>

      {/* Dropdown for predefined sizes */}
      <select
        className="select select-bordered w-full"
        value={selected_option}
        aria-label={`${label} preset`}
        onChange={(e) => on_option_change(e.target.value)}
      >
        <option disabled value="">
          Pick a size
        </option>
        {options.map((opt, idx) => (
          <option key={`${opt.label}-${idx}`} value={opt.label}>
            {opt.label} ({opt.diameter_mm} mm)
          </option>
        ))}
        <option value={CUSTOM_VALUE}>Custom</option>
      </select>

      {/* Numeric text input — mirrors / overrides the dropdown */}
      <label className="input w-full mt-2">
        <input
          type="number"
          step="any"
          min="0"
          className="grow"
          placeholder="mm"
          value={input_value}
          aria-label={`${label} diameter in mm`}
          onChange={(e) => on_input_change(e.target.value)}
        />
        <span className="label">mm</span>
      </label>
    </fieldset>
  );
}

export { CUSTOM_VALUE };
