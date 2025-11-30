# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


RESEARCH


What is the difference between Native and Cross-Platform Mobile applications?

Native apps are built for a specific platform in mind (iOS, Android). They use platform-specific languages, resulting in optimal performance and user experience but requiring separate devdelopment for each plaform. Corss-platform apps, use one single codebade for multiple platforms, but may have performance limitations. Cross-platforms apps are fasther and more cost effective which may be interesting for people with a smaller dev budget.


What is the difference between React Native and React?

React is a platform that runs in web browsers which the primary goal being to create user interfaces (UIs) for web apps. It can use HTML, CSS, and JavaScript to render its UI elements, often times it will use CSS for styling and animations. On the other hand, React native is primarily used for developing corss-platform native mobile appliocations for both iOS and Android, these apps run off of mobile devices but can also target the web. 

API descriptions

Account details Screen 
-      `http://localhost:8080/api/account/${userID}?type=${accountType}`,
         Trying to fetch the correct account using ID and account type to display information about the Account

Account Selection Screen
- NO APIs USED

Courier Delivery Screen
-     http://localhost:8080/api/orders - Fetching all orders for deliveries
      http://localhost:8080/api/orders/${order.id}/status - posting updates about progress order

Login Screen
- http://localhost:8080/api/auth - logging in

Menu Screen 
- http://localhost:8080/api/products?restaurant=${restaurant.id} - fetching all products from restaurants and organizing them by restaurant
- http://localhost:8080/api/account/${userID} - fetching user information because of the modal requirements (user phone and email)

Order Confirmation Screen
- http://localhost:8080/api/orders - posting order


order History Scrren
- http://localhost:8080/api/orders - fetching orders


Restaurant list screen
- http://localhost:8080/api/restaurants - fetching restaurants











