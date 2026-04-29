# Requirements Specification Document

# Friendli
Team Members:  
Anya Rajesh (anyar2), Narin Park (narinp), Jolene Kwan (kwanjs), Jett Chanka (jchanka), Steven Liu (stevell1)  

## Executive Summary

Friendli is a mobile app designed to help college students discover and connect with nearby individuals who share similar interests and hobbies. By optionally enabling real-time location sharing, the app facilitates spontaneous, in-person social interactions within a defined local radius, making it easier for users to form meaningful  connections in their immediate environment.
The primary target audience consists of college students with access to a mobile device with internet/cellular access who are seeking to expand their social circles in a convenient and low-pressure way. The app addresses the challenges of meeting new people in a large or unfamiliar environment by leveraging shared interests and proximity as key drivers of connection. 
The app offers a streamlined and privacy-conscious user experience. Users can create simple text-based profiles highlighting their interests and subscribe to multiple activity tags (e.g., #RUNNING, #CROCHETING, #ROBLOX) to find like-minded people. To encourage organic interactions, the app introduces lightweight engagement features such as “Wave”, allowing users to express interest before initiating full conversations. Additionally, a “Last Active” status provides context on user availability without requiring continuous real-time tracking. 
To maintain simplicity and reduce long-term data storage, the app uses a fixed proximity range (e.g., within 2 miles) and supports temporary group chats that automatically disappear when users leave the defined area. Privacy is further enhanced through features such as location-based blackout zones, enabling users to restrict location sharing in specific places like their home.
Overall, Friendli focuses on enabling safe, spontaneous, and interest-driven connections while prioritizing user privacy, simplicity, and real-world interaction.


## Application Context / Environmental Constraints

The program will be run on a mobile app, supported by both Android and iOS devices, but should require a stable internet connection (Wi-Fi or ceelular data) for it to be able to give real-time updates to the user (such as location sharing, user discovery, and messaging).
Compatibility should account for a range of device models and versions of phones so that the app is able to run on old and new versions (old meaning moderately older smartphones).
It should be able to run on our devices anywhere in the world, whether that be in a house/building, or out in a park.
App may require a database for storage when the user creates an account, last known location. etc. It will depend on cloud-based backend infrastructure to manage user authentication, profile data, tags, and temp chat sessions. It should also rely on device hardware including GPS/location services, push notification systems, and basic sensors to determine proximity and activity status.

# Functional Requirements

**Core Components**

User Management
- The system shall allow users to create and edit personal profiles.
- The system shall allow users to manage their interests and preferences.
- The system shall allow users to send pings and initiate chats with other users.
- The system shall support identity verification for those who choose to verify.

Interests
- The system shall allow users to select and manage multiple interests (many-to-many relationship).
- The system shall only match users who share at least one similar interest or preference.

Matching System
- The system shall display other users located within a fixed radius (e.g., 2 miles).
- The system shall only match users who are both within range and share at least one interest.
- The system shall exclude users whose locations fall within a defined blackout zone.


User Bio
- The system shall allow users to create a text-only profile subject to a 300-character limit.
- The system shall restrict unsupported formatting and media content, including images.
- The system shall be subject to content moderation to all user-submitted bio text.


Fixed Range
- The system shall apply the same fixed radius uniformly to all users.
- The system shall dynamically refresh matches when a user's location updates.


Transitory Chat
- The system shall create a chat session when two users mutually connect.
- The system shall automatically delete or disable a chat session when either user leaves the defined radius.
- The system shall not retain chat messages after a session ends.


Blackout Zones
- The system shall allow users to designate specific geographic areas as blackout zones.
- The system shall hide a user's location and exclude them from match results while they are within a blackout zone.


Ping/Wave
- The system shall allow users to send a "ping" as a lightweight interaction prior to initiating a chat.
- The system shall only create a chat session if the recipient accepts the ping.
- The system shall enforce rate limiting on pings to prevent spam.


Last Active Status
- The system shall record and store a timestamp of a user's most recent activity.
- The system shall display relative activity status (e.g., “Active 5 mins ago”).


ID Verification
- The system shall allow users to upload a government-issued ID for identity verification.
- The system shall assign a verification badge to users upon successful verification.
- The system shall transmit all uploaded identification data over encrypted channels and process it via a third-party verification service.
- The system shall permanently delete all uploaded identification data immediately after verification is complete.


## Functional Requirements Analyses

**User bio/profile**

Pros: 
- Users can express personality through a short description
- Interest tags (e.g., #pickleball, #running) improve matching accuracy
- Helps users quickly decide who they want to interact with

Cons:
- If a user selects every interest, they can see almost everyone, reducing match quality
- Text-only bios can feel limited and not fully represent a person
- Users might misrepresent themselves

Ethical Concerns:
- Users could include offensive or inappropriate content
- Misleading bios could create trust issues


**Fixed range for everyone**

Pros: 
- Keeps matches relevant and local (more realistic for meeting up)
- Simple to implement and understand (same rule for everyone)
- Reduces overwhelming number of users

Cons:
- Too restrictive in less populated areas
- Users cannot customize their experience
- Might miss good matches slightly outside the range

Ethical Concerns:
- Could unintentionally reveal patterns about where users spend time
- May disadvantage users in rural or low-density areas


**Location-based blackouts**

Pros:
- Protects user privacy (e.g., hiding location at home or work)
- Gives users more control over when they are visible
- Increases trust in the app
  
Cons:
- Requires effort to set up correctly
- Reduces number of potential matches
- Users might forget to enable it
  
Ethical Concerns:
- If not implemented properly, could give a false sense of security
- Incorrect location detection could expose private areas


**Transitory group formation/chat**

Pros:
- Encourages spontaneous, real-time interaction
- No long-term message storage (privacy-friendly)
- Less database/storage overhead

Cons:
- Chats disappear suddenly, which can be frustrating
- No way to reconnect easily after leaving range
- Users may lose meaningful conversations
  
Ethical Concerns:
- Lack of chat history makes moderation harder
- Could allow inappropriate behavior without accountability


**Last active status**

Pros:
- Makes the app feel more active and real
- Helps users decide who is likely to respond
- Simple to implement (just a timestamp)
  
Cons:
- Adds pressure to respond quickly
- Slight privacy concern (others track activity)
- Can be inaccurate if not updated properly
  
Ethical Concerns:
- Enables passive tracking of user behavior
- Could make users uncomfortable if they feel watched


**Ping/Wave**

Pros:
- Low-pressure way to show interest
- Reduces awkwardness of starting a conversation
- Quick and simple interaction
  
Cons:
- Can be ignored easily
- Doesn’t allow meaningful communication
- Could feel repetitive
  
Ethical Concerns:
- Potential for spam (users sending many pings)
- Could be used to annoy or harass others


**ID Verification**

Pros:
- Builds trust between users
- Reduces fake accounts
- Make users feel safer
  
Cons:
- Adds friction to sign-up process
- Some users won't want to share ID
- Requires backend support for verification
  
Ethical Concerns:
- Handling sensitive personal data (security risk)
- Could exclude users without valid ID
- Risk of data breaches

## Use Cases

**Creating user bio/profile**

Basic Flow:
1. User downloads app and taps "sign up".
2. The system prompts the user to enter a display name and a text-only bio (up to 300 characters).
3. User taps "Save Profile."
4. The system validates the bio for content violations and confirms the character limit is met.
5. The system saves the profile and marks it as visible to nearby matched users.

Alternative Flow:
1. User signs up but taps "Skip" when prompted to fill out their bio.
2. The system creates the account with an empty bio and no interests selected.
3. The system marks the profile as incomplete and does not surface it in match results.
4. The user later navigates to "Edit Profile" from the settings menu.
5. The user adds a bio and selects interests, then taps "Save."
6. The system updates the profile and makes it visible in match results.

Exceptional Flow:
1. User types a bio containing flagged language and taps "Save."
2. The system's content moderation detects a violation.
3. The system blocks the save and displays a message: "Your bio contains content that violates our community guidelines. Please revise it."
4. The user's profile is not saved or made visible until the bio is revised and re-submitted successfully.

**Fixed range for everyone**

Basic Flow:
1. User opens the app and grants location permission.
2. The system retrieves the user's current location.
3. The system queries for all active users within a 2-mile radius who share at least one interest.
4. The system displays matched users on a map or list view.
5. The user browses the results and taps a profile to view it.

Alternative Flow:
1. User is browsing matches and then physically moves to a new location.
2. The system detects the location update at the next polling interval.
3. The system re-queries the match pool based on the updated coordinates.
4. The match list refreshes, removing users now outside range and adding newly in-range users.
5. The user sees the updated list without needing to manually refresh.

Exceptional Flow:
1. User opens the app but has location services disabled on their device.
2. The system detects that location permission has not been granted.
3. The system displays a prompt to ask users to enable location services in order to see match results.
4. The match list remains empty until the user enables location access.

**Location-based blackouts**

Basic Flow:
1. User navigates to "Privacy Settings" and taps "Add Blackout Zone."
2. User sets a blackout zone by selecting an area on the map (e.g., home).
3. The user confirms the zone and taps "Save."
4. When the system detects the user has entered that zone, it transitions their profile to hidden state.
5. The user's location is no longer shared and they are removed from all other users' match results.

Alternative Flow:
1. User decides to remove or edit a previously set blackout zone.
2. User navigates to "Privacy Settings," selects the zone, and taps "Delete" or "Edit".
3. The system removes or edits the zone from the user's account.
4. The user's visibility updates accordingly.

Exceptional Flow:
1. User enters their blackout zone, but the device's GPS signal is temporarily unavailable.
2. The system cannot confirm the user's location and fails to trigger the hidden state.
3. The system logs the GPS failure and retries location detection at the next polling interval.
4. The user's profile remains visible during the gap and transitions to hidden once GPS is restored and the location is confirmed.

**Transitory group formation/chat**

Basic Flow:
1. Two users are within the 2-mile radius and have mutually accepted each other's pings.
2. The system automatically creates a transitory chat session between them.
3. Both users receive a push notification that a chat has opened.
4. The users exchange messages in real time within the chat session.
5. Both users remain within range for the duration of the conversation.

Alternative Flow:
1. While chatting, User A moves outside the 2-mile radius of User B.
2. The system detects that the proximity condition is no longer met.
3. The system immediately closes the chat session and permanently deletes all messages.
4. Both users receive a notification: "Your chat session has ended because you are no longer within range."
5. If the users come back within range later, they will receive a notification asking if they would like to reconnect.

Exceptional Flow:
1. User A sends a message, but the message fails to deliver due to a network interruption.
2. The system displays a "Message not sent" indicator next to the failed message.
3. The system prompts the user to retry sending.
4. If the network is not restored within a defined timeout window, the system notifies the user that the connection is unstable and suggests retrying when connectivity improves.

**Last active status**

Basic Flow:
1. User opens the app and the system records a timestamp of the session start.
2. User browses nearby profiles.
3. On each profile card, the system displays a relative activity label derived from that user's last recorded timestamp (e.g., "Active 3 mins ago").
4. The timestamp updates each time the user performs any action in the app.

Alternative Flow:
1. User closes the app without explicitly logging out.
2. The system records the timestamp of the user's last detected activity.
3. When another user views that profile later, the system calculates the time elapsed and displays the appropriate relative label (e.g., "Active 2 hours ago").

Exceptional Flow:
1. A network failure prevents the system from syncing the user's latest timestamp to the backend.
2. The backend retains the last successfully recorded timestamp.
3. Other users see an activity status that is older than the user's actual last activity.
4. Once connectivity is restored, the system syncs the correct timestamp and updates the displayed status.


**Ping/Wave**

Basic Flow:
1. User browses nearby matched users and taps on a profile they are interested in.
2. User taps the "Ping" button on that profile.
3. The system sends a ping notification to the recipient and marks the ping as pending.
4. The recipient receives a push notification and opens the app to view the incoming ping.
5. The recipient taps "Accept," and the system creates a new transitory chat session between both users.
6. Both users are notified that the chat is now open.

Alternative Flow:
1. User sends a ping to another user.
2. The recipient views the ping notification but taps "Ignore."
3. The system dismisses the ping and notifies the sender: "Your ping was ignored."
4. No chat session is created and neither user is shown to the other in a pending state.

Exceptional Flow:
1. User attempts to send a ping but has already reached the rate limit.
2. The system detects that the rate limit has been reached and blocks the action.
3. The system displays a message: "You've reached your ping limit. Try again later."
4. The ping is not sent and the recipient receives no notification.

**ID Verification**

Basic Flow:
1. User navigates to "Account Settings" and taps "Verify My Identity."
2. The system prompts the user to upload a photo of a government-issued ID.
3. The user selects an image from their device and taps "Submit."
4. The system encrypts the image and transmits it to the third-party verification service over a secure channel.
5. The verification service processes the ID and returns a success response.
6. The system assigns a verification badge to the user's profile and notifies them: "Your identity has been verified."
7. The system permanently deletes the uploaded ID image from its servers.

Alternative Flow:
1. User submits their ID and the verification service requires additional processing time.
2. The system displays a message: "Verification is pending. This may take a few minutes."
3. The user exits the verification screen and continues using the app without a badge.
4. Once the verification service returns a success response, the system automatically assigns the badge and sends the user a push notification.

Exceptional Flow:
1. User uploads their ID but the verification service returns a failure response (e.g., image is blurry or ID is unreadable).
2. The system notifies the user: "We were unable to verify your identity. Please upload a clearer image of your ID."
3. The system deletes the failed upload immediately.
4. The user is prompted to retry the process from step 2.
5. If three consecutive attempts fail, the system temporarily disables the verification option and displays: "Please try again after 24 hours."

