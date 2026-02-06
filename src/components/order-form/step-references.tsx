"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link2, Plus, X, Upload, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/hooks/use-order-store";
import { FileUpload } from "./file-upload";

export function StepReferences() {
  const { formData, updateFormData, nextStep, prevStep } = useOrderStore();
  const t = useTranslations("orderForm.step3");
  const tCommon = useTranslations("common");
  const [referenceLinks, setReferenceLinks] = useState<string[]>(
    formData.referenceLinks || []
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    formData.uploadedFiles || []
  );
  const [newLink, setNewLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

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
      setLinkError(t("errors.enterUrl"));
      return;
    }

    // Add protocol if missing
    let urlToAdd = newLink.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    if (!validateUrl(urlToAdd)) {
      setLinkError(t("errors.invalidUrl"));
      return;
    }

    if (referenceLinks.includes(urlToAdd)) {
      setLinkError(t("errors.duplicateUrl"));
      return;
    }

    if (referenceLinks.length >= 10) {
      setLinkError(t("errors.maxLinks"));
      return;
    }

    setReferenceLinks([...referenceLinks, urlToAdd]);
    setNewLink("");
  }, [newLink, referenceLinks, t]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      referenceLinks,
      uploadedFiles,
    });
    nextStep();
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
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Reference Links Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            {t("linksLabel")}
            <span className="text-xs text-muted-foreground">({tCommon("optional")})</span>
          </label>
          <p className="text-xs text-muted-foreground">
            {t("linksHint")}
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
              placeholder={t("linksPlaceholder")}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addLink}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">{tCommon("add")}</span>
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
                      <span className="sr-only">{tCommon("remove")}</span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Upload className="h-4 w-4 text-primary" />
            {t("uploadLabel")}
            <span className="text-xs text-muted-foreground">({tCommon("optional")})</span>
          </label>
          <p className="text-xs text-muted-foreground">
            {t("uploadHint")}
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
              {t("optionalNotice")}
            </span>{" "}
            {t("optionalNoticeText")}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon("back")}
        </Button>
        <Button type="submit" size="lg" className="min-w-[140px]">
          {tCommon("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
