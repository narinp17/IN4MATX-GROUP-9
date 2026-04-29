# Requirements Specification Document

# Friendli
Team Members: Anya Rajesh (anyar2), Narin Park (narinp), Jolene Kwan (kwanjs)
Jett Chanka (jchanka), Steven Liu (stevell1)

# Executive Summary: 

Friendli is a mobile app designed to help college students discover and connect with nearby individuals who share similar interests and hobbies. By optionally enabling real-time location sharing, the app facilitates spontaneous, in-person social interactions within a defined local radius, making it easier for users to form meaningful  connections in their immediate environment.
The primary target audience consists of college students with access to a mobile device with internet/cellular access who are seeking to expand their social circles in a convenient and low-pressure way. The app addresses the challenges of meeting new people in a large or unfamiliar environment by leveraging shared interests and proximity as key drivers of connection. 
The app offers a streamlined and privacy-conscious user experience. Users can create simple text-based profiles highlighting their interests and subscribe to multiple activity tags (e.g., #RUNNING, #CROCHETING, #ROBLOX) to find like-minded people. To encourage organic interactions, the app introduces lightweight engagement features such as “Wave”, allowing users to express interest before initiating full conversations. Additionally, a “Last Active” status provides context on user availability without requiring continuous real-time tracking. 
To maintain simplicity and reduce long-term data storage, the app uses a fixed proximity range (e.g., within 2 miles) and supports temporary group chats that automatically disappear when users leave the defined area. Privacy is further enhanced through features such as location-based blackout zones, enabling users to restrict location sharing in specific places like their home.
Overall, [Name of Software] focuses on enabling safe, spontaneous, and interest-driven connections while prioritizing user privacy, simplicity, and real-world interaction.


# Application Context / Environmental Constraints: 
Where will the app run (physically, in the world)? What type of hardware/platforms? What might the app depend on or interact with?
The program will be run on a mobile app, supported by both Android and iOS devices.
App may require a database for storage when the user creates an account, last known location. etc

# Functional Requirements: 
4a. Features implemented from list options:
Subscribe to multiple interests
Allows the platform to match people nearby who share overlapping interests, making it easier to discover, connect, or meet with like-minded individuals in real time
User bio/profile
Simple profile with a short description
No images, no fancy formatting, just a text field
Fixed range for everyone
Choosing a fixed range (e.g., all users see others within 2 miles)
Transitory group formation/chat
If a user leaves the 2-mile radius, the chat simply disappears. This saves us from having to manage long-term database storage for messages.
Location-based black-outs
Allows a user to choose to not share their location when they are at a specific spot (like home).
Own features:
"Ping" or "Wave" Interaction
Instead of jumping straight into a full chat, a user can send a "Ping" to someone nearby to show interest in meeting.
“Last Active” Status
Show when a user was last active (e.g., “Active 5 mins ago”)
Just store a timestamp and display it, no real-time tracking needed
Makes the app feel more alive without complexity
ID verification
Users can verify their identity by uploading a government issued photo ID
Will display a verification badge so people know that their identity is trustworthy (similar to LinkedIn verification badge)


# Functional Requirements Analyses

User bio/profile
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
- Fixed range for everyone

Fixed range for everyone
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

Location-based blackouts
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

Transitory group formation/chat
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

Last active status
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

Ping/Wave
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

ID Verification
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




