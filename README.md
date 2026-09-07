# MealPrep

A modern React Native meal-planning application built with Expo and TypeScript.

MealPrep is designed to help users create personalized meal plans based on their preferences, dietary needs, nutritional goals, and budget.

## ✨ Features

- 🍽️ Personalized meal plan generation
- 💰 Budget-based meal planning
- 🥗 Dietary preference selection
- 🎯 Nutritional goal selection
- 🔄 Meal replacement / swapping
- 📅 Multi-day meal plan navigation
- 🌍 English and Italian localization
- 🎬 Animated introduction experience using Lottie
- 🎨 Custom Promo typography
- 📱 Native navigation with React Navigation
- 🔷 TypeScript for type-safe development
- 💾 Persistent application state with Zustand and AsyncStorage

## 🛠️ Tech Stack

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| React Native     | Mobile application framework   |
| Expo SDK 57      | Development and native tooling |
| TypeScript       | Type-safe development          |
| React Navigation | Native stack navigation        |
| Zustand          | Application state management   |
| AsyncStorage     | Persistent local storage       |
| react-i18next    | Internationalization           |
| Lottie           | Animations                     |
| Promo Fonts      | Custom application typography  |

## 📱 Application Flow

The application guides users through a simple onboarding flow:

```text
Lander
   ↓
Nutritional Goals
   ↓
Dietary Preferences
   ↓
Budget
   ↓
Generate Meal Plan
   ↓
Meal Plan
```

Users can configure their preferences and generate a personalized meal plan.

Once a meal plan has been generated, users can browse their plan by day and swap individual meals when needed.

## 📁 Project Structure

```text
MealPrep/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── animations/
│
├── src/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── state/
│   └── types/
│
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Expo tooling
- Expo Go or an Android/iOS development environment

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd MealPrep
```

Install dependencies:

```bash
npm install
```

### Start the development server

```bash
npx expo start
```

You can then run the application on:

- Android device
- Android Emulator
- iOS device
- iOS Simulator

## 🌍 Internationalization

MealPrep uses `react-i18next` for localization.

Currently supported languages:

- 🇬🇧 English
- 🇮🇹 Italian

The localization structure makes it easy to introduce additional languages in the future.

## 💾 State Management

Application state is managed using **Zustand**.

The application currently separates state into focused stores, including:

- Onboarding preferences
- Meal plan data
- Selected days
- Meal replacements
- Generation state

Persistent state is stored locally using **AsyncStorage** through Zustand's `persist` middleware.

## 🍽️ Meal Plan Generation

Meal plans are generated based on the user's:

- Budget
- Dietary requirements
- Nutritional goals

The generation flow provides feedback through multiple stages before presenting the completed meal plan.

Users can also regenerate or replace individual meals based on their preferences.

## 🧭 Navigation

MealPrep uses **React Navigation's native stack navigator**.

The initial route is determined from the user's onboarding state, allowing the application to automatically resume the appropriate stage of the onboarding or meal-planning flow.

## 🎬 Introduction Experience

MealPrep includes an animated introduction experience powered by **Lottie**.

The splash/introduction flow provides a branded entry point before users begin configuring their meal preferences.

## 🎨 Design & Typography

The application uses custom **Promo fonts** and centralized design constants to maintain a consistent visual identity.

UI components are designed with reusability and responsive mobile layouts in mind.

## 📜 Available Scripts

Start the development server:

```bash
npm start
```

Run on Android:

```bash
npx expo start --android
```

Run on iOS:

```bash
npx expo start --ios
```

Run on web:

```bash
npx expo start --web
```

## 🔧 Development

MealPrep is written entirely in TypeScript and follows a modular React Native architecture.

Development principles include:

- Reusable components
- Centralized navigation
- Typed application state
- Separation of UI and business logic
- Dedicated service layer for API operations
- Centralized localization
- Persistent state where appropriate

## 📦 Building the Application

For local native generation:

```bash
npx expo prebuild
```

For production builds using EAS:

```bash
npx eas build
```

Configure your Expo and EAS project settings before creating production builds.

## 🗺️ Roadmap

- [ ] Expand meal-plan customization
- [ ] Add additional dietary options
- [ ] Improve meal replacement preferences
- [ ] Add meal-plan history
- [ ] Add favorites
- [ ] Expand localization
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Production Android release
- [ ] Production iOS release

## 🤝 Contributing

Contributions and improvements are welcome.

Before submitting a pull request:

1. Create a dedicated branch.
2. Keep changes focused and maintainable.
3. Run TypeScript checks.
4. Test the application on the relevant platform.
5. Provide a clear description of your changes.

## 📄 License

This project is currently maintained as a private application.

License information will be added when the project is released publicly.

---

**MealPrep** — personalized meal planning made simple.

Built with ❤️ using React Native, Expo and TypeScript.
