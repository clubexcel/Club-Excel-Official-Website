"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  LogOut,
  Hexagon,
  MessageSquare,
  User,
  Menu,
  X,
  Image as ImageIcon,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  Database,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AdminMembers from "@/features/admin-dashboard/members/components/AdminMembers";
import AdminEvents from "@/features/admin-dashboard/events/components/AdminEvents";
import AdminQueries from "@/features/admin-dashboard/queries/components/AdminQueries";
import AdminRecruitment from "@/features/admin-dashboard/recruitment/components/AdminRecruitment";
import AdminAchievements from "@/features/admin-dashboard/achievements/components/AdminAchievements";
import AdminGallery from "@/features/admin-dashboard/gallery/components/AdminGallery";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "advisors", label: "Advisors", icon: Users },
  { id: "alumni", label: "Alumni", icon: Users },
  { id: "events", label: "Events", icon: Calendar },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "queries", label: "Queries", icon: MessageSquare },
  { id: "recruitment", label: "Recruitment", icon: User },
];

const statTheme = {
  blue: {
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
    link: "text-blue-400",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)]",
  },
  indigo: {
    badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    hoverBorder: "hover:border-indigo-500/30",
    link: "text-indigo-400",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.5)]",
  },
  green: {
    badge: "bg-green-500/10 border-green-500/20 text-green-400",
    hoverBorder: "hover:border-green-500/30",
    link: "text-green-400",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)]",
  },
  purple: {
    badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
    link: "text-purple-400",
    glow: "group-hover:shadow-[0_0_40px_-12px_rgba(168,85,247,0.5)]",
  },
} as const;

type StatColor = keyof typeof statTheme;

interface SidebarContentProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
  session: any;
  handleLogout: () => void;
}

