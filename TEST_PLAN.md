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
