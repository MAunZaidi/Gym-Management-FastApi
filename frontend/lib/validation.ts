export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateRequired(fields: Record<string, string | number | boolean | undefined>) {
  const errors: Record<string, string> = {};

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      errors[key] = "This field is required.";
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
