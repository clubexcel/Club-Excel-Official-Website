"use client";

import React, { useState } from "react";

import DynamicAnswerFields, {
  DynamicFormFieldLite,
  validateDynamicAnswers,
} from "../../shared/components/DynamicAnswerFields";
import EditModalShell from "../../shared/components/EditModelShell";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "../../shared/components/FormField";

export interface RecruitmentResponseRecord {
  id: string;
  name: string;
  rollNumber: string;
  registrationNo: string;
  gender: "MALE" | "FEMALE";
  nistEmail: string;
  personalEmail: string;
  branch: string;
  hackerrankId: string;
  phoneNumber: string;
  locality: "LOCALITE" | "HOSTELITE";
  techStack: string;
  isSelected: boolean;
  answers: Record<string, unknown>;
}

export type RecruitmentFormFieldLite = DynamicFormFieldLite;

interface ResponseFormData {
  name: string;
  rollNumber: string;
  registrationNo: string;
  gender: "MALE" | "FEMALE";
  nistEmail: string;
  personalEmail: string;
  branch: string;
  hackerrankId: string;
  phoneNumber: string;
  locality: "LOCALITE" | "HOSTELITE";
  techStack: string;
  isSelected: boolean;
  answers: Record<string, string>;
}

type FixedFieldKey = Exclude<keyof ResponseFormData, "answers" | "isSelected">;

type FieldErrors = Partial<Record<FixedFieldKey, string>> & {
  answers?: Record<string, string>;
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const INSTITUTE_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@nist\.edu$/i;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;
const ROLL_NO_RE = /^[a-zA-Z0-9-\/]{3,20}$/;
const REG_NO_RE = /^[a-zA-Z0-9-\/]{3,20}$/;

const toFormData = (
  record: RecruitmentResponseRecord,
  formFields: RecruitmentFormFieldLite[]
): ResponseFormData => {
  const answers: Record<string, string> = {};

  for (const field of formFields) {
    const value = record.answers?.[field.name];
    answers[field.name] =
      value === undefined || value === null ? "" : String(value);
  }

  return {
    name: record.name,
    rollNumber: record.rollNumber,
    registrationNo: record.registrationNo,
    gender: record.gender,
    nistEmail: record.nistEmail,
    personalEmail: record.personalEmail,
    branch: record.branch,
    hackerrankId: record.hackerrankId,
    phoneNumber: record.phoneNumber,
    locality: record.locality,
    techStack: record.techStack,
    isSelected: record.isSelected,
    answers,
  };
};

const validate = (
  form: ResponseFormData,
  formFields: RecruitmentFormFieldLite[]
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "Required";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name is too short";
  }

  if (!form.rollNumber.trim()) {
    errors.rollNumber = "Required";
  } else if (!ROLL_NO_RE.test(form.rollNumber.trim())) {
    errors.rollNumber = "Invalid roll number";
  }

  if (!form.registrationNo.trim()) {
    errors.registrationNo = "Required";
  } else if (!REG_NO_RE.test(form.registrationNo.trim())) {
    errors.registrationNo = "Invalid registration number";
  }

  if (!form.branch.trim()) errors.branch = "Required";
  if (!form.hackerrankId.trim()) errors.hackerrankId = "Required";
  if (!form.techStack.trim()) errors.techStack = "Required";

  if (!form.nistEmail.trim()) {
    errors.nistEmail = "Required";
  } else if (!INSTITUTE_EMAIL_RE.test(form.nistEmail.trim())) {
    errors.nistEmail = "Must be a valid @nist.edu email";
  }

  if (!form.personalEmail.trim()) {
    errors.personalEmail = "Required";
  } else if (!EMAIL_RE.test(form.personalEmail.trim())) {
    errors.personalEmail = "Invalid email";
  } else if (INSTITUTE_EMAIL_RE.test(form.personalEmail.trim())) {
    errors.personalEmail = "Use a non-institute email here";
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = "Required";
  } else if (!PHONE_RE.test(form.phoneNumber.trim())) {
    errors.phoneNumber = "Invalid phone number";
  }

  const answerErrors = validateDynamicAnswers(form.answers, formFields);
  if (Object.keys(answerErrors).length > 0) errors.answers = answerErrors;

  return errors;
};

interface EditRecruitmentResponseModalProps {
  record: RecruitmentResponseRecord;
  formFields: RecruitmentFormFieldLite[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (
    id: string,
    data: Omit<ResponseFormData, "answers"> & {
      answers: Record<string, string>;
    }
  ) => Promise<void> | void;
}

const EditRecruitmentResponseModal = ({
  record,
  formFields,
  isSaving,
  onClose,
  onSave,
}: EditRecruitmentResponseModalProps) => {
  const [form, setForm] = useState<ResponseFormData>(() =>
    toFormData(record, formFields)
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateField = <K extends keyof Omit<ResponseFormData, "answers">>(
    key: K,
    value: ResponseFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateAnswer = (name: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      answers: { ...prev.answers, [name]: value },
    }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(form, formFields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    await onSave(record.id, form);
  };

  return (
    <EditModalShell
      title="Edit Application"
      subtitle="Correct any mistakes the applicant made in their submission."
      isSaving={isSaving}
      onClose={onClose}
      onSubmit={handleSubmit}
      maxWidthClassName="max-w-2xl"
    >
      <TextField
        label="Full Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Roll Number"
          value={form.rollNumber}
          onChange={(e) => updateField("rollNumber", e.target.value)}
          error={errors.rollNumber}
        />
        <TextField
          label="Registration No."
          value={form.registrationNo}
          onChange={(e) => updateField("registrationNo", e.target.value)}
          error={errors.registrationNo}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          value={form.gender}
          onChange={(e) =>
            updateField("gender", e.target.value as ResponseFormData["gender"])
          }
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
        />
        <TextField
          label="Branch"
          value={form.branch}
          onChange={(e) => updateField("branch", e.target.value)}
          error={errors.branch}
        />
      </div>

      <TextField
        label="NIST Email"
        type="email"
        value={form.nistEmail}
        onChange={(e) => updateField("nistEmail", e.target.value)}
        error={errors.nistEmail}
      />

      <TextField
        label="Personal Email"
        type="email"
        value={form.personalEmail}
        onChange={(e) => updateField("personalEmail", e.target.value)}
        error={errors.personalEmail}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="HackerRank ID"
          value={form.hackerrankId}
          onChange={(e) => updateField("hackerrankId", e.target.value)}
          error={errors.hackerrankId}
        />
        <TextField
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
        />
      </div>

      <SelectField
        label="Locality"
        value={form.locality}
        onChange={(e) =>
          updateField(
            "locality",
            e.target.value as ResponseFormData["locality"]
          )
        }
        options={[
          { label: "Localite", value: "LOCALITE" },
          { label: "Hostelite", value: "HOSTELITE" },
        ]}
      />

      <TextAreaField
        label="Target Tech Stack"
        value={form.techStack}
        onChange={(e) => updateField("techStack", e.target.value)}
        error={errors.techStack}
        rows={3}
      />

      <SelectField
        label="Selection Status"
        value={form.isSelected ? "selected" : "pending"}
        onChange={(e) =>
          updateField("isSelected", e.target.value === "selected")
        }
        options={[
          { label: "Pending", value: "pending" },
          { label: "Selected", value: "selected" },
        ]}
      />

      <DynamicAnswerFields
        formFields={formFields}
        answers={form.answers}
        rawAnswers={record.answers}
        errors={errors.answers}
        onChange={updateAnswer}
        heading="Additional Details"
      />
    </EditModalShell>
  );
};

export default EditRecruitmentResponseModal;
