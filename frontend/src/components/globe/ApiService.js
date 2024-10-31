// src/components/globe/ApiService.js
import axios from "axios";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GPT_API_KEY = import.meta.env.VITE_CHAT_GPT_API_KEY;

export async function getCoordinatesForCountry(countryName) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        countryName
      )}&key=${MAPS_API_KEY}`
    );

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: response.data.results[0].formatted_address,
      };
    }
    throw new Error("Country not found");
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return null;
  }
}

export async function getCountry(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    const country = response.data.results.find((result) =>
      result.types.includes("country")
    );
    return country ? country.formatted_address : "Unknown";
  } catch (error) {
    console.error(error);
    return "Error fetching country";
  }
}

function parseCuisineResponse(content) {
  const lines = content.split("\n").map((line) => line.trim());
  let name = "";
  let servingSize = "";
  let ingredients = [];
  let instructions = [];
  let culturalInfo = "";
  let currentSection = "";

  for (const line of lines) {
    if (line.startsWith("Dish Name:")) {
      name = line.split(":")[1].trim();
    } else if (line.startsWith("Serving Size:")) {
      servingSize = line.split(":")[1].trim();
    } else if (line.startsWith("Ingredients Used:")) {
      currentSection = "ingredients";
    } else if (line.startsWith("Instructions:")) {
      currentSection = "instructions";
    } else if (line.startsWith("Cultural Info:")) {
      culturalInfo = line.split(":")[1].trim();
    } else if (line.startsWith("-") && currentSection === "ingredients") {
      ingredients.push(line.substring(1).trim());
    } else if (line.startsWith("-") && currentSection === "instructions") {
      instructions.push(line.substring(1).trim());
    }
  }

  return { name, servingSize, ingredients, instructions, culturalInfo };
}

export async function getPopularDishes(country, places, updateGlobe, globe, setLoadingState) {
  console.log(`Getting popular dishes for ${country}`);
  setLoadingState(true);
  const place = places.value.find((p) => p.label === country);
  if (place) {
    place.popularDish = { loading: true };
    updateGlobe(globe.value, places.value);
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide information about a popular dish from ${country} in the following format, and do not add markup to the response:
Dish Name: [Name of the dish]
Cultural Info: [Brief cultural info about the dish]
Serving Size: [Serving Quantity Number]
Ingredients Used:
- [Ingredient 1] - [Ingredient Quantity]
- [Ingredient 2] - [Ingredient Quantity]
- [Ingredient 3] - [Ingredient Quantity]
...
Instructions:
- [Instruction 1 including ingredients and equipment]
- [Instruction 2 including ingredients and equipment]
- [Instruction 3 including ingredients and equipment]
...`,
          },
        ],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${GPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const parsedDish = parseCuisineResponse(content);

    if (place) {
      place.popularDish = { ...parsedDish, loading: false };
      updateGlobe(globe.value, places.value);
    }
  } catch (error) {
    console.error("Error fetching popular dishes:", error);
    if (place) {
      place.popularDish = { loading: false, error: true };
      updateGlobe(globe.value, places.value);
    }
  }
}