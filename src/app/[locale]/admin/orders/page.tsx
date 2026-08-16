"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabaseClient";
import type { DeliveredOrder } from "@/types";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [orders, setOrders] = useState<DeliveredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push(`/${locale}/admin/login`);
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("delivered_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
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
          <h1 className="text-3xl font-bold text-text-primary">Delivered Orders</h1>
          <p className="mt-1 text-text-secondary">Track record & delivery history</p>
        </div>
        <button className="rounded-lg gradient-emerald px-6 py-2 font-semibold text-onyx transition-opacity hover:opacity-90">
          + Add Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-muted">No delivered orders yet. Add your first delivery record.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{order.title_en}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{order.client_category_en}</p>
                  <p className="mt-2 text-xs text-text-muted">
                    Origin: {order.country_origin} | {order.quantity_details}
                  </p>
                </div>
                <span className="text-xs text-text-muted">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
