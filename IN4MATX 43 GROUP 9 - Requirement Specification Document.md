# REMEMBER TO SUBMIT THIS ON GITHUB NOT CANVAS(Whoever owner of the github is)

# Friendli

**Team Members:** Anya Rajesh (anyar2), Narin Park (narinp), Jolene Kwan (kwanjs)

Jett Chanka (jchanka), Steven Liu (stevell1)

## **Executive Summary**: 

Friendli is a mobile app designed to help college students discover and connect with nearby individuals who share similar interests and hobbies. By optionally enabling real-time location sharing, the app facilitates spontaneous, in-person social interactions within a defined local radius, making it easier for users to form meaningful  connections in their immediate environment.  
The primary target audience consists of college students with access to a mobile device with internet/cellular access who are seeking to expand their social circles in a convenient and low-pressure way. The app addresses the challenges of meeting new people in a large or unfamiliar environment by leveraging shared interests and proximity as key drivers of connection.   
The app offers a streamlined and privacy-conscious user experience. Users can create simple text-based profiles highlighting their interests and subscribe to multiple activity tags (e.g., \#RUNNING, \#CROCHETING, \#ROBLOX) to find like-minded people. To encourage organic interactions, the app introduces lightweight engagement features such as “Wave”, allowing users to express interest before initiating full conversations. Additionally, a “Last Active” status provides context on user availability without requiring continuous real-time tracking.   
To maintain simplicity and reduce long-term data storage, the app uses a fixed proximity range (e.g., within 2 miles) and supports temporary group chats that automatically disappear when users leave the defined area. Privacy is further enhanced through features such as location-based blackout zones, enabling users to restrict location sharing in specific places like their home.  
Overall, Friendli focuses on enabling safe, spontaneous, and interest-driven connections while prioritizing user privacy, simplicity, and real-world interaction.

## **Application Context / Environmental Constraints**: 

## *Where will the app run (physically, in the world)? What type of hardware/platforms? What might the app depend on or interact with?*

* The program will be run on a mobile app, supported by both Android and iOS devices.  
* App may require a database for storage when the user creates an account, last known location. etc

## **Functional Requirements**: 

**4a. Features implemented from list options:**

1. Subscribe to multiple interests  
1. Allows the platform to match people nearby who share overlapping interests, making it easier to discover, connect, or meet with like-minded individuals in real time  
2. User bio/profile  
   1. Simple profile with a short description  
   2. No images, no fancy formatting, just a text field  
3. Fixed range for everyone  
   1. Choosing a fixed range (e.g., all users see others within 2 miles)  
4. Transitory group formation/chat  
   1. If a user leaves the 2-mile radius, the chat simply disappears. This saves us from having to manage long-term database storage for messages.  
5. Location-based black-outs  
   1. Allows a user to choose to not share their location when they are at a specific spot (like home).

**Own features:**

1. "Ping" or "Wave" Interaction  
   1. Instead of jumping straight into a full chat, a user can send a "Ping" to someone nearby to show interest in meeting.  
2. “Last Active” Status  
   1. Show when a user was last active (e.g., “Active 5 mins ago”)  
   2. Just store a timestamp and display it, no real-time tracking needed  
   3. Makes the app feel more alive without complexity  
3. ID verification  
   1. Users can verify their identity by uploading a government issued photo ID  
      1. Will display a verification badge so people know that their identity is trustworthy (similar to LinkedIn verification badge)

## **Functional Requirements Analyses**

### User bio/profile:

Pros: 

* Users can express personality through a short description  
* Interest tags (e.g., \#pickleball, \#running) improve matching accuracy  
* Helps users quickly decide who they want to interact with

Cons:

* If a user selects every interest, they can see almost everyone, reducing match quality  
* Text-only bios can feel limited and not fully represent a person  
* Users might misrepresent themselves

Ethical Concerns:

* Users could include offensive or inappropriate content  
* Misleading bios could create trust issues

### Fixed range for everyone

Pros: 

* Keeps matches relevant and local (more realistic for meeting up)  
* Simple to implement and understand (same rule for everyone)  
* Reduces overwhelming number of users

Cons:

* Too restrictive in less populated areas  
* People might complain about range being too little or too small

**Transitory group formation/chat:**

Pros:

* We don’t have to store data  
* Makes it easy for user to focus on nearby people


	Cons:

* What happens if person is on edge of radius  
* Potentially miss people because they are just outside of radius

**Location-based blackouts:**

Pros: 

* Allows for privacy  
* User has full control of this 

	Cons:

* People might abuse this and hide from others on purpose

**Last active status:**

Pros:

* One can see how active others are

	Cons:

* People might judge someone based on how active they are 

**3b. Use Cases:** 

For each of these features, provide at least one Basic Flow, Alternative Flow, and Exceptional Flow that demonstrates an interaction with the app to achieve a user goal.

1\. Creating user bio/profile

* Basic Flow  
  * User creates an account for the first time and everything goes smoothly  
* Alternative Flow:  
  * User attempts to create account but fails at a verification step so they need to do 2fa, but still works  
* Exceptional Flow:  
  * User fails to create account

Fixed range for everyone:

* Basic Flow:  
  * One is able to see everyone within the radius of the range  
* Alternative Flow:  
  * User can’t see everyone in the radius, but after walking for a bit they are able to see people  
* Exceptional Flow:  
  * User can’t see people in the radius no matter where they go, even if someone is right next to them

Location based black outs:

* Basic Flow:  
  * User is able to blackout at one of their choices  
* Alternative Flow:  
  * User can’t blackout at a certain spot, but after some configurations they fix it  
* Exceptional Flow:  
  * User can’t blackout at any of their choices

Transitory group formation/chat:

* Basic Flow:  
  * Chat disappears after someone leaves a 2 mile radius  
* Alternative Flow:  
  * Chat disappears after someone leaves a 2 mile radius, after some delay  
* Exceptional Flow:  
  * Chat doesn’t disappear after someone leaves a 2 mile radius

Last active status:

* Basic Flow:  
  * User can see last active status  
* Alternative Flow:  
  * User can’t see last active status, but after some settings configs they are able to fix it  
* Exceptional Flow:  
  * User can’t see last active status no matter what they do

