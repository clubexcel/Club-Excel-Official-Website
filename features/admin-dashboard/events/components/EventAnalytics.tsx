"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface EventAnalyticsProps {
  id: string;
}

interface Stats {
  registrations: number;
  attendance: number;
  capacityFilled: string;
  customFields: number;
}

const EventAnalytics = ({ id }: EventAnalyticsProps) => {
  const [stats, setStats] = useState<Stats>({
    registrations: 0,
    attendance: 0,
    capacityFilled: "0%",
    customFields: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const [{ data: eventData }, { data: responseData }] = await Promise.all(
          [
            axios.get(`/api/events/${id}`),
            axios.get(`/api/events/${id}/responses`, {
              params: { page: 1, limit: 1 },
            }),
          ]
        );

        const event = eventData.event;
        const total = responseData.pagination?.total ?? 0;

        const { data: allResponses } = await axios.get(
          `/api/events/${id}/responses`,
          { params: { page: 1, limit: Math.max(total, 1) } }
        );

        const attended = (allResponses.data ?? []).filter(
          (r: { attendance: boolean }) => r.attendance
        ).length;

        const capacityFilled = event?.capacity
          ? `${Math.min(100, Math.round((total / event.capacity) * 100))}%`
          : "—";

        setStats({
          registrations: total,
          attendance: attended,
          capacityFilled,
          customFields: event?.formFields?.length ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const statItems = [
    { title: "Registrations", value: stats.registrations },
    { title: "Attendance", value: stats.attendance },
    { title: "Capacity Filled", value: stats.capacityFilled },
    { title: "Custom Fields", value: stats.customFields },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics</h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-[#111] p-6"
          >
            <p className="text-sm text-neutral-500">{item.title}</p>

            <h3 className="mt-4 text-4xl font-bold text-white">
              {isLoading ? "—" : item.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
        <h3 className="text-xl font-semibold text-white">Registration Trend</h3>

        <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10">
          <p className="text-neutral-500">Chart coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
