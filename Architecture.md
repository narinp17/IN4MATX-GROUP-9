# Architecture

## Overall Architecture Summary

Friendli follows a client-server architecture designed for mobile devices. The system consists of a mobile frontend application, a backend API server, a database, and external services such as push notifications and ID verification. These components communicate through RESTful APIs using JSON over HTTPS, supplemented by WebSockets for real-time events.

The frontend application runs on Android and iOS devices. It is responsible for displaying nearby users, managing profiles, sending pings, handling temporary chats, and managing privacy settings such as blackout zones. Our current prototype frontend was built using HTML and JavaScript, but future versions will likely use React Native for better scalability and mobile support. To ensure a smooth user experience, the frontend implements "Graceful Degradation," displaying cached data (like the last known match list) if the internet connection is temporarily lost.

The backend server is built with Node.js and Express and would run on a cloud platform such as AWS. The backend handles authentication, user matching, chat session management, ping rate limiting, location filtering, and communication with third-party verification services. It also processes nearby-user requests by checking proximity and shared interests. To handle location-based queries efficiently, the backend utilizes PostGIS (a spatial database extender) to perform high-speed proximity calculations directly within the database layer.

The database stores user accounts, bios, interest tags, blackout zones, last active timestamps, and temporary chat metadata. Sensitive data is minimized whenever possible. For example, uploaded ID images are deleted immediately after verification, and temporary chats are not permanently stored.

Friendli mainly uses a client-server design style because it separates frontend and backend responsibilities, making the system easier to maintain and scale. The system also uses a layered architecture, separating the user interface, application logic, and database layers. RESTful API communication allows lightweight and standardized communication between system components.

For the purposes of this course, all components — the frontend, backend, and database — run locally on a development machine. In a future production deployment, the backend and database would be hosted on AWS.


## Platforms
Possible Platforms -  
  Frontend: React Native  
  Backend: Node.js with Express (and Socket.io for WebSockets)  
  Database: PostgreSQL (User Info), Redis (Location & Chat Cache)  
#### Tradeoff Analysis
React Native: 
We chose React Native because it lets us build one app that works on both iOS and Android, which saves time for a small team. The tradeoff is that it can be harder to debug than building separately for each platform.  
Node.js with Express:



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

### Nearby User Matching

When a user opens the app, the frontend retrieves the user's GPS location and sends it to the backend. The backend uses spatial indexing to qury the database for users within the 2-mile radius who share at least one interest. The backend then returns nearby user data in JSON format, which the frontend displays. To protect user privacy and prevent "triangulation," the backend may return "fuzzy" proximity labels (e.g., "within 0.5 miles") rather than exact GPS coordinates.

### Ping/Wave Workflow

When a user taps the "Ping" button, the frontend sends a request containing the sender ID and recipient ID to the backend. The backend validates the request, checks rate limits, and sends a notification to the recipient. If the recipient accepts the ping, the backend creates a temporary chat session and notifies both users.

### Blackout Zone Workflow

Users can create blackout zones through the frontend by selecting areas on a map. These coordinates are stored in the database. When a location update is received, the backend checks the user's position against their stored blackout zones. If a match is found, the system server-side flags the user as "Hidden," ensuring their data is excluded from all discovery queries until they exit the zone.

### Fixed Range Workflow

When the app detects a location update, the frontend sends updated GPS coordinates to the backend. The backend recalculates nearby matches by filtering users within the fixed 2-mile radius and returns refreshed match results in JSON format. The frontend then updates the nearby users list automatically.

### Transitory Chat Workflow

After two users accept each other's pings, the backend creates a temporary chat session. Messages are transmitted via WebSockets for sub-second latency. If either user leave the 2-mile radius, the backend deletes the session. To prevent the chat from closing due to minor GPS signal "jitter," the system implements a grace period, waiting 60 seconds before permanently deleing a session when a user appears to leave the radius.

### Last Active Status Workflow

Whenever a user performs an action in the app, a frontend sends an activity update request to the backend. The backend records the latest timestamp in the database. When another user views that profile, the backend returns the relative activity status data (such as "Active 5 mins ago"), which the frontend displays.

### ID Verification Workflow

To minimize security risks, the frontend uploads the encrypted ID image directly to a secure, temporary storage bucket via a "Signed URL." The backend forwards the verification request to a third-party service. Once confirmed, the backend updates the user's verification badge and triggers a permanent deletion of the source image from the temporary storage.


## Prototype Implementation + Reflection
We implemented a basic full-stack prototype of Friendli consisting of a frontend built with HTML/JavaScript and a backend built with Node.js and Express. The frontend sends an HTTP request to a /nearby-users API endpoint, and the backend responds with mock user data in JSON format, which is then displayed on the frontend.

Communication between components is handled using RESTful HTTP requests and JSON. During development, we encountered challenges related to browser security restrictions (CORS), which required enabling CORS middleware on the backend. We also faced initial difficulties setting up Git and synchronizing local and remote repositories.

Through this prototype, we gained experience with client-server architecture, API communication, and debugging full-stack applications. We also developed a better understanding of how frontend and backend systems interact in a real-world application.

In future iterations, we plan to transition the frontend into a React-based implementation to improve scalability and component structure. We also aim to eventually develop a mobile-first version of Friendli using React Native to better support real-time, location-based social interactions.
