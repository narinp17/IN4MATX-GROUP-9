/* eslint-env jest */
/* global describe, test, expect */
// tests/unit/blackout.test.js
// Unit tests for blackout zone (location privacy) logic

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

function isInsideBlackoutZone(userLat, userLon, zones) {
  if (!zones || zones.length === 0) return false;
  return zones.some((zone) => {
    const dist = calculateDistance(userLat, userLon, zone.latitude, zone.longitude);
    return dist <= zone.radius_meters;
  });
}

const HOME_ZONE = {
  name: "Home",
  latitude: 40.7128,
  longitude: -74.006,
  radius_meters: 200,
};

describe("isInsideBlackoutZone", () => {
  test("returns true when user is inside the blackout radius", () => {
    // Same coordinates as zone center — definitely inside
    expect(isInsideBlackoutZone(40.7128, -74.006, [HOME_ZONE])).toBe(true);
  });

  test("returns false when user is outside the blackout radius", () => {
    // ~500m away from zone center
    expect(isInsideBlackoutZone(40.7173, -74.006, [HOME_ZONE])).toBe(false);
  });

  test("returns false when there are no blackout zones", () => {
    expect(isInsideBlackoutZone(40.7128, -74.006, [])).toBe(false);
    expect(isInsideBlackoutZone(40.7128, -74.006, null)).toBe(false);
  });

  test("returns true if user is inside ANY of multiple zones", () => {
    const workZone = {
      name: "Work",
      latitude: 40.758,
      longitude: -73.9855,
      radius_meters: 300,
    };
    // User is at workZone center
    expect(isInsideBlackoutZone(40.758, -73.9855, [HOME_ZONE, workZone])).toBe(true);
  });

  test("returns false if user is outside ALL zones", () => {
    const workZone = {
      name: "Work",
      latitude: 40.758,
      longitude: -73.9855,
      radius_meters: 300,
    };
    // User is far from both zones
    expect(isInsideBlackoutZone(34.0522, -118.2437, [HOME_ZONE, workZone])).toBe(false);
  });
});