# User Interface Mockups and Analysis

## Theme Branding

<img width="704" height="605" alt="image" src="https://github.com/user-attachments/assets/4e4573c3-3c89-4cfc-ba7b-03d1b37b3d69" />

## Onboarding/Login Screen
<img width="220" alt="image" src="https://github.com/user-attachments/assets/646b66e9-5617-4f03-b2ad-d9a17330a2dc" />   <img width="280" height="626" alt="image" src="https://github.com/user-attachments/assets/8e7ba339-be72-45eb-b179-512b6584ede7" />

The Onboarding/Login screen provide users with a simple and welcoming introduction to the Friendli application. These screens allow users to create an account, securely log in, and begin personalizing their experience within the app. Features include user authentication through email and password, account creation for new users, and an intuitive interface designed to make navigation easy for first-time users.

## Profile Screen
<img width="220" alt="Screenshot 2026-05-26 at 8 48 06 PM" src="https://github.com/user-attachments/assets/30915970-8386-4f57-aeaf-13e27be46eed" />

The profile screen provides a comprehensive overview of an individual user's identity within the Friendli application. It is designed to help users quickly evaluate mutual interests and connect with others. Key elements include a prominent profile picture and user name header, a designated "Tags" section displaying personal interests or hashtags, and a detailed "Bio" container for custom text descriptions. Actionable features at the bottom allow users to seamlessly send a friend request or initiate a direct converation.

## Ping/Chat Screen
<img width="220" alt="Screenshot 2026-05-26 at 8 48 15 PM" src="https://github.com/user-attachments/assets/844a7ca2-f882-427f-9ab1-f3d3a016b604" />

The ping/chat screen facilitates real-time, direct communication between users in a clean and intuitive conversation layout. The interface features a top navigation bar highlighting the user's name, profile icon, and shared "Similar Tags" to maintain context of mutual interests. Messages are organized into distinct, color-coded text bubbles separated by timestamps to indicate chronological flow, with an input field and send action button at the bottom for fluid, uninterrupted messaging.

## Map/Location Screen
<img width="220" alt="Screenshot 2026-05-27 at 3 19 20 AM" src="https://github.com/user-attachments/assets/b811cb1f-1983-490f-83a2-6445499a60ad" />

The Map/Location screen displays nearby users within a fixed 2-mile radius who share at least one common interest with the current user. Each user is represented as a pin on the map, which can be tapped to view a brief profile preview and send a ping. Below the map, a scrollable list view provides an alternative way to browse nearby users, showing their display name, shared interest tags, and distance. The screen dynamically refreshes as the user moves to reflect updated matches in real time. 

## Privacy/Settings Screen
<img width="220" alt="Screenshot 2026-05-26 165039" src="https://github.com/user-attachments/assets/248dd3bd-4b92-41e3-a287-0c2fcb70ab9e" />

The Settings tab allows users fast and convenient control over their accounts, privacy, and other application-related settings. The options include editing user profile pictures, adjusting privacy and security settings such as locations services and passwords, managing user account information and emails, setting up application themes, and signing out.

# Heuristic Evaluation

### Visibility of system status
- The application will have loading animations, confirmation alerts, and visual cues on each and every screen to help users know what is happening in real time, whether it is a location update, sending a friend request, or making profile updates.
- For example, when a chat session is automatically closed because a user has left the 2-mile radius, both users receive an explicit notification explaining why the session ended.
### Match system words to the real world
- The app uses familiar and easy to understand terms such as "Friends Nearby", "Interests", and "Profile".
### User control and freedom
- Users can enable or disable location sharing at any time.
- Users can edit profiles, manage privacy settings, and log out whenever they choose.
- Blackout zones give users granular control, allowing them to designate specific locations like home where their presence is never shared.
### Consistency and standards
- Consistent colors, fonts, buttons, and navigation are used throughout the application.
- Similar layouts and interactions help users quickly learn how to use the app.
### Error prevention
- Input validation prevents users from entering incorrect information.
- Confirmation prompts help prevent accidental actions such as accidentally closing a chat session.
- The ping rate limit is a specific example: the system blocks additional pings and displays a message before a user can spam another user.
### Recognition rather than recall
- Clear labels, icons, and navigation menus help users recognize features easily.
- Important options and settings are visible rather than hidden.
### Accelerators
- Quick-access navigation tabs allow users to move efficiently throughout the app.
- Saved login information and autofill features helps speed up common tasks.
- The wave/ping feature acts as an accelerator for initiating contact: one tap expresses interest without requiring users to compose a message.
### Minimalist design
- The interface uses a clean and uncluttered layout.
- Only essential information and actions are displayed on each screen.
### Help users recognize and recover from errors
- Clear error messages explain what went wrong and how to fix it.
- Examples include incorrect passwords, invalid emails, or disabled location permissions.
- For example, after three failed ID verification attempts the system displays a clear message and enforces a 24-hour cooldown rather than leaving the user confused.
### Help and documentation
- The app includes onboarding/login tutorials, FAQs, and support resources.
- Users can access help documentation to better understand app features and troubleshoot issues.
