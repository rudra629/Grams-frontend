export type PasswordRule = { label: string; test: (v: string) => boolean };

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 6 characters", test: (v) => v.length >= 6 },
  { label: "At least 1 number", test: (v) => /\d/.test(v) },
  { label: "At least 1 special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function passwordIssues(v: string) {
  return PASSWORD_RULES.filter((r) => !r.test(v)).map((r) => r.label);
}

export function isPasswordValid(v: string) {
  return passwordIssues(v).length === 0;
}
