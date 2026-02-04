import { z } from "zod";

export const projectTypeSchema = z.enum(["logo", "banner", "social", "print", "other"]);

export const step1Schema = z.object({
  projectType: projectTypeSchema,
});

export const step2Schema = z.object({
  contentText: z
    .string()
    .min(10, "Please provide at least 10 characters describing your project")
    .max(5000, "Description is too long (max 5000 characters)"),
  dimensions: z.string().optional(),
});

// File validation helper
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
];

const fileSchema = z
  .custom<File>()
  .refine(
    (file) => file instanceof File,
    "Invalid file"
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "File size must be less than 10MB"
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "File type not supported"
  );

export const step3Schema = z.object({
  referenceLinks: z
    .array(z.string().url("Please enter a valid URL"))
    .max(10, "Maximum 10 reference links allowed")
    .optional()
    .default([]),
  uploadedFiles: z
    .array(fileSchema)
    .max(10, "Maximum 10 files allowed")
    .optional()
    .default([]),
});

export const step4Schema = z.object({
  isExpress: z.boolean(),
  includeSourceFiles: z.boolean(),
  email: z.string().email("Please enter a valid email address"),
});

export const step5Schema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const orderFormSchema = z.object({
  projectType: projectTypeSchema,
  contentText: z.string().min(10).max(5000),
  dimensions: z.string().optional(),
  referenceLinks: z.array(z.string().url()).max(10).optional().default([]),
  uploadedFiles: z.array(fileSchema).max(10).optional().default([]),
  isExpress: z.boolean(),
  includeSourceFiles: z.boolean(),
  email: z.string().email(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type Step5Data = z.infer<typeof step5Schema>;
export type OrderFormSchemaData = z.infer<typeof orderFormSchema>;
