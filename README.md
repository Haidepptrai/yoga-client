
# Yoga Client Application
## Overview
The Yoga Client Application is a mobile app built with React Native and Firebase. It allows users to browse, join, and manage yoga classes. Users can also update their profiles and view their cart for upcoming classes.


## Features

- User Authentication (Sign Up, Login)
- Browse and Search Yoga Classes, Yoga Courses
- Enroll Yoga Courses, Yoga Classes
- View and Update User Profile
- Add Classes to Cart and Checkout



## Technologies Used

- React Native
- Firebase (Firestore, Authentication)
- Expo
- TypeScript
- React Navigation
- React Hook Form
- Zod (for validation)



## Getting Started

#### Prerequisites
- Node.js (>= 14.x)
- Expo CLI (npm install -g expo-cli)
- Firebase Project

#### Installation
##### 1. Clone the repository:
```bash
git clone https://github.com/your-username/yoga-client.git
cd yoga-client
```

##### 2. Install dependencies:
```bash
npm install
```
##### 3. Set up environment variables:
- Create a .env file in the root directory.
- Copy the contents of .env.example into .env and fill in your Firebase project details.
    ```bash
        EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
        EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
        EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
        EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
        EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
        EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=your-web-client-id
    ```
##### 4. Start the Expo development server:
```bash
npm start
```
##### 5. Use the Expo Go app on your mobile device to scan the QR code and run the application.
### Firebase Configuration
##### 1. Create a Firebase project at Firebase Console.
##### 2. Add an Android app to your Firebase project and download the google-services.json file. Place it in the app directory.
##### 3. Add the Firebase configuration to your .env file as described in the Installation section.

    
## Deployment

To deploy the app, follow the Expo deployment guide: [Deploying to App Stores.](https://docs.expo.dev/distribution/introduction/#get-started)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Acknowledgements
 - [React Native](https://reactnative.dev/)
 - [Firebase](https://firebase.google.com/)
 - [Expo](https://expo.dev/)
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
