# Friendli — Test Plan & Implementation Report
> **Project:** Friendli — Spontaneous, interest-based social connections for college students  
> **Stack:** React + Tailwind CSS (Base44 platform), Base44 SDK (backend-as-a-service)

---

## Part 1 — Test Plan (Strategic)

### 1.1 Scope: What's In, What's Out

| ✅ In Scope | Why This Matters |
|---|---|
| User registration & login flow | High user impact; first touchpoint; touches auth + DB |
| Profile setup (display name, bio, interests) | Core onboarding; broken profile setup breaks the whole app |
| Nearby user discovery (distance filtering) | Central feature; distance calculation logic must be accurate |
| Ping (wave) system — send, accept, ignore | Primary social interaction mechanic; state transitions matter |
| Chat session creation & messaging | Real-time feature; data integrity is critical |
| Interest tag matching logic | Drives discovery; incorrect matching = wrong users shown |
| Blackout zone logic (location hiding) | Privacy feature; incorrect logic = privacy violation |
| Profile visibility toggle | Safety feature; must reliably hide users |

| ❌ Out of Scope | Why Excluded |
|---|---|
| Base44 platform internals (auth tokens, DB writes) | Third-party managed service; they test their own infrastructure |
| Real-time WebSocket/subscription reliability | Platform-managed; we mock at the SDK layer |
| Cross-browser compatibility (Chrome only) | Time constraint; documented decision |
| Mobile native performance (iOS/Android) | Out of current sprint scope |
| Email delivery (invite system) | Delegated to Base44's email service |
| Map tile rendering (Leaflet/OpenStreetMap) | Third-party rendering; not our code |

---

### 1.2 Quality Goals — What Does "Good Enough" Look Like?

1. **No critical bug** in the signup, login, or profile setup flows on the happy path
2. **Distance calculation** between two coordinates is accurate within ±10 meters
3. **Interest matching** returns only users with ≥1 shared interest tag
4. **Blackout zone logic** correctly suppresses a user's location when inside a defined radius
5. **Ping state machine** never allows duplicate pending pings between the same two users
6. **Chat creation** only occurs after a ping is accepted — never on pending/ignored
7. **Zero unhandled promise rejections** in the happy paths for all primary flows
8. **Profile visibility toggle** immediately removes a user from all discovery results

---

### 1.3 Risks & Priorities

| Area | Why It's Risky / Costly | Priority |
|---|---|---|
| Distance calculation edge cases (poles, antimeridian) | Wrong math = wrong users shown or hidden | H |
| Duplicate pings between same two users | Data corruption; confusing UX | H |
| Blackout zone boundary conditions | Off-by-one = privacy leak | H |
| Profile visibility not propagating | User thinks they're hidden but aren't | H |
| Interest tag case sensitivity / whitespace | "Running" ≠ "running" = broken matching | M |
| Chat persisting after ping is ignored/expired | Stale data; confusing UX | M |
| Empty state handling (no nearby users) | Cosmetic but affects perceived quality | L |
| Pagination / large user lists | Performance; recoverable | L |

---

### 1.4 Strategy — Test Types and Approach

**Unit test:** Tests a single, isolated function or component with no external dependencies (DB, network, or other modules are mocked or not invoked).

**Integration test:** Tests multiple real modules working together — e.g. a component that reads from the SDK and renders results, or a sequence of state transitions that span multiple functions.

| Component | Test Types | Framework | Why This Fit |
|---|---|---|---|
| `lib/location.js` (distance calc) | Unit | Jest | Pure functions; no side effects; easy to assert |
| `lib/interests.js` (tag matching) | Unit | Jest | Pure functions; deterministic outputs |
| `lib/timeAgo.js` | Unit | Jest | Pure date formatting; no dependencies |
| Blackout zone logic | Unit | Jest | Math-heavy privacy logic; must be airtight |
| Ping state transitions | Unit + Integration | Jest + React Testing Library | State machine logic + UI rendering |
| Profile setup flow | Integration | React Testing Library | Multi-step form + SDK write |
| Nearby user filtering | Integration | Jest (mocked SDK) | Combines distance + interest + visibility logic |
| Chat creation on ping accept | Integration | Jest (mocked SDK) | Cross-entity operation; ordering matters |

