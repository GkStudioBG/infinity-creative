import { z } from "zod";

export const projectTypeSchema = z.enum(["logo", "banner", "social", "print", "other"]);

export const step1Schema = z.object({
  projectType: projectTypeSchema,
});

export const step2Schema = z.object({
  contentText: z.string().min(10, "Please provide at least 10 characters describing your project"),
  dimensions: z.string().optional(),
});

export const step3Schema = z.object({
  referenceLinks: z.array(z.string().url("Please enter a valid URL")).optional(),
  uploadedFiles: z.array(z.any()).optional(),
});

export const step4Schema = z.object({
  isExpress: z.boolean(),
  includeSourceFiles: z.boolean(),
  email: z.string().email("Please enter a valid email address"),
});

export const orderFormSchema = z.object({
  projectType: projectTypeSchema,
  contentText: z.string().min(10),
  dimensions: z.string().optional(),
  referenceLinks: z.array(z.string().url()).optional(),
  uploadedFiles: z.array(z.any()).optional(),
  isExpress: z.boolean(),
  includeSourceFiles: z.boolean(),
  email: z.string().email(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type OrderFormSchemaData = z.infer<typeof orderFormSchema>;
