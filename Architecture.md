# Architecture

## Overall Architecture Summary

Friendli follows a client-server architecture designed for mobile devices. The system consists of a mobile frontend application, a backend API server, a database, and external services such as push notifications and ID verification. These components communicate through RESTful APIs using JSON over HTTPS, supplemented by WebSockets for real-time events such as live chat and pings.

The mobile frontend runs on Android and iOS devices. It is responsible for displaying nearby users, managing profiles, sending pings, handling temporary chats, and managing privacy settings such as blackout zones. Our current prototype frontend was built using HTML and JavaScript, but future versions will likely use React Native for better scalability and mobile support. To ensure a smooth user experience, the frontend implements "Graceful Degradation," displaying cached data (like the last known match list) if the internet connection is temporarily lost.

The backend server is built with Node.js and Express and would run on a cloud platform such as AWS. The backend handles authentication, user matching, chat session management, ping rate limiting, location filtering, and communication with third-party verification services. It also processes nearby-user requests by checking proximity and shared interests. To handle location-based queries efficiently, the backend utilizes PostGIS, a spatial database extender for PostgreSQL, to perform high-speed proximity calculations directly within the database layer.

The database stores user accounts, bios, interest tags, blackout zones, last active timestamps, and temporary chat metadata. Sensitive data is minimized whenever possible. For example, uploaded ID images are deleted immediately after verification, and temporary chats are not permanently stored.

Friendli mainly uses a client-server design style because it separates frontend and backend responsibilities, making the system easier to maintain and scale. The system also uses a layered architecture, separating the user interface, application logic, and database into distinctlayers. RESTful API communication allows lightweight and standardized interaction between system components.

For the purposes of this course, all components (the frontend, backend, and database) will run locally on a development machine. In a future production deployment, the backend and database would be hosted on AWS.


## Platforms
  Mobile Frontend: React Native    
  Backend: Node.js with Express (and Socket.io for WebSockets)  
  Database: PostgreSQL (User Info), Redis (Location & Chat Cache)  


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

## Progamming Languages

- **JavaScript** will be used for both frontend and backend development. The frontend prototype was implemented using HTML, CSS, and JavaScript, while the backend server uses Node.js and Express for handling API requests, authentication, matching logic, and chat session management.
- **HTML/CSS** are used for structuring and styling the current frontend prototype interface.
- **SQL** wlil be used for interacting with the PostgreSQL database, including storing and retrieving user profiles, interests, blackout zones, timestamps, and temporary chat metadata.
- In future iterations, **TypeScript** may be introduced alongside **React Native** to improve code, maintainability, scalability, and type safety for the mobile application.


## Communication Protocols
- The system will use REST APIs over HTTP/HTTPS for operations such as user authentication, profile updates, location updates, retrieving nearby users, and sending ping requests.
- WebSockets will be used for real-time, bidirectional communication, including instant chat messaging, ping notifications, and live "radius exit" alerts to ensure users don't have to manually refresh to see new interactions
- SQL and Spqtial Queries (PostGID) will be used to intereact with the PostgreSQL database, allowing the system to quickly filter users within the 2-mile radius without manual coordinate math on the server.

## Examples of Component Functions and Connector Communications

### User Bio/Profile Workflow

When a user creates or edits a profile, the frontend sends the user's display name, bio text, and selected interests to the backend API. The backend validates the bio length and checks for inappropriate content before storing the data in the database. Once saved, the backend returns a success response and the frontend updates the user profile display.

**Frontend function:** `submitProfile()`

**Connector — REST POST request to `/api/profile`:**
```json
{
  "userId": "abc123",
  "displayName": "Jordan",
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

When a user opens the app, the frontend retrieves the user's GPS location and sends it to the backend. The backend uses spatial indexing to qury the database for users within the 2-mile radius who share at least one interest. The backend then returns nearby user data in JSON format, which the frontend displays. To protect user privacy and prevent "triangulation," the backend may return "fuzzy" proximity labels (e.g., "within 0.5 miles") rather than exact GPS coordinates.
**Frontend function:** `getNearbyUsers()`

**Connector — REST GET request to `/api/nearby-users`:**
```json
{
  "userId": "abc123",
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
    { "id": 1, "name": "Alex", "interests": ["running", "music"], "distance": 1.2 },
    { "id": 2, "name": "Jamie", "interests": ["gaming", "art"], "distance": 0.7 }
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
  "from": "abc123",
  "to": "xyz789"
}
```

**Backend function:** `handlePing(req, res)`

**Database write (SQL fields):**
pings table: ping_id, sender_id, recipient_id, status, created_at

**Connector — REST response:**
```json
{
  "message": "Ping sent from abc123 to xyz789"
}
```

---

### Blackout Zone Workflow

Users can create blackout zones through the frontend by selecting areas on a map. These coordinates are stored in the database. When a location update is received, the backend checks the user's position against their stored blackout zones. If a match is found, the system server-side flags the user as "Hidden," ensuring their data is excluded from all discovery queries until they exit the zone.

**Frontend function:** `saveBlackoutZone()`

**Connector — REST POST request to `/api/blackout-zone`:**
```json
{
  "userId": "abc123",
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
  "userId": "abc123",
  "latitude": 33.6412,
  "longitude": -117.8450
}
```

**Backend function:** `refreshNearbyMatches(req, res)`

**Connector — REST response:**
```json
{
  "users": [
    { "id": 1, "name": "Alex", "interests": ["running", "music"], "distance": 0.9 },
    { "id": 3, "name": "Riley", "interests": ["music", "art"], "distance": 1.5 }
  ]
}
```

---


### Transitory Chat Workflow

After two users accept each other's pings, the backend creates a temporary chat session. Messages are transmitted via WebSockets for sub-second latency. If either user leave the 2-mile radius, the backend deletes the session. To prevent the chat from closing due to minor GPS signal "jitter," the system implements a grace period, waiting 60 seconds before permanently deleing a session when a user appears to leave the radius.

**Frontend function:** `openChatSession(userId, matchedUserId)`

**Connector — WebSocket message (on session open):**
```json
{
  "event": "chat_opened",
  "sessionId": "session_001",
  "participants": ["abc123", "xyz789"]
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

Whenever a user performs an action in the app, a frontend sends an activity update request to the backend. The backend records the latest timestamp in the database. When another user views that profile, the backend returns the relative activity status data (such as "Active 5 mins ago"), which the frontend displays.

**Frontend function:** `sendActivityUpdate()`

**Connector — REST POST request to `/api/activity`:**
```json
{
  "userId": "abc123",
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
  "userId": "abc123",
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
  "userId": "abc123",
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
We implemented a basic full-stack prototype of Friendli consisting of a frontend built with HTML/JavaScript and a backend built with Node.js and Express. The frontend sends an HTTP request to a /nearby-users API endpoint, and the backend responds with mock user data in JSON format, which is then displayed on the frontend.

Communication between components is handled using RESTful HTTP requests and JSON. During development, we encountered challenges related to browser security restrictions (CORS), which required enabling CORS middleware on the backend. We also faced initial difficulties setting up Git and synchronizing local and remote repositories.

Through this prototype, we gained experience with client-server architecture, API communication, and debugging full-stack applications. We also developed a better understanding of how frontend and backend systems interact in a real-world application.

In future iterations, we plan to transition the frontend into a React-based implementation to improve scalability and component structure. We also aim to eventually develop a mobile-first version of Friendli using React Native to better support real-time, location-based social interactions.
