import { describe, expect, it } from "vitest";
import { detectIntent, hashString, zenReply } from "./zen";

describe("hashString", () => {
  it("is deterministic", () => {
    expect(hashString("hello")).toBe(hashString("hello"));
  });

  it("differs for different input", () => {
    expect(hashString("hello")).not.toBe(hashString("world"));
  });

  it("returns a non-negative integer", () => {
    const h = hashString("anything");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(h)).toBe(true);
  });
});

describe("detectIntent", () => {
  it.each([
    ["hello there", "greeting"],
    ["I feel so much anxiety", "stress"],
    ["thank you so much", "gratitude"],
    ["help me focus on my exam", "focus"],
    ["I can't sleep at night", "sleep"],
    ["goodbye for now", "farewell"],
    ["what is the meaning of life", "reflection"],
  ] as const)("classifies %j as %s", (input, expected) => {
    expect(detectIntent(input)).toBe(expected);
  });
});

describe("zenReply", () => {
  it("returns a non-empty message and breath", () => {
    const reply = zenReply("I feel stressed");
    expect(reply.message.length).toBeGreaterThan(0);
    expect(reply.breath.length).toBeGreaterThan(0);
    expect(reply.intent).toBe("stress");
  });

  it("is deterministic for the same input", () => {
    expect(zenReply("focus please")).toEqual(zenReply("focus please"));
  });

  it("handles empty input gracefully", () => {
    const reply = zenReply("   ");
    expect(reply.message).toContain("What is on your mind?");
  });
});
