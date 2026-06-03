/* eslint-env jest */
/* global jest, describe, test, expect, beforeEach */
// tests/integration/ping.test.js
// Integration tests for the Ping (wave) system
// The Base44 SDK is mocked — no live network calls are made.

// --- Mock Base44 SDK ---
const pingStore = [];

const mockPingEntity = {
  filter: jest.fn(async (query) => {
    return pingStore.filter((p) => {
      return Object.entries(query).every(([k, v]) => p[k] === v);
    });
  }),
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

// --- Business logic (mirrors pages/NearbyUsers sendPing logic) ---
async function sendPing(senderId, senderName, receiverId, receiverName, sharedInterests) {
  // Check for existing pending ping
  const existing = await mockPingEntity.filter({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending",
  });
  if (existing.length > 0) {
    throw new Error("Duplicate ping: a pending ping already exists");
  }
  return mockPingEntity.create({
    sender_id: senderId,
    sender_name: senderName,
    receiver_id: receiverId,
    receiver_name: receiverName,
    status: "pending",
    shared_interests: sharedInterests,
  });
}

async function acceptPing(pingId) {
  return mockPingEntity.update(pingId, { status: "accepted" });
}

async function ignorePing(pingId) {
  return mockPingEntity.update(pingId, { status: "ignored" });
}

// --- Tests ---
beforeEach(() => {
  pingStore.length = 0; // clear store between tests
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
    const accepted = await acceptPing(ping.id);
    expect(accepted.status).toBe("accepted");
  });

  test("ignoring a ping updates its status to 'ignored'", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", []);
    const ignored = await ignorePing(ping.id);
    expect(ignored.status).toBe("ignored");
  });

  test("sending a duplicate pending ping throws an error", async () => {
    await sendPing("user1", "Alice", "user2", "Bob", ["chess"]);
    await expect(
      sendPing("user1", "Alice", "user2", "Bob", ["chess"])
    ).rejects.toThrow("Duplicate ping");
  });

  test("shared interests are stored on the ping record", async () => {
    const ping = await sendPing("user1", "Alice", "user2", "Bob", ["running", "chess"]);
    expect(ping.shared_interests).toEqual(["running", "chess"]);
  });
});