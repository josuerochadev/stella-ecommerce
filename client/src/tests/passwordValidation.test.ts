import { validatePassword } from "@/utils/security";

describe("Password validation (security.ts)", () => {
  it("rejects passwords shorter than 8 characters", () => {
    const result = validatePassword("Ab1!");
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects empty passwords", () => {
    const result = validatePassword("");
    expect(result.isValid).toBe(false);
  });

  it("rejects passwords without uppercase", () => {
    const result = validatePassword("abcdefg1!");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins une majuscule");
  });

  it("rejects passwords without lowercase", () => {
    const result = validatePassword("ABCDEFG1!");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins une minuscule");
  });

  it("rejects passwords without digit", () => {
    const result = validatePassword("Abcdefgh!");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins un chiffre");
  });

  it("rejects passwords without special character", () => {
    const result = validatePassword("Abcdefg1");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Le mot de passe doit contenir au moins un caractère spécial");
  });

  it("rejects passwords exceeding 128 characters", () => {
    const longPassword = `Aa1!${"x".repeat(126)}`;
    const result = validatePassword(longPassword);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Le mot de passe ne peut pas dépasser 128 caractères");
  });

  it("accepts valid passwords", () => {
    expect(validatePassword("MyP@ss1234").isValid).toBe(true);
    expect(validatePassword("Str0ng!Pass").isValid).toBe(true);
    expect(validatePassword("12345Aa!").isValid).toBe(true);
  });

  it("returns multiple errors for very weak passwords", () => {
    const result = validatePassword("abc");
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
