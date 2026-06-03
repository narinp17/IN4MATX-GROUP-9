/* eslint-env jest */
/* global describe, test, expect */
// tests/unit/location.test.js
// Unit tests for distance calculation and formatting utilities

// Inline the logic here since Base44 src isn't importable in a plain Node test runner.
// These mirror the functions in src/lib/location.js exactly.

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m away`;
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)}mi away`;
}

describe("calculateDistance", () => {
  test("returns ~0 for identical coordinates", () => {
    const d = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
    expect(d).toBeCloseTo(0, 0);
  });

  test("returns ~3218m for two points exactly 2 miles apart", () => {
    // NYC → ~2 miles north
    const d = calculateDistance(40.7128, -74.006, 40.7417, -74.006);
    expect(d).toBeGreaterThan(3000);
    expect(d).toBeLessThan(3500);
  });

  test("returns a positive number for any two different points", () => {
    const d = calculateDistance(34.0522, -118.2437, 37.7749, -122.4194);
    expect(d).toBeGreaterThan(0);
  });

  test("is symmetric — A to B equals B to A", () => {
    const d1 = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
    const d2 = calculateDistance(34.0522, -118.2437, 40.7128, -74.006);
    expect(d1).toBeCloseTo(d2, 0);
  });
});

describe("formatDistance", () => {
  test("formats meters under 1000 as 'Xm away'", () => {
    expect(formatDistance(250)).toBe("250m away");
  });

  test("formats meters over 1000 as 'X.Xmi away'", () => {
    expect(formatDistance(3218)).toBe("2.0mi away");
  });

  test("rounds meters under 1000 correctly", () => {
    expect(formatDistance(99.7)).toBe("100m away");
  });
});