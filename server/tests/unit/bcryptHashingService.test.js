const {
  BcryptHashingService,
} = require("../../src/services/BcryptHashingService");

describe("BcryptHashingService", () => {
  // Use low salt rounds for fast tests
  const service = new BcryptHashingService(4);

  describe("hash", () => {
    it("hashes a password successfully", async () => {
      const hash = await service.hash("MyPassword1!");
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    it("produces different hashes for the same password", async () => {
      const hash1 = await service.hash("MyPassword1!");
      const hash2 = await service.hash("MyPassword1!");
      expect(hash1).not.toBe(hash2);
    });

    it("rejects empty password", async () => {
      await expect(service.hash("")).rejects.toThrow(
        "Password must be a non-empty string",
      );
    });

    it("rejects null password", async () => {
      await expect(service.hash(null)).rejects.toThrow(
        "Password must be a non-empty string",
      );
    });

    it("rejects password longer than 72 characters", async () => {
      const longPassword = "a".repeat(73);
      await expect(service.hash(longPassword)).rejects.toThrow(
        "Password too long",
      );
    });
  });

  describe("compare", () => {
    it("returns true for matching password", async () => {
      const password = "TestPass123!";
      const hash = await service.hash(password);
      const result = await service.compare(password, hash);
      expect(result).toBe(true);
    });

    it("returns false for non-matching password", async () => {
      const hash = await service.hash("TestPass123!");
      const result = await service.compare("WrongPass123!", hash);
      expect(result).toBe(false);
    });

    it("rejects invalid hash format", async () => {
      await expect(service.compare("password", "not-a-hash")).rejects.toThrow(
        "Invalid bcrypt hash format",
      );
    });
  });

  describe("validatePasswordStrength", () => {
    it("accepts strong password", async () => {
      const result = await service.validatePasswordStrength("MyStr0ng!Pass");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects short password", async () => {
      const result = await service.validatePasswordStrength("Ab1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long",
      );
    });

    it("rejects password without uppercase", async () => {
      const result = await service.validatePasswordStrength("mypassword1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter",
      );
    });

    it("rejects password without lowercase", async () => {
      const result = await service.validatePasswordStrength("MYPASSWORD1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter",
      );
    });

    it("rejects password without digit", async () => {
      const result = await service.validatePasswordStrength("MyPassword!!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number",
      );
    });

    it("rejects password without special character", async () => {
      const result = await service.validatePasswordStrength("MyPassword123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one special character",
      );
    });

    it("rejects common passwords", async () => {
      const result = await service.validatePasswordStrength("password");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is too common");
    });

    it("rejects non-string input", async () => {
      const result = await service.validatePasswordStrength(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be a string");
    });
  });

  describe("getHashInfo", () => {
    it("extracts info from valid bcrypt hash", async () => {
      const hash = await service.hash("TestPass123!");
      const info = service.getHashInfo(hash);
      expect(info.algorithm).toMatch(/2[aby]/);
      expect(info.rounds).toBe(4);
    });

    it("returns invalid for bad hash", () => {
      const info = service.getHashInfo("not-a-hash");
      expect(info.isValid).toBe(false);
    });

    it("rejects null input", () => {
      const info = service.getHashInfo(null);
      expect(info.isValid).toBe(false);
    });
  });

  describe("needsRehash", () => {
    it("returns false for hash with sufficient rounds", async () => {
      const hash = await service.hash("TestPass123!");
      expect(service.needsRehash(hash, 4)).toBe(false);
    });

    it("returns true for hash with too few rounds", async () => {
      const hash = await service.hash("TestPass123!");
      expect(service.needsRehash(hash, 10)).toBe(true);
    });

    it("returns true for invalid hash", () => {
      expect(service.needsRehash("invalid")).toBe(true);
    });
  });
});
