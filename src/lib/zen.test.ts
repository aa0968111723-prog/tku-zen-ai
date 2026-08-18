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

  it("never produces 'undefined' fragments or empty breath across many inputs", () => {
    const samples = [
      "hello",
      "I feel stressed about my exams",
      "help me focus",
      "I can't sleep at night",
      "thank you so much",
      "goodbye",
      "what is the meaning of life",
      "z",
      "the quick brown fox jumps over the lazy dog",
    ];
    for (let i = 0; i < 500; i += 1) {
      const input = `${samples[i % samples.length]} ${i}`;
      const reply = zenReply(input);
      expect(reply.message).not.toContain("undefined");
      expect(reply.breath).toBeTruthy();
      expect(reply.breath).not.toContain("undefined");
    }
  });
});
