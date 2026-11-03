"use client";

import React from "react";
import { Role } from "@prisma/client";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS } from "@/lib/validator";

export type MemberLinkFormData = {
  platform: (typeof SOCIAL_PLATFORMS)[number];
  url: string;
};

export type MemberFormData = {
  name: string;
  email: string;
  phone: string;
  role: Role;
  year: string;
  designation: string;
  skills: string;
  links: MemberLinkFormData[];
};

type FieldErrors = Record<string, string>;

const PLATFORM_LABELS: Record<(typeof SOCIAL_PLATFORMS)[number], string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter / X",
  instagram: "Instagram",
  portfolio: "Portfolio",
  other: "Other",
};

interface MemberModalProps {
  memberId: string | null;
  form: MemberFormData;
  errors: FieldErrors;
  imagePreview: string | null;
  isSaving: boolean;

  updateField: (key: keyof MemberFormData, value: string) => void;

  updateLinks: (links: MemberLinkFormData[]) => void;

  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;

  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;

  onClose: () => void;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MemberModal = ({
  memberId,
  form,
  errors,
  imagePreview,
  isSaving,
  updateField,
  updateLinks,
  setImageFile,
  setImagePreview,
  onClose,
  onSubmit,
}: MemberModalProps) => {
  const addLink = () => {
    updateLinks([...form.links, { platform: "linkedin", url: "" }]);
  };

  const removeLink = (index: number) => {
    updateLinks(form.links.filter((_, i) => i !== index));
  };

  const editLinkPlatform = (
    index: number,
    platform: MemberLinkFormData["platform"]
  ) => {
    updateLinks(
      form.links.map((link, i) => (i === index ? { ...link, platform } : link))
    );
  };

  const editLinkUrl = (index: number, url: string) => {
    updateLinks(
      form.links.map((link, i) => (i === index ? { ...link, url } : link))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {memberId ? "Edit Member" : "Add Member"}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Image */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-7 h-7 text-neutral-600" />
              )}
            </div>

            <label className="cursor-pointer px-4 py-2 rounded-xl border border-white/10 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition">
              {imagePreview ? "Change Photo" : "Upload Photo"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  setImageFile(file);

                  const reader = new FileReader();

                  reader.onloadend = () =>
                    setImagePreview(reader.result as string);

                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              Name
            </label>

            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={`w-full mt-1 rounded-xl bg-white/5 border px-4 py-3 text-white text-sm focus:outline-none transition ${
                errors.name
                  ? "border-red-500"
                  : "border-white/10 focus:border-white/20"
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={`w-full mt-1 rounded-xl bg-white/5 border px-4 py-3 text-white text-sm focus:outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-white/10 focus:border-white/20"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              Role
            </label>

            <select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value as Role)}
              className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20"
            >
              {Object.values(Role).map((role) => (
                <option key={role} value={role} className="bg-[#0A0A0A]">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Year + Designation — the public site shows `designation` for
              every role (Member/Advisor/Alumni all display it), while
              `year` only makes sense for students: current members track
              their academic year, alumni track their graduation year, and
              advisors have neither. */}
          {form.role === Role.ADVISOR ? (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                Designation
              </label>

              <input
                value={form.designation}
                onChange={(e) => updateField("designation", e.target.value)}
                className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20"
                placeholder="Faculty Advisor, HOD..."
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                  {form.role === Role.ALUMNI ? "Graduation Year" : "Year"}
                </label>

                <input
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20"
                  placeholder={
                    form.role === Role.ALUMNI ? "2023" : "1st, 2nd, 3rd..."
                  }
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                  Designation
                </label>

                <input
                  value={form.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  className="w-full mt-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-white/20"
                  placeholder={
                    form.role === Role.ALUMNI
                      ? "Software Engineer at Google..."
                      : "Web Dev Lead, Secretary..."
                  }
                />
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
              Skills
              {form.role === Role.ADVISOR && (
                <span className="ml-1 normal-case tracking-normal text-neutral-600">
                  (optional)
                </span>
              )}
            </label>

            <textarea
              rows={4}
              value={form.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              placeholder="React, Next.js, Prisma, Node.js"
              className={`w-full mt-1 rounded-xl bg-white/5 border px-4 py-3 text-white text-sm resize-none focus:outline-none transition ${
                errors.skills
                  ? "border-red-500"
                  : "border-white/10 focus:border-white/20"
              }`}
            />

            <p className="text-xs text-neutral-500 mt-1">
              Separate multiple skills with commas.
            </p>

            {errors.skills && (
              <p className="mt-1 text-xs text-red-400">{errors.skills}</p>
            )}
          </div>

          {/* Social Links */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                Social Links
                <span className="ml-1 normal-case tracking-normal text-neutral-600">
                  (optional)
                </span>
              </label>

              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add link
              </button>
            </div>

            {form.links.length === 0 ? (
              <p className="text-xs text-neutral-600 mt-2">
                No social links added yet.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {form.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        editLinkPlatform(
                          index,
                          e.target.value as MemberLinkFormData["platform"]
                        )
                      }
                      className="w-32 shrink-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-white/20"
                    >
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option
                          key={platform}
                          value={platform}
                          className="bg-[#0A0A0A]"
                        >
                          {PLATFORM_LABELS[platform]}
                        </option>
                      ))}
                    </select>

                    <input
                      value={link.url}
                      onChange={(e) => editLinkUrl(index, e.target.value)}
                      placeholder="https://..."
                      className={`flex-1 min-w-0 rounded-xl bg-white/5 border px-4 py-2.5 text-white text-sm focus:outline-none transition ${
                        errors[`links.${index}.url`]
                          ? "border-red-500"
                          : "border-white/10 focus:border-white/20"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="shrink-0 p-2.5 rounded-xl border border-white/10 text-neutral-500 hover:text-red-400 hover:border-red-500/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.links && (
              <p className="mt-1 text-xs text-red-400">{errors.links}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : memberId
                  ? "Update Member"
                  : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
