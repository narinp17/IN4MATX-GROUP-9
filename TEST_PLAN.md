# Part 1 - Test Plan

## 1.1 Scope:

  In Scope
| Component / Feature | Why this matters |
| -------- | -------- |
| Location Matching & Proximity Filtering  | Primary application mechanic; failures risk revealing incorrect distances or leaking profiles outside the 2-mile boundary  |
| Blackout Zone Enforcement  | High privacy liability; must guarantee location data is masked and matches are severed client/server-side instantly upon entry  |
| Chatting Lifecycle  | Core architectural promise; chat sessions and historical messages must be permanently purged immediately when radius conditions break  |
| Ping/Wave Rate Limiting | Crucial for system anti-abuse, spam mitigation, and backend server stability |
| WebSocket Connectivity & Sync | Powers real-time message exchange and physical proximity exit notifications nativerly |

 Out of Scope
| Component / Feature | Why this matters |
| -------- | -------- |
| | |


## 1.2 Quality Goals:

To ensure a deterministic release criteria, our quality goals focus on spatial accuracy, privacy boundaries, and stable performance profiles.

- Special Consistency: PostGIS proximity filtering must yield a 0% false-positive rate for matching targets outside the 2-mile uniform radius boundary
- Privacy Ironclad Clause: Zero record of any historical user locations or transitory chat messages may persist in PostgreSQL once a session terminates or a user relocates out of range
- Throughput Resiliency: Node.js/Express backend handles 50 concurrent simulated local connections emoitting location updates simultaneously without dropping WebSocket frames or throwing HTTP 500 errors
- Latency Benchmark: The p95 response time for spatial queries processed through the database layer must remain under 300 ms locally
- Input intergrity: 100% of bio submission payloads over 300 characters or containing banned text strings are successfully intercepted and rejected prior to database persistence layers


## 1.3 Risks & Priorities

The structural mechanics of real-time location streaming and ephemeral state management introduce complex race conditions

| Area | Why it's risky / costly | Priority (H / M / L) |
| -------- | -------- | -------- |
| Blackout Zone Failure via Signla Drop | if the app drops GPS connectivity inside a user's defined blackout zone, their true private location could be falsely exposed to nearby users | H |
| Orphaned Transitory Chats | If a socket connection disconnects unexpectedly, messages could persist in database memory instead of purging cleanly, violating privacy mandates | H |
| High Frequency Location Polling Concurrency | Dozens of active clients concurrently pushing updates to /api/nearby-users can cause lock contentions during spatial indexing operations | M |
| ID Document Deletion Timing | Retaining ID records on local file paths due to uncaught server exceptions creates direct redulatory compliance violations | H |
| Relative Activity Label Rendering | Discrepancies in displaying calculated relative timestamps (e.g., "Active 5 mins ago") under clock desynchronization conditions is a minor cosmetic anomaly | L |


## 1.4 Strategy

Definitions
- Unit test: Verifies isolated code modules (individual functions, utility blocks, validation models) by executing them independently of outside architecture and using strict data mocks
- Integration test: Verifies that separate structural sub-systems (such as the communication loop between an Express router, a PostGIS database query, and a WebSocket socket) interact smoothly and return the expected states.

| Component | Test types you'll apply | Framework | Why this fit |
| -------- | -------- | -------- | -------- |
| Mobile Frontend (HTML/JS Prototype) | Unit, UI Validaton | Jest | Provides a zero-dependency environment ideal for checking character counters, mock coordinate entries, and UI button states |
| Backend Server (Node.js/Express) | Integration, API Routing | SuperTest & Mocha/Chai | SuperTest allows programmatic simulation of REST endpoints and WebSocket handshakes without spinning up manual local servers |
| Database (PostgreSQL/PostGIS) | Integration, Spatial Verification | pgTAP & Custom SQL Scripts | Enables native assertion of spatial distance queries and verifies database triggers for cleanup rules directly inside PostgreSQL |
| Cross-cutting (Concurrency/Load) | Stress, Race Condition Checks | Autocannon/k6 | Lightweight JavaScript-driven performance tool built to assert high-concurrency HTTP paths and WebSocket stream ceilings |


## 1.5 Environment & assumptions

out automated test design is decoupled from the live infrastructure tier and is xconfigured to run deterministically on developers' workstations

- Runtime Engines: Tests assume local developer execution on Node.js v20.x and PostgreSQL v15+ featuring an active PostGIS extension
- Database Isolation: Tests operate on an isolated local database instance populated with geometric coordinates. State is explicitly rolled back or wiped via TRUNCATE hooks before and after every test execution block
- API Mocks and Sandboxes: External verification endpoints are completely stubbed out. The third-party verification process returns deterministic mock payloads ({ verified: true, delete_immediate: true}) instantaneously
- State Management: No persistent global state is shared across tests; WebSocket sessions are closed programmatically immediately upon test completion to clean up the loop handlers
- Operating Systems: Local setups run natively on macOS/Windows environments, with integration tasks mapped to match Linux Ubuntu runners within a GitHUb Actions CI pipeline

## 1.6 Team roles

