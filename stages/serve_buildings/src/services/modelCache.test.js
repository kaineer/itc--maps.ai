import { beforeEach, describe, expect, it } from "vitest";
import { createModelCache } from "./modelCache";

describe("service without data function", () => {
  it("should fail when calling cacheValues", async () => {
    const service = createModelCache();
    expect(async () => service.cacheValues()).rejects.toThrow(
      "getValues() not set",
    );
  });
});

describe("service with data function", () => {
  it("should return data with cacheValues", async () => {
    const service = createModelCache(async () => "data");
    expect(await service.cacheValues()).toBe("data");
  });

  it("should not run data function twice", async () => {
    const service = createModelCache(async () => []);

    const values = await service.cacheValues();
    expect(await service.cacheValues()).toBe(values);
  });

  it("should run data function again after invalidation", async () => {
    const service = createModelCache(async () => []);

    const values = await service.cacheValues();
    service.invalidateCache();
    expect(await service.cacheValues()).not.toBe(values);
  });
});
