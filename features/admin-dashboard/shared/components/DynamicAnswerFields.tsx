"use client";

import { ReadOnlyField, TextField } from "./FormField";

export interface DynamicFormFieldLite {
  name: string;
  label: string;
  type: "TEXT" | "TEXTAREA" | "URL" | "NUMBER" | "EMAIL" | "PHONE" | "FILE";
  required: boolean;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const URL_RE = /^https?:\/\/\S+/;
const NUMBER_RE = /^\d+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;
export const validateDynamicAnswers = (
  answers: Record<string, string>,
  formFields: DynamicFormFieldLite[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const field of formFields) {
    if (field.type === "FILE") continue;

    const value = answers[field.name]?.trim() ?? "";

    if (field.required && !value) {
      errors[field.name] = "Required";
      continue;
    }

    if (!value) continue;

    switch (field.type) {
      case "EMAIL":
        if (!EMAIL_RE.test(value)) errors[field.name] = "Invalid email";
        break;
      case "URL":
        if (!URL_RE.test(value)) errors[field.name] = "Invalid URL";
        break;
      case "NUMBER":
        if (!NUMBER_RE.test(value)) errors[field.name] = "Must be numeric";
        break;
      case "PHONE":
        if (!PHONE_RE.test(value)) errors[field.name] = "Invalid phone number";
        break;
      default:
        break;
    }
  }

  return errors;
};

interface DynamicAnswerFieldsProps {
  formFields: DynamicFormFieldLite[];
  answers: Record<string, string>;
  rawAnswers?: Record<string, unknown>;
  errors?: Record<string, string>;
  onChange: (name: string, value: string) => void;
  heading?: string;
}

const DynamicAnswerFields = ({
  formFields,
  answers,
  rawAnswers,
  errors = {},
  onChange,
  heading = "Custom Form Answers",
}: DynamicAnswerFieldsProps) => {
  if (formFields.length === 0) return null;

  return (
    <div className="space-y-5 border-t border-white/10 pt-5">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
        {heading}
      </p>

      {formFields.map((field) =>
        field.type === "FILE" ? (
          <ReadOnlyField
            key={field.name}
            label={field.label}
            value={String(rawAnswers?.[field.name] ?? "")}
          />
        ) : field.type === "TEXTAREA" ? (
          <div key={field.name}>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              {field.label}
              {errors[field.name] && (
                <span className="ml-2 normal-case tracking-normal text-red-400">
                  — {errors[field.name]}
                </span>
              )}
            </label>
            <textarea
              rows={3}
              value={answers[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={`w-full mt-1 rounded-xl bg-white/5 border px-4 py-3 text-white text-sm resize-none outline-none transition ${
                errors[field.name]
                  ? "border-red-500"
                  : "border-white/10 focus:border-white/20"
              }`}
            />
          </div>
        ) : (
          <TextField
            key={field.name}
            label={field.label}
            value={answers[field.name] ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            error={errors[field.name]}
          />
        )
      )}
    </div>
  );
};

export default DynamicAnswerFields;
