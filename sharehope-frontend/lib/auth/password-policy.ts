export const PASSWORD_REQUIREMENTS =
  "Use 12–128 characters with uppercase, lowercase, a number, and a symbol. Do not use spaces or personal information.";

export function isStrongPassword(password: string) {
  return password.length >= 12 && password.length <= 128 && !/\s/.test(password)
    && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}
