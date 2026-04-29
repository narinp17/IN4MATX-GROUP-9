# Requirements Specification Document

# Friendli
Team Members: Anya Rajesh (anyar2), Narin Park (narinp), Jolene Kwan (kwanjs)
Jett Chanka (jchanka), Steven Liu (stevell1)

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

System Requirements
- Match users based on proximity + shared interests
- Enforce fixed radius for all users
- Support temporary chats and lightweight interactions
- Provide privacy controls (blackouts)
- Secure sensitive data (ID verification)


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
- User signs up
- User enters bio and selects interests
- User saves profile -> profile becomes visible

Alternative Flow:
- User skips bio initially
- Later edits profile to add interests and description

Exceptional Flow:
- User enters inappropriate content -> system blocks or flags it
- User fails to save due to network error


**Fixed range for everyone**

Basic Flow:
- User opens app
- System shows users within 2-mile radius

Alternative Flow:
- User changes location (moves physically)
- App refreshes and shows new nearby users

Exceptional Flow:
- Location permission denied -> system prompts user to enable it
- GPS unavailable -> no matches shown


**Location-based blackouts**

Basic Flow:
- User sets a blackout zone (e.g., home)
- App hides their location when in that area

Alternative Flow:
- User edits or removes blackout zone
- Visibility updates accordingly

Exceptional Flow:
- GPS error -> blackout not triggered correctly
- System fails to save blackout zone


**Transitory group formation/chat**

Basic Flow:
- Two users are matched nearby
- Chat is automatically created
- Users exchange messages

Alternative Flow:
- One user leaves range -> chat disappears
- Users reconnect later if they meet again

Exceptional Flow:
- Message fails to send due to network issue
- Chat closes unexpectedly due to local glitch


**Last active status**

Basic Flow:
- Users opens app -> timestamp updates
- Other users see "Active X minutes ago"

Alternative Flow:
- User becomes inactive -> timestamp reflects last session

Exceptional Flow:
- Timestamp fails to update -> shows incorrect activity
- System crash -> activity not recorded


**Ping/Wave**

Basic Flow:
- User taps "Ping" on another user
- Receiver accepts -> chat opens

Alternative Flow:
- Receiver ignores -> no interaction happens

Exceptional Flow:
- User sends too many pings -> system rate-limits or blocks
- Ping fails due to connectivity issue


**ID Verification**

Basic Flow:
- User uploads ID
- System verifies -> badge appears on profile

Alternative Flow:
- Verification pending -> user continues without badge

Exceptional Flow:
- Verification fails -> user asked to retry
- Upload error -> process restarts

