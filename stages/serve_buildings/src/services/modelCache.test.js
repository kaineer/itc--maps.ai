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
  let fn = null;
  beforeEach(() => {
    fn = (() => {
      let number = 1;
      return async () => {
        const value = number;
        number++;
        return value;
      };
    })();
  });

  it("should return data with cacheValues", async () => {
    const service = createModelCache(async () => "data");
    expect(await service.cacheValues()).toBe("data");
  });

  it("should not run data function twice", async () => {
    const service = createModelCache(fn);

    expect(await service.cacheValues()).toBe(1);
    expect(await service.cacheValues()).toBe(1);
  });

  it("should run data function again after invalidation", async () => {
    const service = createModelCache(fn);

    expect(await service.cacheValues()).toBe(1);
    service.invalidateCache();
    expect(await service.cacheValues()).toBe(2);
  });
});
