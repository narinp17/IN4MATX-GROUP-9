# Architecture

## Overall Architecture Summary

Friendli follows a client-server architecture designed for mobile devices. The system consists of a mobile frontend application, a backend API server, a database, and external services such as push notifications and ID verification. These components communicate through RESTful APIs using JSON over HTTPS, supplemented by WebSockets for real-time events such as live chat and pings.

The mobile frontend runs on Android and iOS devices. It is responsible for displaying nearby users, managing profiles, sending pings, handling temporary chats, and managing privacy settings such as blackout zones. Our current prototype frontend was built using HTML and JavaScript, but future versions will likely use React Native for better scalability and mobile support. To ensure a smooth user experience, the frontend implements "Graceful Degradation," displaying cached data (like the last known match list) if the internet connection is temporarily lost.

The backend server is built with Node.js and Express and would run on a cloud platform such as AWS. The backend handles authentication, user matching, chat session management, ping rate limiting, location filtering, and communication with third-party verification services. It also processes nearby-user requests by checking proximity and shared interests. To handle location-based queries efficiently, the backend utilizes PostGIS, a spatial database extender for PostgreSQL, to perform high-speed proximity calculations directly within the database layer.

The database stores user accounts, bios, interest tags, blackout zones, last active timestamps, and temporary chat metadata. Sensitive data is minimized whenever possible. For example, uploaded ID images are deleted immediately after verification, and temporary chats are not permanently stored.

Friendli mainly uses a client-server design style because it separates frontend and backend responsibilities, making the system easier to maintain and scale. The system also uses a layered architecture, separating the user interface, application logic, and database into distinct layers. RESTful API communication allows lightweight and standardized interaction between system components.

For the purposes of this course, all components (the frontend, backend, and database) will run locally on a development machine. In a future production deployment, the backend and database would be hosted on AWS.


 ## Platforms
 
**Mobile Frontend — React Native (iOS and Android)**  
We chose React Native because it allows us to build a single codebase that runs on both iOS and Android. For a small team, maintaining two separate native codebases in Swift and Kotlin would be impractical. React Native also has strong community support and documentation, which is helpful for a team still learning. Our current prototype uses plain HTML and JavaScript, with React Native planned for future iterations as the team's experience grows.
- Benefit: one codebase runs on both iOS and Android, saving significant development time for a small team
- Drawback: harder to debug than fully native development, and some device-specific features like precise GPS behavior may require additional configuration

**Backend Server — Node.js with Express**  
We chose Node.js with Express because it uses JavaScript, the same language our team is already using for the frontend, meaning we do not have to learn a second language to build the backend. Node.js also handles many simultaneous connections efficiently, which suits a real-time app where multiple users may be sending location updates or pings at the same time. The backend will run on AWS in production and locally during development.
- Benefit: JavaScript on both frontend and backend means one language across the whole project, reducing complexity for a beginner team
- Drawback: Node.js is single-threaded, meaning computationally heavy tasks can slow it down, though for our use case most operations are lightweight data lookups

**Database — PostgreSQL with PostGIS**  
We chose PostgreSQL because it is reliable, well-documented, and widely used, making it easy to find learning resources. The PostGIS extension adds built-in support for geographic queries, allowing us to find all users within a 2-mile radius directly at the database level rather than calculating distances manually in backend code. We chose a single database rather than adding a second caching layer like Redis in order to keep our infrastructure manageable for our team's experience level. The database will run on AWS RDS in production and locally during development.
- Benefit: PostGIS handles 2-mile radius proximity queries natively, no manual distance math needed in the backend
- Drawback: more setup and configuration than beginner-friendly options like Firebase, and complex spatial queries have a learning curve

**Note:** In a future iteration, Redis will be added as an in-memory caching layer to handle short-lived data such as live location updates and temporary chat sessions more efficiently, reducing load on the primary PostgreSQL database. 

## Programming Languages

**JavaScript** will be used for both frontend and backend development. The frontend prototype was implemented using HTML, CSS, and JavaScript, while the backend server uses Node.js and Express for handling API requests, authentication, matching logic, and chat session management.
- Benefit: one language across the full stack means less context switching and more flexibility across the team
- Drawback: JavaScript's loosely typed nature means errors that could be caught early in other languages may only appear at runtime, making debugging harder
  
**HTML/CSS** are used for structuring and styling the current frontend prototype interface.
- Benefit: easy to learn and fast to prototype with, no build tools or frameworks required
- Drawback: not suitable for a production mobile app, which is why we plan to transition to React Native in future iterations
  
**SQL** will be used for interacting with the PostgreSQL database, including storing and retrieving user profiles, interests, blackout zones, timestamps, and temporary chat metadata.
- Benefit: well-documented and widely taught, making it approachable for our team
- Drawback: complex spatial queries using PostGIS have a learning curve we expect to encounter as development continues

**TypeScript — Planned for Future Iterations**  
In future iterations, TypeScript may be introduced alongside React Native to improve code maintainability, scalability, and type safety for the mobile application.
- Benefit: catches type errors at development time rather than runtime, improving code reliability
- Drawback: adds setup complexity and a learning curve that is not practical for our current prototype stage


