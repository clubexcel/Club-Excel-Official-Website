"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import {
  Send,
  MessageCircle,
  User,
  Hash,
  Mail,
  BookOpen,
  Code,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useSubmitRecruitment } from "@/hooks/useRecruitments";

interface DriveFormField {
  id: string;
  name: string;
  label: string;
  type: "TEXT" | "TEXTAREA" | "URL" | "NUMBER" | "EMAIL" | "PHONE" | "FILE";
  required: boolean;
  placeholder: string | null;
}

interface DriveData {
  id: string;
  title: string;
  formFields: DriveFormField[];
  whatsappLink: string | null;
}

const recruitmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
  registrationNo: z.string().min(1, "Registration number is required"),
  gender: z.enum(["MALE", "FEMALE"], {
    error: "Please select a gender",
  }),
  nistEmail: z
    .string()
    .email("Enter a valid NIST email")
    .regex(/^[a-zA-Z0-9._%+-]+@nist\.edu$/i, "Must be a valid @nist.edu email"),
  personalEmail: z
    .string()
    .email("Enter a valid personal email")
    .refine(
      (val) => !/^[a-zA-Z0-9._%+-]+@nist\.edu$/i.test(val),
      "Use a non-institute email here"
    ),
  branch: z.string().min(1, "Branch is required"),
  hackerrankId: z.string().min(1, "HackerRank ID is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number").max(15),
  locality: z.enum(["LOCALITE", "HOSTELITE"], {
    error: "Please select locality",
  }),
  techStack: z.string().min(3, "Please describe your target tech stack"),
});

type RecruitmentFormData = z.infer<typeof recruitmentSchema>;

const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
      )}
      <input
        className={`w-full bg-white/[0.03] border rounded-2xl ${Icon ? "pl-12" : "pl-4"} pr-4 py-4 text-white focus:outline-none transition-all text-sm font-medium ${error ? "border-red-500/50 focus:border-red-500" : "border-white/5 focus:border-blue-500/50"}`}
        {...props}
      />
    </div>
    {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
  </div>
);

interface RecruitmentProps {
  driveId: string;
}

