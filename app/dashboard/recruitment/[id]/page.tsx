"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Settings, ClipboardList } from "lucide-react";
import RecruitmentResponses from "@/features/admin-dashboard/recruitment/components/RecruitmentResponses";
import RecruitmentFields from "@/features/admin-dashboard/recruitment/components/RecruitmentFields";
import RecruitmentSettings from "@/features/admin-dashboard/recruitment/components/RecruitmentSettings";

const tabs = [
  {
    id: "responses",
    label: "Applications",
    icon: ClipboardList,
  },
  {
    id: "fields",
    label: "Fields",
    icon: FileText,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

type Tab = (typeof tabs)[number]["id"];

function RecruitmentDriveManagementContent() {
  const { id } = useParams<{ id: string }>();

  const search = useSearchParams();

  const initialTab = useMemo(() => {
    const value = search.get("tab");

    return tabs.some((t) => t.id === value) ? (value as Tab) : "responses";
  }, [search]);

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard?tab=recruitment"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Recruitment Drive
            </h1>

            <p className="mt-2 text-neutral-500">
              Manage this drive&apos;s application form and applicants.
            </p>
          </div>
        </div>

        {/* Navigation */}

        <div className="sticky top-5 z-20 flex w-fit gap-2 rounded-2xl border border-white/10 bg-[#111111]/80 p-2 backdrop-blur-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-white text-black shadow-lg"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />

                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}

        <div className="animate-in fade-in duration-500">
          {activeTab === "responses" && <RecruitmentResponses id={id} />}

          {activeTab === "fields" && <RecruitmentFields id={id} />}

          {activeTab === "settings" && <RecruitmentSettings id={id} />}
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentDriveManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#090909]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <RecruitmentDriveManagementContent />
    </Suspense>
  );
}