## Communication Protocols

**REST API over HTTPS**  
The primary communication method between the frontend and backend is REST over HTTPS. The frontend sends HTTP requests to the backend, and the backend responds with JSON-formatted data. HTTPS will ensure all data in transit is encrypted. This protocol handles user authentication, profile creation and updates, location updates, nearby user retrieval, ping requests, and blackout zone management.

For example, when the app requests nearby users, the frontend sends a GET request to `/api/nearby-users` with a JSON body like:
```json
{
  "userId": "peteranteater",
  "latitude": 33.6405,
  "longitude": -117.8443
}
```
Then, the backend returns:
```json
{
  "users": [
    { "id": 1, "name": "Jake", "interests": ["running", "music"], "distance": 1.2 },
    { "id": 2, "name": "Layla", "interests": ["gaming", "art"], "distance": 0.7 }
  ]
}
```

**WebSockets**  
WebSockets will be used for features requiring real-time, two-way communication, such as live chat messaging, incoming ping notifications, and radius-exit alerts. Unlike REST, which requires the client to repeatedly ask the server for updates, WebSockets keep an open connection so the server can push updates instantly. We plan to use Socket.io, a JavaScript library that simplifies WebSocket implementation and handles reconnection logic automatically.

**SQL and Spatial Queries — PostGIS**  
The backend internally communicates with the PostgreSQL database using SQL queries. For proximity-based matching, PostGIS spatial functions filter users within the 2-mile radius directly at the database level rather than retrieving all users and calculating distances manually in JavaScript, which is more efficient.

## Examples of Component Functions and Connector Communications

### User Bio/Profile Workflow

When a user creates or edits a profile, the frontend sends the user's display name, bio text, and selected interests to the backend API. The backend validates the bio length and checks for inappropriate content before storing the data in the database. Once saved, the backend returns a success response and the frontend updates the user profile display.

**Frontend function:** `submitProfile()`

**Connector — REST POST request to `/api/profile`:**
```json
{
  "userId": "peteranteater",
  "displayName": "Peter",
  "bio": "I love hiking and board games!",
  "interests": ["hiking", "board games", "photography"]
}
```

**Backend function:** `handleProfileUpdate(req, res)`

**Database write (SQL fields):**
users table: user_id, display_name, bio, created_at, updated_at  
interests table: user_id, interest_tag

**Connector — REST response:**
```json
{
  "success": true,
  "message": "Profile saved successfully."
}
```

---

### Nearby User Matching

When a user opens the app, the frontend retrieves the user's GPS location and sends it to the backend. The backend uses spatial indexing to query the database for users within the 2-mile radius who share at least one interest. The backend then returns nearby user data in JSON format, which the frontend displays. To protect user privacy and prevent "triangulation," the backend may return "fuzzy" proximity labels (e.g., "within 0.5 miles") rather than exact GPS coordinates.
**Frontend function:** `getNearbyUsers()`

**Connector — REST GET request to `/api/nearby-users`:**
```json
{
  "userId": "peteranteater",
  "latitude": 33.6405,
  "longitude": -117.8443
}
```

**Backend function:** `findNearbyUsers(req, res)`

**Database query (PostGIS):**
```sql
SELECT user_id, display_name, interests, last_active
FROM users
WHERE ST_DWithin(location, ST_MakePoint(-117.8443, 33.6405)::geography, 3218)
AND is_hidden = false;
```

**Connector — REST response:**
```json
{
  "users": [
    { "id": 1, "name": "Jake", "interests": ["running", "music"], "distance": 1.2 },
    { "id": 2, "name": "Layla", "interests": ["gaming", "art"], "distance": 0.7 }
  ]
}
```

---

### Ping/Wave Workflow

When a user taps the "Ping" button, the frontend sends a request containing the sender ID and recipient ID to the backend. The backend validates the request, checks rate limits, and sends a notification to the recipient. If the recipient accepts the ping, the backend creates a temporary chat session and notifies both users.

**Frontend function:** `sendPing(fromUserId, toUserId)`

**Connector — REST POST request to `/api/send-ping`:**
```json
{
  "from": "smiski",
  "to": "labubu"
}
```

**Backend function:** `handlePing(req, res)`

**Database write (SQL fields):**
pings table: ping_id, sender_id, recipient_id, status, created_at

**Connector — REST response:**
```json
{
  "message": "Ping sent from smiski to labubu"
}
```

---

### Blackout Zone Workflow

Users can create blackout zones through the frontend by selecting areas on a map. These coordinates are stored in the database. When a location update is received, the backend checks the user's position against their stored blackout zones. If a match is found, the system server-side flags the user as "Hidden," ensuring their data is excluded from all discovery queries until they exit the zone.

**Frontend function:** `saveBlackoutZone()`

**Connector — REST POST request to `/api/blackout-zone`:**
```json
{
  "userId": "peteranteater",
  "zoneName": "Home",
  "latitude": 33.6405,
  "longitude": -117.8443,
  "radiusMeters": 200
}
```

