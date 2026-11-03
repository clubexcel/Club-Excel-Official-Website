"use client";

import React, { useState } from "react";
import EditModalShell from "../../shared/components/EditModelShell";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "../../shared/components/FormField";

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  message: string;
  status: "PENDING" | "READ" | "RESOLVED";
}

interface InquiryFormData {
  name: string;
  email: string;
  phoneNo: string;
  message: string;
  status: ContactInquiryRecord["status"];
}

type FieldErrors = Partial<Record<keyof InquiryFormData, string>>;

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const toFormData = (record: ContactInquiryRecord): InquiryFormData => ({
  name: record.name,
  email: record.email,
  phoneNo: record.phoneNo,
  message: record.message,
  status: record.status,
});

const validate = (form: InquiryFormData): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.name.trim()) errors.name = "Required";
  if (!form.message.trim()) errors.message = "Required";

  if (!form.email.trim()) {
    errors.email = "Required";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Invalid email";
  }

  return errors;
};

interface EditInquiryModalProps {
  record: ContactInquiryRecord;
  isSaving: boolean;
  onClose: () => void;
  onSave: (id: string, data: InquiryFormData) => Promise<void> | void;
}

const EditInquiryModal = ({
  record,
  isSaving,
  onClose,
  onSave,
}: EditInquiryModalProps) => {
  const [form, setForm] = useState<InquiryFormData>(() => toFormData(record));
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateField = <K extends keyof InquiryFormData>(
    key: K,
    value: InquiryFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    await onSave(record.id, form);
  };

  return (
    <EditModalShell
      title="Edit Query"
      subtitle="Correct any mistakes made in this contact submission."
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
      />

      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        error={errors.email}
      />

      <TextField
        label="Phone"
        optional
        value={form.phoneNo}
        onChange={(e) => updateField("phoneNo", e.target.value)}
      />

      <TextAreaField
        label="Message"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        error={errors.message}
      />

      <SelectField
        label="Status"
        value={form.status}
        onChange={(e) =>
          updateField("status", e.target.value as InquiryFormData["status"])
        }
        options={[
          { label: "Pending", value: "PENDING" },
          { label: "Read", value: "READ" },
          { label: "Resolved", value: "RESOLVED" },
        ]}
      />
    </EditModalShell>
  );
};

export default EditInquiryModal;
