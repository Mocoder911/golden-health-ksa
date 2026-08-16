export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          hero_title_en: string;
          hero_title_ar: string;
          hero_subtitle_en: string;
          hero_subtitle_ar: string;
          hero_bg_image_url: string | null;
          global_site_bg_url: string | null;
          experience_years_count: number;
          footer_about_en: string;
          footer_about_ar: string;
          phone_number: string | null;
          whatsapp_number: string | null;
          email_address: string | null;
          office_address_en: string | null;
          office_address_ar: string | null;
          social_links: Json;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          hero_title_en?: string;
          hero_title_ar?: string;
          hero_subtitle_en?: string;
          hero_subtitle_ar?: string;
          hero_bg_image_url?: string | null;
          global_site_bg_url?: string | null;
          experience_years_count?: number;
          footer_about_en?: string;
          footer_about_ar?: string;
          phone_number?: string | null;
          whatsapp_number?: string | null;
          email_address?: string | null;
          office_address_en?: string | null;
          office_address_ar?: string | null;
          social_links?: Json;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          hero_title_en?: string;
          hero_title_ar?: string;
          hero_subtitle_en?: string;
          hero_subtitle_ar?: string;
          hero_bg_image_url?: string | null;
          global_site_bg_url?: string | null;
          experience_years_count?: number;
          footer_about_en?: string;
          footer_about_ar?: string;
          phone_number?: string | null;
          whatsapp_number?: string | null;
          email_address?: string | null;
          office_address_en?: string | null;
          office_address_ar?: string | null;
          social_links?: Json;
          updated_at?: string;
          created_at?: string;
        };
      };
      global_sources: {
        Row: {
          id: string;
          country_name_en: string;
          country_name_ar: string;
          flag_icon: string | null;
          specialties_en: string[];
          specialties_ar: string[];
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          country_name_en: string;
          country_name_ar: string;
          flag_icon?: string | null;
          specialties_en?: string[];
          specialties_ar?: string[];
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          country_name_en?: string;
          country_name_ar?: string;
          flag_icon?: string | null;
          specialties_en?: string[];
          specialties_ar?: string[];
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivered_orders: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          client_category_en: string;
          client_category_ar: string;
          description_en: string | null;
          description_ar: string | null;
          quantity_details: string | null;
          country_origin: string | null;
          images: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_ar: string;
          client_category_en?: string;
          client_category_ar?: string;
          description_en?: string | null;
          description_ar?: string | null;
          quantity_details?: string | null;
          country_origin?: string | null;
          images?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_ar?: string;
          client_category_en?: string;
          client_category_ar?: string;
          description_en?: string | null;
          description_ar?: string | null;
          quantity_details?: string | null;
          country_origin?: string | null;
          images?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          icon_name: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_ar: string;
          description_en?: string | null;
          description_ar?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_ar?: string;
          description_en?: string | null;
          description_ar?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          phone: string | null;
          email: string;
          service_type: string | null;
          origin_country_interest: string | null;
          message: string | null;
          status: "new" | "in_progress" | "resolved" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name: string;
          phone?: string | null;
          email: string;
          service_type?: string | null;
          origin_country_interest?: string | null;
          message?: string | null;
          status?: "new" | "in_progress" | "resolved" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string;
          phone?: string | null;
          email?: string;
          service_type?: string | null;
          origin_country_interest?: string | null;
          message?: string | null;
          status?: "new" | "in_progress" | "resolved" | "closed";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
