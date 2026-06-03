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
| | | | |


## 1.4 Strategy

Definitions
- Unit test: Verifies isolated code modules (individual functions, utility blocks, validation models) by executing them independently of outside architecture and using strict data mocks
- Integration test: Verifies that separate structural sub-systems (such as the communication loop between an Express router, a PostGIS database query, and a WebSocket socket) interact smoothly and return the expected states.

| Component | Test types you'll apply | Framework | Why this fit |
| -------- | -------- | -------- | -------- |
| Mobile Frontend (HTML/JS Prototype) | Unit, UI Validaton | Jest | Provides a zero-dependency environment ideal for checking character counters, mock coordinate entries, and UI button states |
| Backend Server (Node.js/Express) | Integration, API Routing | SuperTest & Mocha/Chai | SuperTest allows programmatic simulation of REST endpoints and WebSocket handshakes without spinning up manual local servers |
| Database (PostgreSQL/PostGIS) | Integration, Spatial Verification | pgTAP & Custom SQL Scripts | Enables native assertion of spatial distance queries and verifies database triggers for cleanup rules directly inside PostgreSQL |


## 1.5 Environment & assumptions


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

# Part 3 - Reflection