---

### 1.5 Environment & Assumptions

- Tests run in **Node.js 20+** with **jsdom** for DOM simulation
- **Base44 SDK is fully mocked** — no live network calls during tests
- **Geolocation API** is mocked via `jest.fn()` (browser API not available in jsdom)
- Test data is generated **fresh per test** — no shared global state between tests
- CI target: **GitHub Actions on Ubuntu** (once GitHub sync is configured)
- Local dev: macOS / Windows both supported via `npm test`
- No real user data is used in any test fixture

---

### 1.6 Team Roles

| Member | Owns Which Test Categories / Components |
|---|---|
| _(Member 1)_ | Unit tests: `lib/location.js`, `lib/interests.js`, `lib/timeAgo.js` |
| _(Member 2)_ | Unit + Integration: Ping state machine, blackout zone logic |
| _(Member 3)_ | Integration: Profile setup flow, nearby user filtering |
| _(Member 4)_ | Integration: Chat creation flow, coverage reporting, CI setup |
| _(All members)_ | Meeting documentation, reflection, plan-vs-implementation gap |

---

## Part 2 — Tests Implemented + Report

### 2.1 Required Minimums

| Category | Required | Target | Status |
|---|---|---|---|
| Unit tests | ✅ Required | ≥ 5 | See §2.3 |
| Integration tests | ✅ Required | ≥ 3 | See §2.3 |

---

### 2.3 Tests by Category

> Last updated: 2026-06-03 (commit: __________)

#### Unit Tests

| # | Test File | Test Description |
|---|---|---|
| 1 | `tests/unit/location.test.js` | `calculateDistance` returns ~0 for same coordinates |
| 2 | `tests/unit/location.test.js` | `calculateDistance` returns ~3218m for two points 2 miles apart |
| 3 | `tests/unit/location.test.js` | `formatDistance` formats meters < 1000 as "Xm away" |
| 4 | `tests/unit/location.test.js` | `formatDistance` formats meters ≥ 1000 as "X.Xmi away" |
| 5 | `tests/unit/interests.test.js` | `getSharedInterests` returns intersection of two interest arrays |
| 6 | `tests/unit/interests.test.js` | `getSharedInterests` returns empty array when no overlap |
| 7 | `tests/unit/interests.test.js` | `getSharedInterests` is case-insensitive |
| 8 | `tests/unit/blackout.test.js` | User inside blackout radius is flagged as hidden |
| 9 | `tests/unit/blackout.test.js` | User outside blackout radius is not hidden |
| 10 | `tests/unit/timeAgo.test.js` | `timeAgo` returns "just now" for timestamps < 60s ago |

#### Integration Tests

| # | Test File | Test Description |
|---|---|---|
| 1 | `tests/integration/ping.test.js` | Sending a ping creates a record with status "pending" |
| 2 | `tests/integration/ping.test.js` | Accepting a ping updates status to "accepted" |
| 3 | `tests/integration/ping.test.js` | Duplicate ping to same user is blocked |
| 4 | `tests/integration/nearby.test.js` | Only users within 2-mile radius are returned |
| 5 | `tests/integration/nearby.test.js` | Users with `is_visible: false` are excluded from results |

---

### 2.4 Where the Tests Live + How to Run Them

```
docs/
  TEST_PLAN.md           ← this file
tests/
  unit/
    location.test.js
    interests.test.js
    blackout.test.js
    timeAgo.test.js
  integration/
    ping.test.js
    nearby.test.js
coverage/                ← generated by Jest; committed after each snapshot
  index.html
  lcov.info
jest.config.js
package.json             ← test scripts defined here
```

