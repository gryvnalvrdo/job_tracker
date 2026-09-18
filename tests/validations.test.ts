import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { applicationSchema } from "@/lib/validations/application";

describe("loginSchema", () => {
  it("validates valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "mypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.path[0]).toBe("email");
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validData = {
    name: "John Doe",
    email: "john@example.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("validates correct register data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = registerSchema.safeParse({ ...validData, name: "J" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.path[0]).toBe("name");
  });

  it("rejects password without uppercase", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "PasswordOnly",
      confirmPassword: "PasswordOnly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPass1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.path[0]).toBe("confirmPassword");
  });
});

describe("applicationSchema", () => {
  const validApp = {
    companyName: "Google",
    position: "Software Engineer",
    appliedDate: "2024-09-18",
  };

  it("validates minimal valid application", () => {
    const result = applicationSchema.safeParse(validApp);
    expect(result.success).toBe(true);
  });

  it("rejects empty companyName", () => {
    const result = applicationSchema.safeParse({ ...validApp, companyName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL", () => {
    const result = applicationSchema.safeParse({
      ...validApp,
      jobUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid URL", () => {
    const result = applicationSchema.safeParse({
      ...validApp,
      jobUrl: "https://jobs.google.com/",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string for optional jobUrl", () => {
    const result = applicationSchema.safeParse({ ...validApp, jobUrl: "" });
    expect(result.success).toBe(true);
  });

  it("validates salary range", () => {
    const result = applicationSchema.safeParse({
      ...validApp,
      salaryMin: 5000000,
      salaryMax: 8000000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative salary", () => {
    const result = applicationSchema.safeParse({
      ...validApp,
      salaryMin: -1000,
    });
    expect(result.success).toBe(false);
  });
});
