/**
 * Shared Test Data Builders
 * Reference: .agents/rules/testing.md, .agents/rules/data-model.md
 */

export interface TestOrganisation {
  id: string;
  name: string;
  slug: string;
  currency: string;
  dpaSignedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestLocation {
  id: string;
  organisationId: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestMember {
  id: string;
  organisationId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  memberCode: string;
  checkInSecretEnc: string;
  provisionalBlockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestPlan {
  id: string;
  organisationId: string;
  name: string;
  planType: "DAY_PASS" | "WEEKLY" | "MONTHLY" | "DEDICATED_DESK" | "PRIVATE_OFFICE";
  priceKobo: number;
  roomMinutesIncluded: number;
  graceDays: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestMembership {
  id: string;
  organisationId: string;
  memberId: string;
  planId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  provisionalUntil: Date | null;
  status: "SCHEDULED" | "ACTIVE" | "PROVISIONAL" | "EXPIRED" | "CANCELLED";
  creditsRollOver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestInvoice {
  id: string;
  organisationId: string;
  memberId: string;
  invoiceNumber: string;
  invoiceType: "PLAN" | "RENEWAL" | "ROOM_HIRE" | "ROOM_OVERRUN";
  amountKobo: number;
  status: "UNPAID" | "PENDING_CONFIRMATION" | "PAID";
  provisionalUsedAt: Date | null;
  dueDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export function buildOrganisation(overrides: Partial<TestOrganisation> = {}): TestOrganisation {
  return {
    id: "org_test_123",
    name: "Capital Hub Abuja",
    slug: "capital-hub",
    currency: "NGN",
    dpaSignedAt: new Date("2026-11-01T10:00:00Z"),
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

export function buildLocation(overrides: Partial<TestLocation> = {}): TestLocation {
  return {
    id: "loc_test_123",
    organisationId: "org_test_123",
    name: "Wuse 2 Hub",
    address: "Aminu Kano Crescent, Wuse 2, Abuja",
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

export function buildMember(overrides: Partial<TestMember> = {}): TestMember {
  return {
    id: "mem_test_123",
    organisationId: "org_test_123",
    userId: "usr_test_123",
    fullName: "Tolu Adebayo",
    email: "tolu@example.ng",
    phone: "+2348031234567",
    memberCode: "KJ-CH-0042",
    checkInSecretEnc: "enc_secret_mock",
    provisionalBlockedUntil: null,
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

export function buildPlan(overrides: Partial<TestPlan> = {}): TestPlan {
  return {
    id: "plan_test_monthly",
    organisationId: "org_test_123",
    name: "Monthly Hot Desk",
    planType: "MONTHLY",
    priceKobo: 8500000, // ₦85,000
    roomMinutesIncluded: 420, // 7 hours
    graceDays: 0,
    active: true,
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

export function buildMembership(overrides: Partial<TestMembership> = {}): TestMembership {
  return {
    id: "mship_test_123",
    organisationId: "org_test_123",
    memberId: "mem_test_123",
    planId: "plan_test_monthly",
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    provisionalUntil: null,
    status: "ACTIVE",
    creditsRollOver: false,
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

export function buildInvoice(overrides: Partial<TestInvoice> = {}): TestInvoice {
  return {
    id: "inv_test_123",
    organisationId: "org_test_123",
    memberId: "mem_test_123",
    invoiceNumber: "INV-2026-0001",
    invoiceType: "PLAN",
    amountKobo: 8500000,
    status: "PAID",
    provisionalUsedAt: null,
    dueDate: "2026-11-01",
    createdAt: new Date("2026-11-01T10:00:00Z"),
    updatedAt: new Date("2026-11-01T10:00:00Z"),
    ...overrides,
  };
}

