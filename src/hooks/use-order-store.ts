import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectType, OrderFormData } from "@/types";
import { PRICING } from "@/lib/constants";

interface OrderStore {
  // Form data
  currentStep: number;
  previousStep: number;
  formData: OrderFormData;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<OrderFormData>) => void;
  resetForm: () => void;

  // Computed
  getTotalPrice: () => number;
  getDirection: () => "forward" | "backward";
}

const initialFormData: OrderFormData = {
  projectType: "logo",
  contentText: "",
  dimensions: "",
  referenceLinks: [],
  uploadedFiles: [],
  isExpress: false,
  includeSourceFiles: false,
  email: "",
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get): OrderStore => ({
      currentStep: 1,
      previousStep: 1,
      formData: initialFormData,

      setStep: (step) =>
        set((state) => ({
          previousStep: state.currentStep,
          currentStep: step,
        })),

      nextStep: () =>
        set((state) => ({
          previousStep: state.currentStep,
          currentStep: Math.min(state.currentStep + 1, 5),
        })),

      prevStep: () =>
        set((state) => ({
          previousStep: state.currentStep,
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({
          currentStep: 1,
          previousStep: 1,
          formData: initialFormData,
        }),

      getTotalPrice: () => {
        const { formData } = get();
        let total = PRICING.singleDesign;

        if (formData.isExpress) {
          total += PRICING.expressFee;
        }

        if (formData.includeSourceFiles) {
          total += PRICING.sourceFilesFee;
        }

        return total;
      },

      getDirection: () => {
        const { currentStep, previousStep } = get();
        return currentStep >= previousStep ? "forward" : "backward";
      },
    }),
    {
      name: "order-store",
      partialize: (state) => ({
        formData: {
          ...state.formData,
          uploadedFiles: [], // Don't persist file objects
        },
      }),
    }
  )
);
