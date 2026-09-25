import { describe, it, expect } from "vitest";
import { createAuthToken } from "./authToken";

const testAuthToken = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "eyJuYW1laWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ1bmlxdWVfbmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzcwMjA5NDcyLCJleHAiOjE3NzAyMTMwNzIsImlhdCI6MTc3MDIwOTQ3MiwiaXNzIjoiRXhjdXJzaW9uR1BUQXBpIiwiYXVkIjoiRXhjdXJzaW9uR1BUQ2xpZW50cyJ9.3jGL34l7R-cE1rtK9ODmzE4sAdfZtb4L_F59vFCV1T8",
].join(".");

describe("createAuthToken()", () => {
  it("should return username", () => {
    const { username } = createAuthToken(testAuthToken);
    expect(username).toBe("admin");
  });

  it("should return role", () => {
    const { role } = createAuthToken(testAuthToken);
    expect(role).toBe("Admin");
  });

  it("should return expiresAt as number", () => {
    const { expiresAt } = createAuthToken(testAuthToken);
    expect(expiresAt).toBeTypeOf("number");
  });
});
