import { describe, expect, it, vi } from "vitest";
import { createId } from "../lib/id";

describe("createId", () => {
  it("generates a UUID when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (bytes: Uint8Array) => {
        bytes.fill(7);
        return bytes;
      },
    });

    expect(createId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );

    vi.unstubAllGlobals();
  });
});
