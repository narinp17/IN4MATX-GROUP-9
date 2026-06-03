/* eslint-env jest */
/* global describe, test, expect */
// tests/unit/timeAgo.test.js
// Unit tests for the timeAgo date formatting utility

function timeAgo(dateString) {
  if (!dateString) return "unknown";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

describe("timeAgo", () => {
  test("returns 'just now' for timestamps under 60 seconds ago", () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(timeAgo(recent)).toBe("just now");
  });

  test("returns minutes for timestamps 1–59 minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(fiveMinAgo)).toBe("5m ago");
  });

  test("returns hours for timestamps 1–23 hours ago", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("3h ago");
  });

  test("returns days for timestamps over 24 hours ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(twoDaysAgo)).toBe("2d ago");
  });

  test("returns 'unknown' for null or undefined input", () => {
    expect(timeAgo(null)).toBe("unknown");
    expect(timeAgo(undefined)).toBe("unknown");
  });
});