**Backend function:** `checkBlackoutZone(userId, currentLocation)`

**Database write (SQL fields):**
blackout_zones table: zone_id, user_id, zone_name, latitude, longitude, radius_meters
users table: is_hidden, updated_at

**Connector — REST response:**
```json
{
  "success": true,
  "isHidden": true,
  "message": "You have entered a blackout zone. Your profile is now hidden."
}
```

---

### Fixed Range Workflow

When the app detects a location update, the frontend sends updated GPS coordinates to the backend. The backend recalculates nearby matches by filtering users within the fixed 2-mile radius and returns refreshed match results in JSON format. The frontend then updates the nearby users list automatically.

**Frontend function:** `updateLocation()`

**Connector — REST POST request to `/api/location-update`:**
```json
{
  "userId": "peteranteater",
  "latitude": 33.6412,
  "longitude": -117.8450
}
```

**Backend function:** `refreshNearbyMatches(req, res)`

**Connector — REST response:**
```json
{
  "users": [
    { "id": 1, "name": "Jake", "interests": ["running", "music"], "distance": 0.9 },
    { "id": 3, "name": "Riley", "interests": ["music", "art"], "distance": 1.5 }
  ]
}
```

---


### Transitory Chat Workflow

After two users accept each other's pings, the backend creates a temporary chat session. Messages are transmitted via WebSockets for sub-second latency. If either user leaves the 2-mile radius, the backend deletes the session. To prevent the chat from closing due to minor GPS signal "jitter," the system implements a grace period, waiting 60 seconds before permanently deleting a session when a user appears to leave the radius.

**Frontend function:** `openChatSession(userId, matchedUserId)`

**Connector — WebSocket message (on session open):**
```json
{
  "event": "chat_opened",
  "sessionId": "session_001",
  "participants": ["peteranteater", "labubu"]
}
```

**Backend function:** `createChatSession(userA, userB)`

**Backend function:** `monitorProximity(sessionId)`

**Database write (SQL fields):**
chat_sessions table: session_id, user_a_id, user_b_id, created_at, is_active

**Connector — WebSocket message (on session close):**
```json
{
  "event": "chat_closed",
  "sessionId": "session_001",
  "reason": "User left the radius."
}
```

---


### Last Active Status Workflow

Whenever a user performs an action in the app, the frontend sends an activity update request to the backend. The backend records the latest timestamp in the database. When another user views that profile, the backend returns the relative activity status data (such as "Active 5 mins ago"), which the frontend displays.

**Frontend function:** `sendActivityUpdate()`

**Connector — REST POST request to `/api/activity`:**
```json
{
  "userId": "peteranteater",
  "timestamp": "2025-04-10T14:32:00Z"
}
```

**Backend function:** `updateLastActive(req, res)`

**Backend function:** `getActivityStatus(userId)`

**Database write (SQL fields):**
users table: user_id, last_active

**Connector — REST response:**
```json
{
  "userId": "peteranteater",
  "lastActive": "Active 5 mins ago"
}
```

---

### ID Verification Workflow

To minimize security risks, the frontend uploads the encrypted ID image directly to a secure, temporary storage bucket via a "Signed URL." The backend forwards the verification request to a third-party service. Once confirmed, the backend updates the user's verification badge and triggers a permanent deletion of the source image from the temporary storage.

**Frontend function:** `uploadVerificationID(imageFile)`

**Connector — REST POST request to `/api/verify-identity`:**
```json
{
  "userId": "peteranteater",
  "uploadConfirmed": true
}
```

**Backend function:** `requestVerification(userId)`

**Backend function:** `handleVerificationResult(userId, result)`

**Database write (SQL fields):**
users table: user_id, is_verified, verified_at

**Connector — REST response:**
```json
{
  "success": true,
  "isVerified": true,
  "message": "Your identity has been verified."
}
```

---


## Prototype Implementation + Reflection
We implemented a basic full-stack prototype of Friendli consisting of a frontend built with HTML and JavaScript and a backend built with Node.js and Express. The current prototype implements two workflows: nearby user retrieval (`GET /nearby-users`) and ping sending (`POST /send-ping`). The backend responds with hardcoded mock data to simulate real functionality. All components currently run locally on a development machine (our laptop), which is sufficient for this stage of the course. The remaining workflows have not yet been implemented in code.

Communication between components is handled using RESTful HTTP requests and JSON. During development we encountered challenges related to browser security restrictions (CORS), which required enabling CORS middleware on the backend. We also faced initial difficulties setting up Git and synchronizing local and remote repositories.

Through this prototype we gained experience with client-server architecture, API communication, and debugging full-stack applications. We developed a better understanding of how frontend and backend systems interact in a real application.

In future iterations, we plan to transition the frontend to React Native for mobile support, integrate a PostgreSQL database with PostGIS for real proximity queries, and add Socket.io for real-time chat and ping notifications. For production deployment, the backend and database will be hosted on AWS.
