"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Plus, X, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/hooks/use-order-store";
import { step3Schema, type Step3Data } from "@/schemas/order.schema";
import { slideLeft } from "@/lib/animations";
import { FileUpload } from "./file-upload";

interface StepReferencesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepReferences({ onNext, onBack }: StepReferencesProps) {
  const { formData, updateFormData } = useOrderStore();
  const [referenceLinks, setReferenceLinks] = useState<string[]>(
    formData.referenceLinks || []
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    formData.uploadedFiles || []
  );
  const [newLink, setNewLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      referenceLinks: formData.referenceLinks,
      uploadedFiles: formData.uploadedFiles,
    },
    mode: "onChange",
  });

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addLink = useCallback(() => {
    setLinkError(null);

    if (!newLink.trim()) {
      setLinkError("Please enter a URL");
      return;
    }

    // Add protocol if missing
    let urlToAdd = newLink.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    if (!validateUrl(urlToAdd)) {
      setLinkError("Please enter a valid URL");
      return;
    }

    if (referenceLinks.includes(urlToAdd)) {
      setLinkError("This URL has already been added");
      return;
    }

    if (referenceLinks.length >= 10) {
      setLinkError("Maximum 10 reference links allowed");
      return;
    }

    setReferenceLinks([...referenceLinks, urlToAdd]);
    setNewLink("");
  }, [newLink, referenceLinks]);

  const removeLink = useCallback(
    (index: number) => {
      setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
      setLinkError(null);
    },
    [referenceLinks]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }
  };

  const onSubmit = () => {
    updateFormData({
      referenceLinks,
      uploadedFiles,
    });
    onNext();
  };

  // Derive domain from URL for display
  const getDomain = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Visual References
        </h2>
        <p className="text-muted-foreground">
          Share inspiration and brand assets to help us understand your vision.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Reference Links Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            Reference Links
          </label>
          <p className="text-xs text-muted-foreground">
            Add links to Pinterest boards, Behance projects, Dribbble shots, or
            any design inspiration.
          </p>

          {/* Add Link Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newLink}
              onChange={(e) => {
                setNewLink(e.target.value);
                setLinkError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://pinterest.com/pin/..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addLink}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Add</span>
            </Button>
          </div>

          {/* Link Error */}
          <AnimatePresence>
            {linkError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive"
              >
                {linkError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Links List */}
          <AnimatePresence>
            {referenceLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {referenceLinks.map((link, index) => (
                  <motion.div
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {getDomain(link)}
                      </p>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(index)}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove link</span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {errors.referenceLinks && (
            <p className="text-sm text-destructive">
              {errors.referenceLinks.message}
            </p>
          )}
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Upload className="h-4 w-4 text-primary" />
            Upload Files
          </label>
          <p className="text-xs text-muted-foreground">
            Upload logos, brand guidelines, photos, or any assets we should use.
          </p>

          <FileUpload
            files={uploadedFiles}
            onChange={setUploadedFiles}
            maxFiles={10}
          />
        </div>

        {/* Optional Notice */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              This step is optional.
            </span>{" "}
            If you don&apos;t have references or files, you can proceed to the
            next step. However, providing references helps us deliver designs
            that match your expectations.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
