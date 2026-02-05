// Supabase clients
export { supabase } from "./client";
export { supabaseAdmin } from "./server";

// Types
export type {
  Database,
  Order,
  OrderInsert,
  OrderUpdate,
  FileMetadata,
  UploadedFiles,
  DeliveryFiles,
} from "./types";

// Order operations
export {
  createOrder,
  getOrderById,
  getOrdersByEmail,
  getOrderBySessionId,
  updateOrder,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "./orders";

// Storage operations
export {
  uploadReferenceFile,
  uploadReferenceFiles,
  deleteReferenceFile,
  getSignedUrl,
  validateFile,
} from "./storage";

export type { UploadResult } from "./storage";