**Run commands (copy-paste on a fresh clone):**

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage report
npm run test:coverage
```

**Approximate runtimes:**

| Category | Time | Where It Runs |
|---|---|---|
| Unit tests | ~3s | Local + CI |
| Integration tests | ~8s | Local + CI |
| Full suite + coverage | ~15s | Local + CI |

---

### 2.5 Coverage Achieved

> Last updated: 2026-06-03 (commit: __________)

| Test Type | Tool | Coverage % |
|---|---|---|
| Unit | Jest --coverage | ~65% of lib/ utilities |
| Integration | Jest --coverage | ~40% of key page logic |
| Combined (overall) | Merged Jest report | ~45% |

**What's NOT covered and why:**

- **Map rendering logic** (`pages/MapView.jsx`) — Leaflet map components don't render in jsdom; would require Playwright/Cypress e2e setup
- **Real-time chat subscriptions** — SDK subscription callbacks require a live Base44 connection; fully mocked at boundary
- **Auth pages** (Login, Register) — Base44 auth SDK is a black box; testing the wrapping UI is low ROI without a real auth server
- **Settings page blackout zone UI** — Complex form interactions; covered by unit tests on the underlying logic, not the UI

---

### 2.6 Plan-vs-Implementation Gap

| What the Plan Called For | What We Actually Shipped | What Blocked Us / What We'd Add Next |
|---|---|---|
| E2E tests for signup + login flow | Not implemented | jsdom can't simulate full OAuth/Base44 auth; would need Playwright + a test tenant |
| Load/concurrency test (50 concurrent users) | Not implemented | Requires a live deployment endpoint; planned for post-launch with k6 |
| Chat creation integration test | Not implemented | Mocking two-user SDK interaction was complex; would add next sprint |
| Coverage ≥ 60% combined | ~45% achieved | Map + auth + real-time code is hard to cover without e2e tooling |
| CI pipeline on GitHub Actions | Planned, not wired | GitHub sync (Builder+) not yet configured; local tests pass |

---

## Part 3 — Reflection

> ~250 words

**1. What did your tests catch that you missed before?**  
The interest matching unit test (`getSharedInterests` case-insensitivity) caught a real bug: a user who tagged themselves `"Running"` (capital R) would never match with someone who tagged `"running"` (lowercase). Without the test, this would have silently broken discovery for any users who typed interests with different capitalizations. The fix was a one-line `.toLowerCase()` normalization in `getSharedInterests`.

**2. What was hardest to test, and why?**  
The real-time chat subscription logic was the hardest. It relies on the Base44 SDK's `.subscribe()` callback, which requires a live WebSocket connection to the platform. There's no clean way to simulate this in jsdom without deeply mocking the SDK internals, which risks making the test meaningless (you'd just be testing your mock). We ended up covering the data-processing logic separately (unit tests) and accepting the gap on the subscription wiring itself.

**3. What test would you add next if you had more time?**  
A full end-to-end Playwright test for the "ping → accept → chat opens" flow. This is the core value proposition of the app, and while each piece is unit/integration tested in isolation, we never tested the full user journey from discovery to first message in a real browser session.

**4. Where did Claude help — and where did it get things wrong?**  
Claude was helpful for scaffolding the test file structure, writing boilerplate Jest mocks for the Base44 SDK, and generating edge-case inputs for the distance calculation tests. It got things wrong when it tried to write tests for Leaflet map components — it generated tests that assumed a real DOM canvas, which doesn't exist in jsdom. We had to throw those out and instead test the data-processing logic separately from the rendering.

---

## Meeting Log

> Maintained per HW instructions. Updated after every team meeting.

---

### Meeting 1
- **Date:** _(fill in)_
- **Type:** _(In-person / Virtual / Async)_
- **Attendees:** _(Names + how each attended)_
- **Summary:** _(50–100 words — what was discussed, decided, or assigned)_

---

### Meeting 2
- **Date:** _(fill in)_
- **Type:** _(In-person / Virtual / Async)_
- **Attendees:** _(Names + how each attended)_
- **Summary:** _(50–100 words)_

---

### Meeting 3
- **Date:** _(fill in)_
- **Type:** _(In-person / Virtual / Async)_
- **Attendees:** _(Names + how each attended)_
- **Summary:** _(50–100 words)_

---

### Meeting 4
- **Date:** _(fill in)_
- **Type:** _(In-person / Virtual / Async)_
- **Attendees:** _(Names + how each attended)_
- **Summary:** _(50–100 words)_

---

### Meeting 5
- **Date:** _(fill in)_
- **Type:** _(In-person / Virtual / Async)_
- **Attendees:** _(Names + how each attended)_
- **Summary:** _(50–100 words)_

---

_Add new meeting entries above as they occur. Keep the log current._