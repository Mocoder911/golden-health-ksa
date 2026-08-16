"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabaseClient";
import type { GlobalSource } from "@/types";

export default function SourcingPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [sources, setSources] = useState<GlobalSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push(`/${locale}/admin/login`);
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (user) fetchSources();
  }, [user]);

  const fetchSources = async () => {
    const { data } = await supabase
      .from("global_sources")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setSources(data);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-onyx p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Sourcing Countries</h1>
          <p className="mt-1 text-text-secondary">Manage global sourcing hubs</p>
        </div>
        <button className="rounded-lg gradient-emerald px-6 py-2 font-semibold text-onyx transition-opacity hover:opacity-90">
          + Add Country
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-muted">No sourcing countries yet. Add your first source.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div key={source.id} className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{source.flag_icon ?? "🌍"}</span>
                <div>
                  <h3 className="font-semibold text-text-primary">{source.country_name_en}</h3>
                  <p className="text-sm text-text-secondary">{source.country_name_ar}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {source.specialties_en.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-emerald/10 px-2 py-0.5 text-xs text-emerald"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
