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
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          project_type: "logo" | "banner" | "social" | "print" | "other";
          content_text: string;
          dimensions: string | null;
          reference_links: string[] | null;
          uploaded_files: Json;
          express_delivery: boolean;
          source_files: boolean;
          customer_email: string;
          base_price: number;
          express_delivery_price: number;
          source_files_price: number;
          total_price: number;
          stripe_payment_id: string | null;
          stripe_checkout_session_id: string | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          order_status: "pending" | "in_progress" | "completed" | "delivered";
          delivery_deadline: string | null;
          delivered_at: string | null;
          delivery_files: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_type: "logo" | "banner" | "social" | "print" | "other";
          content_text: string;
          dimensions?: string | null;
          reference_links?: string[] | null;
          uploaded_files?: Json;
          express_delivery?: boolean;
          source_files?: boolean;
          customer_email: string;
          base_price: number;
          express_delivery_price?: number;
          source_files_price?: number;
          total_price: number;
          stripe_payment_id?: string | null;
          stripe_checkout_session_id?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          order_status?: "pending" | "in_progress" | "completed" | "delivered";
          delivery_deadline?: string | null;
          delivered_at?: string | null;
          delivery_files?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_type?: "logo" | "banner" | "social" | "print" | "other";
          content_text?: string;
          dimensions?: string | null;
          reference_links?: string[] | null;
          uploaded_files?: Json;
          express_delivery?: boolean;
          source_files?: boolean;
          customer_email?: string;
          base_price?: number;
          express_delivery_price?: number;
          source_files_price?: number;
          total_price?: number;
          stripe_payment_id?: string | null;
          stripe_checkout_session_id?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          order_status?: "pending" | "in_progress" | "completed" | "delivered";
          delivery_deadline?: string | null;
          delivered_at?: string | null;
          delivery_files?: Json;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

// Helper types for easier use
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

// File metadata types
export interface FileMetadata {
  name: string;
  url: string;
  size: number;
  type: string;
}

// Typed uploaded_files and delivery_files
export type UploadedFiles = FileMetadata[];
export type DeliveryFiles = FileMetadata[];
