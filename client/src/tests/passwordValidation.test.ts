export {};

function validatePassword(password: string): string | true {
  if (!password || password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caracteres";
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }
  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractere special";
  }
  return true;
}

describe("Password validation", () => {
  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePassword("Ab1!")).not.toBe(true);
    expect(validatePassword("")).not.toBe(true);
  });

  it("rejects passwords without uppercase", () => {
    expect(validatePassword("abcdefg1!")).not.toBe(true);
  });

  it("rejects passwords without lowercase", () => {
    expect(validatePassword("ABCDEFG1!")).not.toBe(true);
  });

  it("rejects passwords without digit", () => {
    expect(validatePassword("Abcdefgh!")).not.toBe(true);
  });

  it("rejects passwords without special character", () => {
    expect(validatePassword("Abcdefg1")).not.toBe(true);
  });

  it("accepts valid passwords", () => {
    expect(validatePassword("MyP@ss1234")).toBe(true);
    expect(validatePassword("Str0ng!Pass")).toBe(true);
    expect(validatePassword("12345Aa!")).toBe(true);
  });
});
