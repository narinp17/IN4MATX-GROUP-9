/* eslint-env jest */
/* global describe, test, expect */
// tests/unit/interests.test.js
// Unit tests for interest tag matching logic

function getSharedInterests(interestsA, interestsB) {
  if (!interestsA || !interestsB) return [];
  const setB = new Set(interestsB.map((i) => i.toLowerCase().trim()));
  return interestsA.filter((i) => setB.has(i.toLowerCase().trim()));
}

describe("getSharedInterests", () => {
  test("returns the intersection of two interest arrays", () => {
    const a = ["running", "chess", "cooking"];
    const b = ["chess", "hiking", "cooking"];
    expect(getSharedInterests(a, b)).toEqual(["chess", "cooking"]);
  });

  test("returns empty array when there is no overlap", () => {
    const a = ["running", "chess"];
    const b = ["yoga", "painting"];
    expect(getSharedInterests(a, b)).toEqual([]);
  });

  test("is case-insensitive — 'Running' matches 'running'", () => {
    const a = ["Running", "Chess"];
    const b = ["running", "yoga"];
    expect(getSharedInterests(a, b)).toEqual(["Running"]);
  });

  test("handles extra whitespace in tags", () => {
    const a = [" chess ", "running"];
    const b = ["chess", "yoga"];
    expect(getSharedInterests(a, b)).toEqual([" chess "]);
  });

  test("returns empty array when either input is null or undefined", () => {
    expect(getSharedInterests(null, ["running"])).toEqual([]);
    expect(getSharedInterests(["running"], undefined)).toEqual([]);
  });

  test("returns empty array when both inputs are empty", () => {
    expect(getSharedInterests([], [])).toEqual([]);
  });
});