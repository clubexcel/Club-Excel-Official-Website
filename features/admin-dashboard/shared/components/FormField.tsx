"use client";

import React from "react";

interface LabelRowProps {
  label: string;
  optional?: boolean;
  error?: string;
}

const LabelRow = ({ label, optional, error }: LabelRowProps) => (
  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
    {label}
    {optional && (
      <span className="ml-1 normal-case tracking-normal text-neutral-600">
        (optional)
      </span>
    )}
    {error && (
      <span className="ml-2 normal-case tracking-normal text-red-400">
        — {error}
      </span>
    )}
  </label>
);

const fieldClass = (hasError?: string) =>
  `w-full mt-1 rounded-xl bg-white/5 border px-4 py-3 text-white text-sm outline-none transition focus:outline-none ${
    hasError ? "border-red-500" : "border-white/10 focus:border-white/20"
  }`;

interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  label: string;
  optional?: boolean;
  error?: string;
}

export const TextField = ({
  label,
  optional,
  error,
  onWheel,
  ...inputProps
}: TextFieldProps) => {
  const preventScrollChange = (e: React.WheelEvent<HTMLInputElement>) => {
    if (inputProps.type === "number" || inputProps.type === "datetime-local") {
      e.currentTarget.blur();
    }
  };

  return (
    <div>
      <LabelRow label={label} optional={optional} error={error} />
      <input
        {...inputProps}
        onWheel={onWheel ?? preventScrollChange}
        className={fieldClass(error)}
      />
    </div>
  );
};

interface TextAreaFieldProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
}

export const TextAreaField = ({
  label,
  optional,
  error,
  hint,
  rows = 4,
  ...textareaProps
}: TextAreaFieldProps) => (
  <div>
    <LabelRow label={label} optional={optional} error={error} />
    <textarea
      {...textareaProps}
      rows={rows}
      className={`${fieldClass(error)} resize-none`}
    />
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

interface SelectFieldProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> {
  label: string;
  optional?: boolean;
  error?: string;
  options: { label: string; value: string }[];
}

export const SelectField = ({
  label,
  optional,
  error,
  options,
  ...selectProps
}: SelectFieldProps) => (
  <div>
    <LabelRow label={label} optional={optional} error={error} />
    <select {...selectProps} className={fieldClass(error)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#0A0A0A]">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

interface ReadOnlyFieldProps {
  label: string;
  value: React.ReactNode;
}

export const ReadOnlyField = ({ label, value }: ReadOnlyFieldProps) => (
  <div>
    <LabelRow label={label} />
    <div className="w-full mt-1 rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-neutral-400 text-sm break-all">
      {value || "—"}
    </div>
  </div>
);