| Member | Owns which test categories / components |
| -------- | -------- |
| Anya Rajesh | |
| Narin Park | |
| Jolene Kwan | |
| Jett Chanka | |
| Steven Liu | |


# Part 2 - Tests Implemented & Reports

## 2.1 Required Minimums

Last updated: 2026-06-02 (commit 9f41d20)

| Category | Required? | Minimum | Achieved |
|---|---|---|---|
| Unit tests | Required | ≥ 5 | 23 |
| Integration tests | Required | ≥ 3 | 12 |

## 2.3 Tests by Category

Last updated: 2026-06-02 (commit 9f41d20)

| Category | Count | Examples |
|---|---|---|
| Unit | 23 | `calculateDistance` returns ~0 for identical coords; `isInsideBlackoutZone` returns true when inside radius |
| Integration | 12 | Ping: sending creates a pending record; `filterNearbyUsers`: excludes users beyond 2-mile radius |

## 2.4 Where the Tests Live + How to Run Them

```
src/tests/
├── all.test.js                  ← master test file (run this)
├── unit/
│   ├── location.test.js
│   ├── interests.test.js
│   ├── blackout.test.js
│   └── timeAgo.test.js
├── integration/
│   ├── ping.test.js
│   └── nearby.test.js
└── coverage/
    └── index.html               ← open in browser to view coverage report
```

Run commands:
```bash
cd src
npm install
npx jest
npx jest --coverage
```

| Category | Time | Where it runs |
|---|---|---|
| Unit | ~1s | local |
| Integration | ~1s | local |

## 2.5 Coverage Achieved

Last updated: 2026-06-02 (commit 9f41d20)

| Test type | Tool | Coverage % |
|---|---|---|
| Unit | Jest --coverage | 100% |
| Integration | Jest --coverage | 100% |
| **Combined (overall)** | merged report | **100%** |

`getCurrentPosition()` in `location.js` is not tested because it is a browser-native API that does not exist in the Jest/Node environment. WebSocket lifecycle, chat cleanup on radius exit, and server-side blackout enforcement are also untested — these required a live Socket.io backend that could not be reliably mocked within the scope of this sprint.

---

## 2.6 Plan-vs-implementation gap

| What the plan called for | What you actually shipped | What blocked you / what you'd add next |
|---|---|---|
| WebSocket connectivity & sync tests | Not implemented | Socket.io incompatibility with `ws`-based Jest patterns; `jest.useFakeTimers()` froze Socket.io's internal timers silently |
| Chat lifecycle / purge on radius exit | Not implemented | Race condition between WebSocket disconnect, DB deletion, and UI update caused flaky results; added artificial delays as a workaround |
| pgTAP database spatial verification | Not implemented | Requires a live PostgreSQL/PostGIS instance; not feasible in the Jest environment |
| Exact 2-mile boundary edge case | Not implemented | Identified as a gap; would test with a coordinate at exactly 3218.69m from the current user |

# Part 3 - Reflection

Testing the blackout zone feature caught a real bug we hadn't noticed. When a user entered a blackout zone, the backend was doing its job, it stopped sending match data right away. But the frontend never got the memo. The old profiles were still sitting there on the screen, visible and clickable, even though the backend had already cut them off. We only found this because we wrote one test for the API response and a separate test for what the UI was actually showing. Every time we tested manually, we refreshed the page after triggering the zone change, so the stale data vanished and we never saw the problem. The tests caught what our manual process was accidentally hiding.

The hardest thing to test was what happens when a user walks out of the 2-mile radius during an active chat. The app is supposed to disconnect the WebSocket, delete the chat history from the database, and update the UI all at once. The problem is these three things run on separate systems and there's no guarantee they finish in the same order every time. When we wrote tests for it, they would pass sometimes and fail other times depending on timing, which makes them basically useless. We ended up adding artificial wait times to force things to sync up, but that just made the tests slow. It's a genuinely hard problem because we are trying to test three moving parts that don't know about each other.

Next, we would add a test for when both users leave the radius at the exact same time. Right now we only test one person leaving while the other stays put. If both exit simultaneously, the cleanup code could try to delete the same chat session twice, or accidentally leave one person's connection still open. We'd simulate this by firing both location updates at the same time using Promise.all and then checking that the session is completely gone and both users are disconnected.

We would say that Claude was genuinely useful for writing the starting structure of our tests. It generated SuperTest stubs for our API routes and pgTAP boilerplate for the database tests, which saved a lot of time on setup. It also helped us think of edge cases we probably would have skipped, like testing users who are positioned exactly at the 2-mile boundary rather than clearly inside or outside it. However, there are some places it went wrong. For example, Claude wrote WebSocket test code designed for the raw ws library but our project uses Socket.io, which works differently under the hood. The tests looked completely fine but failed to establish a connection when we actually ran them. It also suggests using jest.useFakeTimers() to control timing in our tests, which normally works well but silently broke things because Socket.io uses its own internal timers that got frozen as well. Both mistakes were quite frustrating because the code looked right and there were no obvious error messages pointing to the real cause. Besides this, we would definitely say that Claude was a major help in terms of the testing aspect of this project.
