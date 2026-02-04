"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return Image;
  }
  if (type === "application/pdf") {
    return FileText;
  }
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  files,
  onChange,
  maxFiles = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported file type`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds 10MB limit`;
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        // Check for duplicates
        const isDuplicate = files.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!isDuplicate) {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        onChange([...files, ...validFiles]);
      }
    },
    [files, maxFiles, onChange, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      // Reset input to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      onChange(newFiles);
      setError(null);
    },
    [files, onChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={isDragging ? "drag" : "initial"}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(",")}
          onChange={handleInputChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={files.length >= maxFiles}
        />

        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-full p-3",
              isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <Upload className="h-6 w-6" />
          </motion.div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragging
                ? "Drop files here"
                : "Drag & drop files here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Images, PDFs, ZIP files up to 10MB each (max {maxFiles} files)
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pointer-events-none"
          >
            Browse Files
          </Button>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-foreground">
              Uploaded files ({files.length}/{maxFiles})
            </p>
            <div className="space-y-2">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <motion.div
                    key={`${file.name}-${file.size}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {file.name}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