const SidebarContent = ({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  session,
  handleLogout,
}: SidebarContentProps) => {
  const email = session?.user?.email ?? "";

  return (
    <>
      <div className="mb-10 flex items-center justify-between px-2">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => (window.location.href = "/")}
        >
          <Hexagon className="h-6 w-6 fill-white" />
          <span className="text-lg font-bold tracking-tight">ADMIN</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-neutral-400 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  className="absolute inset-0 rounded-2xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                />
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              )}
              <Icon
                className={`relative z-10 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-black"
                    : "text-neutral-500 group-hover:text-white"
                }`}
              />
              <span
                className={`relative z-10 ${
                  isActive
                    ? "text-black"
                    : "text-neutral-500 group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/10">
            {email ? email[0]?.toUpperCase() : "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-neutral-300">
              {email || "Unknown user"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-600">
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-500 transition-all hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );
};

const fetchStats = async () => {
  const [mRes, eRes, qRes, rRes] = await Promise.all([
    axios.get("/api/our-team?role=ALL&limit=1"),
    axios.get("/api/events?limit=1"),
    axios.get("/api/contact-us?limit=1"),
    axios.get("/api/recruitment?limit=1"),
  ]);
  return {
    members: mRes.data.pagination?.total ?? 0,
    events: eRes.data.pagination?.total ?? 0,
    queries: qRes.data.pagination?.total ?? 0,
    recruits: rRes.data.pagination?.total ?? 0,
  };
};

const DashboardContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/sign-in");
    },
  });

  const [activeTab, setActiveTabState] = useState(() => {
    const requestedTab = searchParams.get("tab");
    const isValidTab = navItems.some((item) => item.id === requestedTab);
    return isValidTab ? (requestedTab as string) : "dashboard";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    queries: 0,
    recruits: 0,
  });

  const setActiveTab = (id: string) => {
    setActiveTabState(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "dashboard") {
      params.delete("tab");
    } else {
      params.set("tab", id);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    const isValidTab = navItems.some((item) => item.id === requestedTab);
    const next = isValidTab ? (requestedTab as string) : "dashboard";
    setActiveTabState((current) => (current === next ? current : next));
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    if (status === "authenticated") {
      fetchStats()
        .then((s) => {
          if (mounted) setStats(s);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [status]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const sidebarProps = {
    activeTab,
    setActiveTab,
    setIsSidebarOpen,
    session,
    handleLogout,
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  const statCards: {
    label: string;
    value: number;
    tab: string;
    color: StatColor;
    icon: typeof Users;
  }[] = [
    {
      label: "Total Members",
      value: stats.members,
      tab: "members",
      color: "blue",
      icon: Users,
    },
    {
      label: "All Events",
      value: stats.events,
      tab: "events",
      color: "indigo",
      icon: Calendar,
    },
    {
      label: "User Queries",
      value: stats.queries,
      tab: "queries",
      color: "green",
      icon: MessageSquare,
    },
    {
      label: "Recruitment Drives",
      value: stats.recruits,
      tab: "recruitment",
      color: "purple",
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white lg:flex-row">
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.28);
        }

        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
        }
        body::-webkit-scrollbar {
          width: 8px;
        }
        body::-webkit-scrollbar-track {
          background: #050505;
        }
        body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          border: 2px solid #050505;
        }
        body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.28);
        }
      `}</style>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl lg:hidden">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => router.push("/")}
        >
          <Hexagon className="h-6 w-6 fill-white" />
          <span className="text-lg font-bold tracking-tight">ADMIN</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-lg border border-white/10 bg-white/5 p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#0A0A0A] p-6 lg:hidden"
            >
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="custom-scrollbar flex-1 overflow-auto p-6 lg:p-10">
        <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Club Excel Admin
            </p>
            <h1 className="mb-2 text-2xl font-bold tracking-tight lg:text-3xl">
              {activeTab === "dashboard" ? (
                <>
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                    {session?.user?.email}
                  </span>
                </>
              ) : (
                navItems.find((i) => i.id === activeTab)?.label
              )}
            </h1>
            <p className="text-sm text-neutral-500 lg:text-base">
              {activeTab === "dashboard"
                ? "Here's what's happening in Club Excel today."
                : `Manage your ${activeTab} content here.`}
            </p>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map(({ label, value, tab, color, icon: Icon }) => {
                const theme = statTheme[color];
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.05] ${theme.hoverBorder} ${theme.glow}`}
                  >
                    <div
                      className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${theme.badge}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      {label}
                    </p>
                    <h3 className="mb-4 text-4xl font-bold lg:text-5xl">
                      {value}
                    </h3>
                    <div
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${theme.link}`}
                    >
                      Manage {label}
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-10">
              <h2 className="mb-6 flex items-center gap-3 text-lg font-bold lg:text-xl">
                <div className="h-6 w-2 rounded-full bg-blue-500" />
                System Infrastructure
              </h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {[
                  {
                    label: "Status",
                    value: "Live & Active",
                    icon: Activity,
                    tint: "text-green-400",
                  },
                  {
                    label: "Auth",
                    value: "NextAuth v5",
                    icon: ShieldCheck,
                    tint: "text-blue-400",
                  },
                  {
                    label: "Database",
                    value: "PostgreSQL",
                    icon: Database,
                    tint: "text-indigo-400",
                  },
                  {
                    label: "Last Updated",
                    value: new Date().toLocaleDateString("en-GB"),
                    icon: Clock,
                    tint: "text-purple-400",
                  },
                ].map(({ label, value, icon: Icon, tint }) => (
                  <div key={label} className="space-y-2">
                    <Icon className={`h-4 w-4 ${tint}`} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                      {label}
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {activeTab === "members" && <AdminMembers role="MEMBER" />}
          {activeTab === "advisors" && <AdminMembers role="ADVISOR" />}
          {activeTab === "alumni" && <AdminMembers role="ALUMNI" />}
          {activeTab === "events" && <AdminEvents />}
          {activeTab === "queries" && <AdminQueries />}
          {activeTab === "recruitment" && <AdminRecruitment />}
          {activeTab === "achievements" && <AdminAchievements />}
          {activeTab === "gallery" && <AdminGallery />}
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
};

export default AdminDashboard;
