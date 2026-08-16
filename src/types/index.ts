import type { Database } from "@/types/supabase";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type GlobalSource = Database["public"]["Tables"]["global_sources"]["Row"];
export type DeliveredOrder = Database["public"]["Tables"]["delivered_orders"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

// Insert types
export type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];
export type GlobalSourceInsert = Database["public"]["Tables"]["global_sources"]["Insert"];
export type DeliveredOrderInsert = Database["public"]["Tables"]["delivered_orders"]["Insert"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type InquiryInsert = Database["public"]["Tables"]["inquiries"]["Insert"];

// Update types
export type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];
export type GlobalSourceUpdate = Database["public"]["Tables"]["global_sources"]["Update"];
export type DeliveredOrderUpdate = Database["public"]["Tables"]["delivered_orders"]["Update"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];
export type InquiryUpdate = Database["public"]["Tables"]["inquiries"]["Update"];
