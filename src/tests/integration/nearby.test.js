/* eslint-env jest */
/* global describe, test, expect */
// tests/integration/nearby.test.js
// Integration tests for the nearby user discovery logic
// Combines distance filtering + visibility filtering + interest matching

// --- Utility functions (mirrors src/lib/location.js and src/lib/interests.js) ---
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

function getSharedInterests(a, b) {
  if (!a || !b) return [];
  const setB = new Set(b.map((i) => i.toLowerCase().trim()));
  return a.filter((i) => setB.has(i.toLowerCase().trim()));
}

const TWO_MILES_IN_METERS = 3218.69;

function filterNearbyUsers(currentUser, allProfiles) {
  return allProfiles
    .filter((profile) => {
      // Exclude self
      if (profile.user_id === currentUser.user_id) return false;
      // Exclude invisible users
      if (!profile.is_visible) return false;
      // Exclude users without location
      if (profile.latitude == null || profile.longitude == null) return false;
      // Exclude users beyond 2 miles
      const dist = calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        profile.latitude,
        profile.longitude
      );
      if (dist > TWO_MILES_IN_METERS) return false;
      // Must share at least 1 interest
      const shared = getSharedInterests(currentUser.interests, profile.interests);
      return shared.length > 0;
    })
    .map((profile) => ({
      profile,
      distance: calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        profile.latitude,
        profile.longitude
      ),
      sharedInterests: getSharedInterests(currentUser.interests, profile.interests),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// --- Test fixtures ---
const ME = {
  user_id: "me",
  latitude: 40.7128,
  longitude: -74.006,
  interests: ["chess", "running", "cooking"],
  is_visible: true,
};

const NEARBY_MATCH = {
  user_id: "user_nearby",
  display_name: "Nearby Alice",
  latitude: 40.714, // ~150m away
  longitude: -74.006,
  interests: ["chess", "yoga"],
  is_visible: true,
};

const FAR_MATCH = {
  user_id: "user_far",
  display_name: "Far Bob",
  latitude: 40.76,  // ~5km away — over 2 miles
  longitude: -74.006,
  interests: ["chess"],
  is_visible: true,
};

const INVISIBLE_MATCH = {
  user_id: "user_invisible",
  display_name: "Hidden Carol",
  latitude: 40.7135, // Close by
  longitude: -74.006,
  interests: ["running"],
  is_visible: false,
};

const NO_INTEREST_MATCH = {
  user_id: "user_no_interests",
  display_name: "Dave",
  latitude: 40.7135, // Close by
  longitude: -74.006,
  interests: ["painting", "pottery"],
  is_visible: true,
};

// --- Tests ---
describe("filterNearbyUsers", () => {
  test("only returns users within 2-mile radius", () => {
    const results = filterNearbyUsers(ME, [NEARBY_MATCH, FAR_MATCH]);
    const ids = results.map((r) => r.profile.user_id);
    expect(ids).toContain("user_nearby");
    expect(ids).not.toContain("user_far");
  });

  test("excludes users with is_visible: false", () => {
    const results = filterNearbyUsers(ME, [NEARBY_MATCH, INVISIBLE_MATCH]);
    const ids = results.map((r) => r.profile.user_id);
    expect(ids).not.toContain("user_invisible");
  });

  test("excludes users with no shared interests", () => {
    const results = filterNearbyUsers(ME, [NEARBY_MATCH, NO_INTEREST_MATCH]);
    const ids = results.map((r) => r.profile.user_id);
    expect(ids).not.toContain("user_no_interests");
  });

  test("excludes the current user from results", () => {
    const results = filterNearbyUsers(ME, [ME, NEARBY_MATCH]);
    const ids = results.map((r) => r.profile.user_id);
    expect(ids).not.toContain("me");
  });

  test("results include correct shared interests", () => {
    const results = filterNearbyUsers(ME, [NEARBY_MATCH]);
    expect(results[0].sharedInterests).toEqual(["chess"]);
  });

  test("results are sorted by distance ascending", () => {
    const closer = { ...NEARBY_MATCH, user_id: "closer", latitude: 40.7130 };
    const further = { ...NEARBY_MATCH, user_id: "further", latitude: 40.7145 };
    const results = filterNearbyUsers(ME, [further, closer]);
    expect(results[0].profile.user_id).toBe("closer");
    expect(results[1].profile.user_id).toBe("further");
  });

  test("returns empty array when no users pass filters", () => {
    const results = filterNearbyUsers(ME, [FAR_MATCH, INVISIBLE_MATCH, NO_INTEREST_MATCH]);
    expect(results).toEqual([]);
  });
});