/* eslint-env jest */
/* global jest, describe, test, expect, beforeEach */
// tests/all.test.js
// All test cases for the Friendli app — unit + integration combined

// ─────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
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

function getSharedInterests(interestsA, interestsB) {
  if (!interestsA || !interestsB) return [];
  const setB = new Set(interestsB.map((i) => i.toLowerCase().trim()));
  return interestsA.filter((i) => setB.has(i.toLowerCase().trim()));
}

function isInsideBlackoutZone(userLat, userLon, zones) {
  if (!zones || zones.length === 0) return false;
  return zones.some((zone) => {
    const dist = calculateDistance(userLat, userLon, zone.latitude, zone.longitude);
    return dist <= zone.radius_meters;
  });
}

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

const TWO_MILES_IN_METERS = 3218.69;

function filterNearbyUsers(currentUser, allProfiles) {
  return allProfiles
    .filter((profile) => {
      if (profile.user_id === currentUser.user_id) return false;
      if (!profile.is_visible) return false;
      if (profile.latitude == null || profile.longitude == null) return false;
      const dist = calculateDistance(
        currentUser.latitude, currentUser.longitude,
        profile.latitude, profile.longitude
      );
      if (dist > TWO_MILES_IN_METERS) return false;
      return getSharedInterests(currentUser.interests, profile.interests).length > 0;
    })
    .map((profile) => ({
      profile,
      distance: calculateDistance(
        currentUser.latitude, currentUser.longitude,
        profile.latitude, profile.longitude
      ),
      sharedInterests: getSharedInterests(currentUser.interests, profile.interests),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// ─────────────────────────────────────────────
// UNIT: calculateDistance
// ─────────────────────────────────────────────
describe("calculateDistance", () => {
  test("returns ~0 for identical coordinates", () => {
    expect(calculateDistance(40.7128, -74.006, 40.7128, -74.006)).toBeCloseTo(0, 0);
  });

  test("returns ~3218m for two points exactly 2 miles apart", () => {
    const d = calculateDistance(40.7128, -74.006, 40.7417, -74.006);
    expect(d).toBeGreaterThan(3000);
    expect(d).toBeLessThan(3500);
  });

  test("returns a positive number for any two different points", () => {
    expect(calculateDistance(34.0522, -118.2437, 37.7749, -122.4194)).toBeGreaterThan(0);
  });

  test("is symmetric — A to B equals B to A", () => {
    const d1 = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
    const d2 = calculateDistance(34.0522, -118.2437, 40.7128, -74.006);
    expect(d1).toBeCloseTo(d2, 0);
  });
});

// ─────────────────────────────────────────────
// UNIT: formatDistance
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// UNIT: getSharedInterests
// ─────────────────────────────────────────────
describe("getSharedInterests", () => {
  test("returns the intersection of two interest arrays", () => {
    expect(getSharedInterests(["running", "chess", "cooking"], ["chess", "hiking", "cooking"]))
      .toEqual(["chess", "cooking"]);
  });

  test("returns empty array when there is no overlap", () => {
    expect(getSharedInterests(["running", "chess"], ["yoga", "painting"])).toEqual([]);
  });

  test("is case-insensitive — 'Running' matches 'running'", () => {
    expect(getSharedInterests(["Running", "Chess"], ["running", "yoga"])).toEqual(["Running"]);
  });

  test("handles extra whitespace in tags", () => {
    expect(getSharedInterests([" chess ", "running"], ["chess", "yoga"])).toEqual([" chess "]);
  });

  test("returns empty array when either input is null or undefined", () => {
    expect(getSharedInterests(null, ["running"])).toEqual([]);
    expect(getSharedInterests(["running"], undefined)).toEqual([]);
  });

  test("returns empty array when both inputs are empty", () => {
    expect(getSharedInterests([], [])).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// UNIT: isInsideBlackoutZone
// ─────────────────────────────────────────────
const HOME_ZONE = { name: "Home", latitude: 40.7128, longitude: -74.006, radius_meters: 200 };

describe("isInsideBlackoutZone", () => {
  test("returns true when user is inside the blackout radius", () => {
    expect(isInsideBlackoutZone(40.7128, -74.006, [HOME_ZONE])).toBe(true);
  });

  test("returns false when user is outside the blackout radius", () => {
    expect(isInsideBlackoutZone(40.7173, -74.006, [HOME_ZONE])).toBe(false);
  });

  test("returns false when there are no blackout zones", () => {
    expect(isInsideBlackoutZone(40.7128, -74.006, [])).toBe(false);
    expect(isInsideBlackoutZone(40.7128, -74.006, null)).toBe(false);
  });

  test("returns true if user is inside ANY of multiple zones", () => {
    const workZone = { name: "Work", latitude: 40.758, longitude: -73.9855, radius_meters: 300 };
    expect(isInsideBlackoutZone(40.758, -73.9855, [HOME_ZONE, workZone])).toBe(true);
  });

  test("returns false if user is outside ALL zones", () => {
    const workZone = { name: "Work", latitude: 40.758, longitude: -73.9855, radius_meters: 300 };
    expect(isInsideBlackoutZone(34.0522, -118.2437, [HOME_ZONE, workZone])).toBe(false);
  });
});

// ─────────────────────────────────────────────
// UNIT: timeAgo
// ─────────────────────────────────────────────
describe("timeAgo", () => {
  test("returns 'just now' for timestamps under 60 seconds ago", () => {
    expect(timeAgo(new Date(Date.now() - 30 * 1000).toISOString())).toBe("just now");
  });

  test("returns minutes for timestamps 1–59 minutes ago", () => {
    expect(timeAgo(new Date(Date.now() - 5 * 60 * 1000).toISOString())).toBe("5m ago");
  });

  test("returns hours for timestamps 1–23 hours ago", () => {
    expect(timeAgo(new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString())).toBe("3h ago");
  });

  test("returns days for timestamps over 24 hours ago", () => {
    expect(timeAgo(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())).toBe("2d ago");
  });

  test("returns 'unknown' for null or undefined input", () => {
    expect(timeAgo(null)).toBe("unknown");
    expect(timeAgo(undefined)).toBe("unknown");
  });
});

// ─────────────────────────────────────────────
// INTEGRATION: Ping system
// ─────────────────────────────────────────────
const pingStore = [];

const mockPingEntity = {
  filter: jest.fn(async (query) =>
    pingStore.filter((p) => Object.entries(query).every(([k, v]) => p[k] === v))
  ),
  create: jest.fn(async (data) => {
    const record = { id: `ping_${Date.now()}_${Math.random()}`, ...data };
    pingStore.push(record);
    return record;
  }),
  update: jest.fn(async (id, data) => {
    const idx = pingStore.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Ping not found");
    pingStore[idx] = { ...pingStore[idx], ...data };
    return pingStore[idx];
  }),
};

async function sendPing(senderId, senderName, receiverId, receiverName, sharedInterests) {
  const existing = await mockPingEntity.filter({ sender_id: senderId, receiver_id: receiverId, status: "pending" });
  if (existing.length > 0) throw new Error("Duplicate ping: a pending ping already exists");
  return mockPingEntity.create({ sender_id: senderId, sender_name: senderName, receiver_id: receiverId, receiver_name: receiverName, status: "pending", shared_interests: sharedInterests });
}

async function acceptPing(pingId) { return mockPingEntity.update(pingId, { status: "accepted" }); }
async function ignorePing(pingId) { return mockPingEntity.update(pingId, { status: "ignored" }); }

beforeEach(() => {
  pingStore.length = 0;
  jest.clearAllMocks();
});

describe("Ping integration", () => {
  test("sending a ping creates a record with status 'pending'", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", ["chess"]);
    expect(ping.status).toBe("pending");
    expect(ping.sender_id).toBe("user1");
    expect(ping.receiver_id).toBe("user2");
    expect(pingStore).toHaveLength(1);
  });

  test("accepting a ping updates its status to 'accepted'", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", ["chess"]);
    expect((await acceptPing(ping.id)).status).toBe("accepted");
  });

  test("ignoring a ping updates its status to 'ignored'", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", []);
    expect((await ignorePing(ping.id)).status).toBe("ignored");
  });

  test("sending a duplicate pending ping throws an error", async () => {
    await sendPing("user1", "Alice", "user2", "Bob", ["chess"]);
    await expect(sendPing("user1", "Alice", "user2", "Bob", ["chess"])).rejects.toThrow("Duplicate ping");
  });

  test("shared interests are stored on the ping record", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", ["running", "chess"]);
    expect(ping.shared_interests).toEqual(["running", "chess"]);
  });
});

// ─────────────────────────────────────────────
// INTEGRATION: Nearby user discovery
// ─────────────────────────────────────────────
const ME = { user_id: "me", latitude: 40.7128, longitude: -74.006, interests: ["chess", "running", "cooking"], is_visible: true };
const NEARBY_MATCH = { user_id: "user_nearby", display_name: "Nearby Alice", latitude: 40.714, longitude: -74.006, interests: ["chess", "yoga"], is_visible: true };
const FAR_MATCH = { user_id: "user_far", display_name: "Far Bob", latitude: 40.76, longitude: -74.006, interests: ["chess"], is_visible: true };
const INVISIBLE_MATCH = { user_id: "user_invisible", display_name: "Hidden Carol", latitude: 40.7135, longitude: -74.006, interests: ["running"], is_visible: false };
const NO_INTEREST_MATCH = { user_id: "user_no_interests", display_name: "Dave", latitude: 40.7135, longitude: -74.006, interests: ["painting", "pottery"], is_visible: true };

describe("filterNearbyUsers", () => {
  test("only returns users within 2-mile radius", () => {
    const ids = filterNearbyUsers(ME, [NEARBY_MATCH, FAR_MATCH]).map((r) => r.profile.user_id);
    expect(ids).toContain("user_nearby");
    expect(ids).not.toContain("user_far");
  });

  test("excludes users with is_visible: false", () => {
    const ids = filterNearbyUsers(ME, [NEARBY_MATCH, INVISIBLE_MATCH]).map((r) => r.profile.user_id);
    expect(ids).not.toContain("user_invisible");
  });

  test("excludes users with no shared interests", () => {
    const ids = filterNearbyUsers(ME, [NEARBY_MATCH, NO_INTEREST_MATCH]).map((r) => r.profile.user_id);
    expect(ids).not.toContain("user_no_interests");
  });

  test("excludes the current user from results", () => {
    const ids = filterNearbyUsers(ME, [ME, NEARBY_MATCH]).map((r) => r.profile.user_id);
    expect(ids).not.toContain("me");
  });

  test("results include correct shared interests", () => {
    expect(filterNearbyUsers(ME, [NEARBY_MATCH])[0].sharedInterests).toEqual(["chess"]);
  });

  test("results are sorted by distance ascending", () => {
    const closer = { ...NEARBY_MATCH, user_id: "closer", latitude: 40.7130 };
    const further = { ...NEARBY_MATCH, user_id: "further", latitude: 40.7145 };
    const results = filterNearbyUsers(ME, [further, closer]);
    expect(results[0].profile.user_id).toBe("closer");
    expect(results[1].profile.user_id).toBe("further");
  });

  test("returns empty array when no users pass filters", () => {
    expect(filterNearbyUsers(ME, [FAR_MATCH, INVISIBLE_MATCH, NO_INTEREST_MATCH])).toEqual([]);
  });
});