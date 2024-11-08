# RecipeAssistant

RecipeAssistant is a web application that helps users to discover, tailor, and track recipes aligned with their unique dietary requirements and wellness objectives, while also providing intelligent substitutions for ingredients to suit individual needs.

## Features

- Recipe discovery based on dietary preferences
- Intelligent ingredient substitutions
- Meal planning and tracking
- Integration with multiple recipe APIs
- Interactive map for finding local ingredients
- Recipe assistance

## Technologies Used

- Vue.js 3
- Vite
- Tailwind CSS
- Firebase
- Google Maps API
- ChatGPT API
- Spoonacular API
- Edamam API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kelvinpcw/food
   ```

2. Navigate to the frontend directory:
   ```bash
   cd food/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the frontend directory and add your API keys:
   ```
   VITE_GOOGLE_MAPS_API_KEY=''
   VITE_CHAT_GPT_API_KEY=''
   VITE_FIREBASE_API_KEY=''
   VITE_FIREBASE_APP_ID=''
   VITE_FIREBASE_MEASUREMENT_ID=''
   VITE_SPOON_API_KEY=''
   VITE_EDAMAM_API_ID=''
   VITE_EDAMAM_API_KEY=''
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit `http://localhost:5173/` (or the port specified in the console output)

## API Keys Setup

To use all features of RecipeAssistant, you'll need to obtain API keys from:
- [Google Maps Platform](https://cloud.google.com/maps-platform/)
- [OpenAI (ChatGPT)](https://platform.openai.com/)
- [Firebase](https://firebase.google.com/)
- [Spoonacular](https://spoonacular.com/food-api)
- [Edamam](https://developer.edamam.com/)

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── store/
│   ├── services/
│   └── App.vue
├── public/
├── index.html
├── index.html
├── .env
└── vite.config.js
```

