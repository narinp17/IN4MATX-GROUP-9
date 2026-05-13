# Architecture

## Overall Architecture Summary

Friendli follows a client-server architecture designed for mobile devices. The system consists of a mobile frontend application, a backend API server, a database, and external services such as push notifications and ID verification. These components communicate through RESTful APIs using JSON over HTTPs.

The frontend application runs on Android and iOS devices. It is responsible for displaying nearby users, managing profiles, sending pings, handling temporary chats, and managing privacy settings such as blackout zones. Our current prototype frontend was built using HTML and JavaScript, but future versions will likely use React Native for better scalability and mobile support.

The backend server is built with Node.js and Express and would run on a cloud platform such as AWS. The backend handles authentication, user matching, chat session management, ping rate limiting, location filtering, and communication with third-party verification services. It also processes nearby-user requests by checking proximity and shared interests.

The database stores user accounts, bios, interest tags, blackoutzones, last active timestamps, and temporary chat metadata. Sensitive data is minimized whenever possible. For example, uploaded ID images are deleted immediately after verification, and temporary chats are not permanently stored.

Friendli mainly uses a client-server design style because it separates frontend and backend responsibilities, making the system easier to maintain and scale. The system also uses a layered architecture, separating the user interface, application logic, and database layers. RESTful API communication allows lightweight and standardized communication between system components.


## Platforms
Possible Platforms -  
  Frontend: React Native  
  Backend: GraphQL  
  Database: PostgreSQL (User Info), Redis (Location & Chat Cache)  

## Progamming Languages

## Communication Protocols
- The system will use REST APIs over HTTP/HTTPS for operations such as user authentication, profile updates, location updates, retrieving nearby users, and sending ping requests.
- WebSockets will be used to support real-time bidirectional communication between clients and the server. This includes chat messaging, ping acceptances, and live status updates.
- SQL queries will be used to interact with the PostgreSQL database for persistent data storage and retrieval, including user profiles, interests, location data, and chat session metadata.

## Examples of Component Functions and Connector Communications

# User Bio/Profile Workflow

When a user creates or edits a profile, the frontend sends the user's display name, bio text, and selected interests to the backend API. The backend validates the bio length and checks for inappropriate content before storing the data in the database. Once saved, the backend returns a success response and the frontend updates the user profile display.

# Nearby User Matching

When a user opens the app, the frontend retrieves the user's GPS location and sends it to the backend through an API request. The backend checks the database for users within the 2-mile radius who share at least one interest and are not hidden by blackout zones. The backend then returns nearby user data in JSON format, including usernames, bios, interests, and last active timestamps, which the frontend displays to the user.

# Ping/Wave Workflow

When a user taps the "Ping" button, the frontend sends a request containing the sender ID and recipient ID to the backend. The backend validates the request, checks rate limits, and sends a notification to the recipient. If the recipient accepts the ping, the backend creates a temporary chat session and notifies both users.

# Blackout Zone Workflow

Users can create blackout zones through the frontend by selecting areas on a map. The blackout zone coordinates are stored in the database. When the system detects the user inside one of those zones, the backend hides the user from nearby match results until they leave the area.

# Fixed Range Workflow

When the app detects a location update, the frontend sends updated GPS coordinates to the backend. The backend recalculates nearby matches by filtering users within the fixed 2-mile radius and returns refreshed match results in JSON format. The frontend then updates the nearby users list automatically.

# Transitory Chat Workflow

After two users accept each other's pings, the backend creates a temporary chat session and stores session metadata in the database. Messages sent between users are transmitted through API requests and displayed in real time on the frontend. If either user leaves the allowed radius, the backend would delete the session and notify both users that their chat has ended.

# Last Active Status Workflow

Whenever a user performs an action in the app, a frontend sends an activity update request to the backend. The backend records the latest timestamp in the database. When another user views that profile, the backend returns the relative activity status data (such as "Active 5 mins ago"), which the frontend displays.

# ID Verification Workflow

When a user uploads an ID for verification, the frontend securely sends the encrypted image to the backend. The backend forwards the image to a third-party verification service. After verification is complete, the backend updates the user's verification badge status and deletes the uploaded ID image.


## Prototype Implementation + Reflection
We implemented a basic full-stack prototype of Friendli consisting of a frontend built with HTML/JavaScript and a backend built with Node.js and Express. The frontend sends an HTTP request to a /nearby-users API endpoint, and the backend responds with mock user data in JSON format, which is then displayed on the frontend.

Communication between components is handled using RESTful HTTP requests and JSON. During development, we encountered challenges related to browser security restrictions (CORS), which required enabling CORS middleware on the backend. We also faced initial difficulties setting up Git and synchronizing local and remote repositories.

Through this prototype, we gained experience with client-server architecture, API communication, and debugging full-stack applications. We also developed a better understanding of how frontend and backend systems interact in a real-world application.

In future iterations, we plan to transition the frontend into a React-based implementation to improve scalability and component structure. We also aim to eventually develop a mobile-first version of Friendli using React Native to better support real-time, location-based social interactions.
