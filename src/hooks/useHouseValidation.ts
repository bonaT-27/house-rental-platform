import { useState, useCallback } from 'react';
import { houseSchema, HouseFormData, validateHouseSafe } from '../schemas/houseSchema';
import { z } from 'zod';
import type { ZodIssue } from 'zod'; // ✅ Import the type directly

type ValidationErrors = Partial<Record<keyof HouseFormData, string>>;

export function useHouseValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((field: keyof HouseFormData, value: unknown): string | null => {
    try {
      const fieldSchema = houseSchema.shape[field];
      fieldSchema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const [firstIssue] = error.issues;
        return firstIssue?.message || 'Invalid value';
      }
      return 'Invalid value';
    }
  }, []);

  const validateForm = useCallback((data: unknown): boolean => {
    const result = validateHouseSafe(data);
    
    if (result.success && result.data) {
      setErrors({});
      setIsValid(true);
      return true;
    }
    
    if (result.error) {
      const newErrors: ValidationErrors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as keyof HouseFormData;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      setIsValid(false);
    }
    
    return false;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    schema: houseSchema,
  };
}