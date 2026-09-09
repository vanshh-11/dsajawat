import { useState } from "react";

export interface InquiryFormData {
  name: string;
  phone: string;
  eventType: string;
  message: string;
}

export interface SubmitOptions {
  source: "contact" | "quote" | "hero_cta" | "collection_card";
  pageUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export function useInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const submit = async (formData: InquiryFormData, options: SubmitOptions): Promise<SubmitResult> => {
    setIsSubmitting(true);
    setLastError(null);

    try {
      const response = await fetch("/api/inquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          eventType: formData.eventType,
          message: formData.message,
          source: options.source,
          pageUrl: options.pageUrl || window.location.href,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || result.details ? JSON.stringify(result.details) : "Submission failed";
        throw new Error(errorMsg);
      }

      options.onSuccess?.();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      setLastError(errorMessage);
      options.onError?.(errorMessage);
      
      // Fallback to WhatsApp
      await fallbackToWhatsApp(formData, options.source);
      
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackToWhatsApp = async (formData: InquiryFormData, source: string) => {
    const { BRAND } = await import("../types");
    
    const sourceLabels: Record<string, string> = {
      contact: "Inquiry",
      quote: "Quote Request",
      hero_cta: "Inquiry",
      collection_card: "Collection Inquiry",
    };

    const text = `*${sourceLabels[source] || "Inquiry"} - D SAJAWAT Website*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Event Type:* ${formData.eventType || "Not specified"}\n*Message:* ${formData.message || "No message"}`;
    
    const whatsappUrl = `https://wa.me/${BRAND.whatsapp[0]}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return {
    submit,
    isSubmitting,
    lastError,
  };
}