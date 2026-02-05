import { supabase } from "./client";
import type { FileMetadata } from "./types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "image/svg+xml",
];

export interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param orderId - The order ID to organize files
 * @returns Upload result with file metadata or error
 */
export async function uploadReferenceFile(
  file: File,
  orderId: string,
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds 10MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: images (JPEG, PNG, GIF, WebP, SVG) and PDF`,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${sanitizedName}`;
    const filePath = `${orderId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("order-references")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("order-references").getPublicUrl(filePath);

    const fileMetadata: FileMetadata = {
      name: file.name,
      url: publicUrl,
      size: file.size,
      type: file.type,
    };

    return {
      success: true,
      file: fileMetadata,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during upload",
    };
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param orderId - The order ID to organize files
 * @returns Array of upload results
 */
export async function uploadReferenceFiles(
  files: File[],
  orderId: string,
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) =>
    uploadReferenceFile(file, orderId),
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl - The public URL of the file to delete
 * @param orderId - The order ID
 * @returns Success status
 */
export async function deleteReferenceFile(
  fileUrl: string,
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${orderId}/${fileName}`;

    const { error } = await supabase.storage
      .from("order-references")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: `Delete failed: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during deletion",
    };
  }
}

/**
 * Get a signed URL for a private file (for deliverables)
 * @param filePath - The path to the file in storage
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL or error
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600,
): Promise<{ url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from("order-deliverables")
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return { error: `Failed to generate download URL: ${error.message}` };
    }

    return { url: data.signedUrl };
  } catch (error) {
    console.error("Signed URL error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: images (JPEG, PNG, GIF, WebP, SVG) and PDF`,
    };
  }

  return { valid: true };
}
