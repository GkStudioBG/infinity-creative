export type ProjectType = "logo" | "banner" | "social" | "print" | "other";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus = "pending" | "in_progress" | "review" | "completed" | "delivered";

export interface Order {
  id: string;
  userId?: string;
  email: string;

  // Details
  projectType: ProjectType;
  contentText: string;
  dimensions?: string;
  referenceLinks: string[];
  uploadedFiles: string[];

  // Options
  isExpress: boolean;
  includeSourceFiles: boolean;

  // Pricing
  basePrice: number;
  expressFee: number;
  sourceFilesFee: number;
  totalPrice: number;
  currency: string;

  // Payment
  stripeSessionId?: string;
  paymentStatus: PaymentStatus;

  // Delivery
  status: OrderStatus;
  deliveryDeadline?: Date;
  deliveredAt?: Date;
  deliveryFiles: string[];

  // Revisions
  revisionsUsed: number;
  revisionsIncluded: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export interface OrderFormData {
  // Step 1
  projectType: ProjectType;

  // Step 2
  contentText: string;
  dimensions: string;

  // Step 3
  referenceLinks: string[];
  uploadedFiles: File[];

  // Step 4
  isExpress: boolean;
  includeSourceFiles: boolean;

  // Contact
  email: string;
}