const Recruitment = ({ driveId }: RecruitmentProps) => {
  const [whatsappLink, setWhatsappLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    submitRecruitment,
    loading: isPending,
    error: hookError,
  } = useSubmitRecruitment(driveId);
  const [submitError, setSubmitError] = useState("");
  const [drive, setDrive] = useState<DriveData | null>(null);

  const [formData, setFormData] = useState<RecruitmentFormData>({
    name: "",
    rollNumber: "",
    registrationNo: "",
    gender: "MALE",
    nistEmail: "",
    personalEmail: "",
    branch: "",
    hackerrankId: "",
    phoneNumber: "",
    locality: "HOSTELITE",
    techStack: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hookError) setSubmitError(hookError.message);
  }, [hookError]);

  useEffect(() => {
    if (!driveId) {
      setDrive(null);
      return;
    }

    let mounted = true;

    axios
      .get(`/api/recruitment/${driveId}`)
      .then(({ data }) => {
        if (mounted && data.success) {
          setDrive(data.drive);
          setWhatsappLink(data.drive.whatsappLink || "");
        }
      })
      .catch(() => {
        if (mounted) setDrive(null);
      });

    return () => {
      mounted = false;
    };
  }, [driveId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as any;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAnswerChange = (fieldName: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const validateDynamicFields = () => {
    const nextErrors: Record<string, string> = {};

    for (const field of drive?.formFields ?? []) {
      const value = answers[field.name]?.trim();

      if (field.required && (!value || value.length === 0)) {
        nextErrors[field.name] = `${field.label} is required`;
        continue;
      }

      if (!value) continue;

      switch (field.type) {
        case "EMAIL":
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            nextErrors[field.name] = `${field.label} must be a valid email`;
          }
          break;
        case "NUMBER":
          if (!/^\d+$/.test(value)) {
            nextErrors[field.name] = `${field.label} must be numeric`;
          }
          break;
        case "PHONE":
          if (!/^\+?[0-9\s-]{7,15}$/.test(value)) {
            nextErrors[field.name] =
              `${field.label} must be a valid phone number`;
          }
          break;
        case "URL":
          if (!/^https?:\/\/\S+/.test(value)) {
            nextErrors[field.name] = `${field.label} must be a valid URL`;
          }
          break;
        default:
          break;
      }
    }

    return nextErrors;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrors({});
    setSubmitError("");

    const result = recruitmentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RecruitmentFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const dynamicErrors = validateDynamicFields();
    if (Object.keys(dynamicErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...dynamicErrors }));
      return;
    }

    try {
      await submitRecruitment({
        ...result.data,
        answers,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError((err as Error).message || "Submission failed");
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
          Success!
        </h1>
        <p className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed mb-12">
          Your application has been received. Join our WhatsApp group to stay
          updated.
        </p>
        <div className="flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:w-auto sm:flex-row">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-green-500 sm:w-auto sm:px-8 sm:text-sm"
            >
              <MessageCircle className="w-5 h-5 shrink-0" /> Join WhatsApp Group
            </a>
          )}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 sm:w-auto sm:px-8 sm:text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 uppercase leading-[0.9]">
              Level <br />
              <span className="text-blue-500">Up</span>
            </h1>
            <p className="text-neutral-400 max-w-md text-lg font-light leading-relaxed">
              Join Club Excel and be part of the most elite tech community. Fill
              out the application to start your journey.
            </p>
          </div>
          <div className="space-y-6 pt-8">
            {[
              {
                icon: Code,
                color: "blue",
                title: "Technical Prowess",
                desc: "Showcase your skills in programming, development, and problem solving.",
              },
              {
                icon: MessageCircle,
                color: "purple",
                title: "Community",
                desc: "Engage with our recruitment community and stay updated via WhatsApp.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className={`flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-${color}-500/30 transition-all duration-500`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 uppercase tracking-wider">
                    {title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-transparent blur-3xl -z-10 opacity-50" />
          <form
            onSubmit={onSubmit}
            className="bg-[#080808] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 backdrop-blur-xl shadow-2xl"
          >
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                icon={User}
                name="name"
                type="text"
                placeholder="Enter your name"
                error={errors.name}
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                label="Roll Number"
                icon={Hash}
                name="rollNumber"
                type="text"
                placeholder="e.g. 23XXXX"
                error={errors.rollNumber}
                value={formData.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Registration No"
                icon={Hash}
                name="registrationNo"
                type="text"
                placeholder="e.g. 230110XXX"
                error={errors.registrationNo}
                value={formData.registrationNo}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">
                  Gender
                </label>
                <div className="flex gap-3">
                  {(["MALE", "FEMALE"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: g }))
                      }
                      className={`flex-1 py-4 rounded-2xl border transition-all uppercase text-[10px] font-black tracking-widest ${formData.gender === g ? "bg-blue-500 border-blue-500 text-white" : "bg-white/[0.03] border-white/5 text-neutral-500 hover:border-white/10"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-400 text-xs ml-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="NIST Email"
                icon={Mail}
                name="nistEmail"
                type="email"
                placeholder="...@nist.edu"
                error={errors.nistEmail}
                value={formData.nistEmail}
                onChange={handleChange}
              />
              <InputField
                label="Personal Email"
                icon={Mail}
                name="personalEmail"
                type="email"
                placeholder="your@email.com"
                error={errors.personalEmail}
                value={formData.personalEmail}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Branch"
                icon={BookOpen}
                name="branch"
                type="text"
                placeholder="e.g. CSE, ECE"
                error={errors.branch}
                value={formData.branch}
                onChange={handleChange}
              />
              <InputField
                label="HackerRank ID"
                icon={Code}
                name="hackerrankId"
                type="text"
                placeholder="Username"
                error={errors.hackerrankId}
                value={formData.hackerrankId}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone Number"
                icon={Phone}
                name="phoneNumber"
                type="tel"
                placeholder="+91..."
                error={errors.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">
                  Locality
                </label>
                <div className="flex gap-4">
                  {(["LOCALITE", "HOSTELITE"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, locality: l }))
                      }
                      className={`flex-1 py-4 rounded-2xl border transition-all uppercase text-[10px] font-black tracking-widest ${formData.locality === l ? "bg-blue-500 border-blue-500 text-white" : "bg-white/[0.03] border-white/5 text-neutral-500 hover:border-white/10"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {errors.locality && (
                  <p className="text-red-400 text-xs ml-1">{errors.locality}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">
                Target Tech Stack
              </label>
              <div className="relative">
                <Code className="absolute left-4 top-5 w-4 h-4 text-neutral-600" />
                <textarea
                  rows={3}
                  placeholder="e.g. Web Dev (MERN), AI/ML, Cloud..."
                  name="techStack"
                  className={`w-full bg-white/[0.03] border rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all text-sm font-medium resize-none ${errors.techStack ? "border-red-500/50" : "border-white/5 focus:border-blue-500/50"}`}
                  value={formData.techStack}
                  onChange={handleChange}
                />
              </div>
              {errors.techStack && (
                <p className="text-red-400 text-xs ml-1">{errors.techStack}</p>
              )}
            </div>

            {drive?.formFields?.length ? (
              <div className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Additional Details
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    These questions come from this recruitment drive.
                  </p>
                </div>

                {drive.formFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="ml-1 block text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-400">*</span>
                      )}
                    </label>

                    {field.type === "TEXTAREA" ? (
                      <textarea
                        rows={4}
                        value={answers[field.name] ?? ""}
                        onChange={(e) =>
                          handleAnswerChange(field.name, e.target.value)
                        }
                        placeholder={field.placeholder || "Enter answer here"}
                        className={`w-full rounded-2xl border bg-white/[0.03] px-4 py-4 text-sm text-white outline-none transition ${errors[field.name] ? "border-red-500/50" : "border-white/5 focus:border-blue-500/50"}`}
                      />
                    ) : (
                      <input
                        type={
                          field.type === "NUMBER"
                            ? "number"
                            : field.type === "EMAIL"
                              ? "email"
                              : field.type === "PHONE"
                                ? "tel"
                                : field.type === "URL"
                                  ? "url"
                                  : "text"
                        }
                        value={answers[field.name] ?? ""}
                        onChange={(e) =>
                          handleAnswerChange(field.name, e.target.value)
                        }
                        placeholder={field.placeholder || "Enter answer here"}
                        className={`w-full rounded-2xl border bg-white/[0.03] px-4 py-4 text-sm text-white outline-none transition ${errors[field.name] ? "border-red-500/50" : "border-white/5 focus:border-blue-500/50"}`}
                      />
                    )}

                    {errors[field.name] && (
                      <p className="ml-1 text-xs text-red-400">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
