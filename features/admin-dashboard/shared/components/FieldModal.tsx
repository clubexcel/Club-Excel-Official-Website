"use client";

import { FieldType } from "@prisma/client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface FieldValues {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  initialValues?: FieldValues;

  onClose: () => void;

  onSubmit: (data: FieldValues) => void;
}

const EMPTY_VALUES: FieldValues = {
  name: "",
  label: "",
  type: FieldType.TEXT,
  required: false,
  placeholder: "",
};

export default function FieldModal({
  open,
  loading,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const isEditing = Boolean(initialValues);

  const [label, setLabel] = useState(initialValues?.label ?? "");

  const [name, setName] = useState(initialValues?.name ?? "");

  const [type, setType] = useState<FieldType>(
    initialValues?.type ?? FieldType.TEXT
  );

  const [required, setRequired] = useState(initialValues?.required ?? false);

  const [placeholder, setPlaceholder] = useState(
    initialValues?.placeholder ?? ""
  );

  useEffect(() => {
    if (open) {
      const values = initialValues ?? EMPTY_VALUES;
      setLabel(values.label);
      setName(values.name);
      setType(values.type);
      setRequired(values.required);
      setPlaceholder(values.placeholder);
    }
  }, [open, initialValues]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A0A0A] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Edit Registration Field" : "Add Registration Field"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Label
            </label>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Field Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="github_url"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value as FieldType)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            >
              {Object.values(FieldType).map((field) => (
                <option key={field} value={field} className="bg-[#111]">
                  {field}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500">
              Placeholder
            </label>

            <input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </div>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            Required
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-3 text-white"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={() =>
                onSubmit({
                  label,
                  name,
                  type,
                  required,
                  placeholder,
                })
              }
              className="flex-1 rounded-xl bg-white py-3 font-semibold text-black"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
