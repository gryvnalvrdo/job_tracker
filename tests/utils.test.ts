import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateInput,
  formatSalary,
  getDaysAgo,
  needsFollowUp,
  formatMonthYear,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats a Date object correctly (Indonesian locale)", () => {
    const date = new Date("2024-03-15T00:00:00Z");
    const result = formatDate(date);
    expect(result).toMatch(/15/); // day present
    expect(result).toMatch(/2024/); // year present
  });

  it("accepts a string date", () => {
    const result = formatDate("2024-06-01");
    expect(result).toMatch(/2024/);
  });
});

describe("formatDateInput", () => {
  it("returns ISO date string YYYY-MM-DD", () => {
    const result = formatDateInput("2024-09-18T00:00:00Z");
    expect(result).toBe("2024-09-18");
  });
});

describe("formatSalary", () => {
  it("formats a number as IDR currency", () => {
    const result = formatSalary(5000000);
    expect(result).toContain("5.000.000");
  });

  it("returns '-' for null", () => {
    expect(formatSalary(null)).toBe("-");
  });

  it("returns '-' for undefined", () => {
    expect(formatSalary(undefined)).toBe("-");
  });

  it("returns '-' for 0", () => {
    expect(formatSalary(0)).toBe("-");
  });
});

describe("getDaysAgo", () => {
  it("returns 0 for today", () => {
    const today = new Date();
    expect(getDaysAgo(today)).toBe(0);
  });

  it("returns correct days for past date", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(getDaysAgo(threeDaysAgo)).toBe(3);
  });

  it("handles string date input", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    expect(getDaysAgo(sevenDaysAgo.toISOString())).toBe(7);
  });
});

describe("needsFollowUp", () => {
  it("returns true when >= 7 days without update", () => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    expect(needsFollowUp(eightDaysAgo)).toBe(true);
  });

  it("returns false when < 7 days since update", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(needsFollowUp(threeDaysAgo)).toBe(false);
  });

  it("returns false on exactly day 0", () => {
    expect(needsFollowUp(new Date())).toBe(false);
  });

  it("respects custom threshold", () => {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    expect(needsFollowUp(fourDaysAgo, 3)).toBe(true);
    expect(needsFollowUp(fourDaysAgo, 5)).toBe(false);
  });
});

describe("formatMonthYear", () => {
  it("returns abbreviated month and year", () => {
    const result = formatMonthYear("2024-01-15");
    expect(result).toMatch(/2024/);
  });
});
