import { describe, it, expect } from "vitest";
import {
  formatMoney,
  formatTime,
  formatDate,
  formatRoomHours,
  formatFreshness,
  formatMinutesAsTime,
  lagosDate,
} from "./formatters";

describe("formatMoney", () => {
  it("formats zero kobo with no decimals", () => {
    expect(formatMoney(8500000)).toBe("₦85,000");
  });

  it("formats non-zero kobo with two decimals", () => {
    expect(formatMoney(9137550)).toBe("₦91,375.50");
  });

  it("formats zero naira", () => {
    expect(formatMoney(0)).toBe("₦0");
  });

  it("formats amounts under 1 naira with decimals", () => {
    expect(formatMoney(50)).toBe("₦0.50");
  });
});

describe("formatTime & formatMinutesAsTime", () => {
  it("formats UTC instant in Africa/Lagos time", () => {
    // 08:14 UTC is 09:14 Lagos (UTC+1)
    const date = new Date("2026-11-11T08:14:00Z");
    expect(formatTime(date)).toBe("9:14am");
  });

  it("formats minutes after Lagos midnight", () => {
    // 8:00am is 480 minutes
    expect(formatMinutesAsTime(480)).toBe("8:00am");
    // 8:00pm is 1200 minutes
    expect(formatMinutesAsTime(1200)).toBe("8:00pm");
  });
});

describe("formatDate", () => {
  it("formats date without year for current year", () => {
    const refNow = new Date("2026-11-11T12:00:00Z");
    const target = new Date("2026-11-30T12:00:00Z");
    expect(formatDate(target, refNow)).toBe("30 Nov");
  });

  it("formats date with year for a different year", () => {
    const refNow = new Date("2026-11-11T12:00:00Z");
    const target = new Date("2027-11-30T12:00:00Z");
    expect(formatDate(target, refNow)).toBe("30 Nov 2027");
  });
});

describe("formatRoomHours", () => {
  it("drops trailing .0 for whole hours", () => {
    expect(formatRoomHours(3, 10)).toBe("3 of 10");
  });

  it("keeps one decimal for fractional hours", () => {
    expect(formatRoomHours(2.5, 10)).toBe("2.5 of 10");
  });
});

describe("formatFreshness", () => {
  it("shows online freshness string", () => {
    const date = new Date("2026-11-11T08:14:00Z");
    expect(formatFreshness(date, false)).toBe("Updated 9:14am");
  });

  it("shows offline freshness string", () => {
    const date = new Date("2026-11-11T08:14:00Z");
    expect(formatFreshness(date, true)).toBe("Offline. As of 9:14am");
  });
});

describe("lagosDate", () => {
  it("returns YYYY-MM-DD in Lagos time", () => {
    // 23:30 UTC on Nov 11 is 00:30 on Nov 12 in Lagos
    const date = new Date("2026-11-11T23:30:00Z");
    expect(lagosDate(date)).toBe("2026-11-12");
  });
});

