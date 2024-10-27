<template>
  <div class="interactive-globe">
    <div ref="globeContainer" class="globe-container"></div>
    <div class="info-sidebar">
      <div class="info-card">
        <h2>Cuisine Information</h2>
        <div v-if="lastHoveredInfo">
          <h3>{{ lastHoveredInfo.label }}</h3>
          <p>Cuisine: {{ lastHoveredInfo.cuisine }}</p>
          <div v-if="lastHoveredInfo.popularDish">
            <div v-if="lastHoveredInfo.popularDish.loading">
              <p>Loading popular dish information...</p>
            </div>
            <div v-else-if="lastHoveredInfo.popularDish.error">
              <p>Error fetching popular dish information. Please try again.</p>
            </div>
            <div v-else>
              <h4>Popular Dish: {{ lastHoveredInfo.popularDish.name }}</h4>
              <h5>Key Ingredients:</h5>
              <ul>
                <li v-for="ingredient in lastHoveredInfo.popularDish.ingredients" :key="ingredient">
                  {{ ingredient }}
                </li>
              </ul>
              <h5>Cultural Note:</h5>
              <p>{{ lastHoveredInfo.popularDish.culturalNote }}</p>
            </div>
          </div>
        </div>
        <p v-else>Click on the globe to select a country and view its cuisine information</p>
      </div>
    </div>
  </div>
</template>

<script>
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GPT_API_KEY = import.meta.env.VITE_CHAT_GPT_API_KEY;
import { ref, onMounted, onUnmounted } from "vue";
import Globe from "globe.gl";
import axios from "axios";

export default {
  name: "InteractiveGlobe",
  setup() {
    const globeContainer = ref(null);
    const globe = ref(null);
    const places = ref([]);
    const hoverInfo = ref(null);
    const lastHoveredInfo = ref(null);
    let resizeObserver = null;

    function parseCuisineResponse(content) {
      const lines = content.split("\n").map((line) => line.trim());
      let name = "";
      let ingredients = [];
      let culturalNote = "";
      let currentSection = "";

      for (const line of lines) {
        if (line.startsWith("Dish Name:")) {
          name = line.split(":")[1].trim();
        } else if (line.startsWith("Key Ingredients:")) {
          currentSection = "ingredients";
        } else if (line.startsWith("Cultural Note:")) {
          currentSection = "culturalNote";
          culturalNote = line.split(":")[1].trim();
        } else if (line.startsWith("-") && currentSection === "ingredients") {
          ingredients.push(line.substring(1).trim());
        } else if (currentSection === "culturalNote") {
          culturalNote += " " + line;
        }
      }

      return { name, ingredients, culturalNote: culturalNote.trim() };
    }

    const getCountry = async (lat, lng) => {
      console.log(lat, lng);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;
      try {
        const response = await axios.get(url);
        console.log(response.data);
        const country = response.data.results.find((result) =>
          result.types.includes("country")
        );
        return country ? country.formatted_address : "Unknown";
      } catch (error) {
        console.error(error);
        return "Error fetching country";
      }
    };

    const handleGlobeClick = async (event) => {
      if (!globe.value) return;

      console.log("Click event:", event);

      const { lat, lng } = event;
      console.log({ lat, lng });

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", { lat, lng });
        return;
      }

      const newPlace = {
        lat,
        lng,
        label: `Location at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
        color: "red",
        cuisine: "Loading...",
        popularDish: { loading: true },
      };
      places.value.push(newPlace);
      updateGlobe();

      try {
        const country = await getCountry(lat, lng);
        newPlace.label = country;
        newPlace.cuisine = `Cuisine of ${country}`;
        updateGlobe();
        if (country != "Unknown") {
          getPopularDishes(country);
        }
      } catch (error) {
        console.error("Error fetching country:", error);
        newPlace.cuisine = "Error fetching cuisine";
        newPlace.popularDish = { loading: false, error: true };
      }
    };

    const getPopularDishes = async (country) => {
      console.log(`Getting popular dishes for ${country}`);
      const place = places.value.find((p) => p.label === country);
      if (place) {
        place.popularDish = { loading: true };
        updateGlobe();
      }

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `Provide information about a popular dish from ${country} in the following format:
        Dish Name: [Name of the dish]
        Key Ingredients:
        - [Ingredient 1]
        - [Ingredient 2]
        - [Ingredient 3]
        ...
        Cultural Note: [Brief cultural note about the dish]`,
              },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${GPT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const content = response.data.choices[0].message.content;
        console.log(content);

        const parsedDish = parseCuisineResponse(content);

        if (place) {
          place.popularDish = { ...parsedDish, loading: false };
          updateGlobe();
        }
      } catch (error) {
        console.error("Error fetching popular dishes:", error);
        if (place) {
          place.popularDish = { loading: false, error: true };
          updateGlobe();
        }
      }
    };

    const updateGlobe = () => {
      if (globe.value) {
        globe.value.labelsData(places.value);
      }
    };

    onMounted(() => {
      if (globeContainer.value) {
        globe.value = Globe()
          .globeImageUrl(
            "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          )
          .backgroundImageUrl(
            "//unpkg.com/three-globe/example/img/night-sky.png"
          )
          .labelLat((d) => d.lat)
          .labelLng((d) => d.lng)
          .labelText((d) => d.label)
          .labelSize(0.5)
          .labelColor(() => "white")
          .labelDotRadius(0.3)
          .labelAltitude(0.01)
          .onGlobeClick(handleGlobeClick)
          .onLabelHover((label) => {
            hoverInfo.value = label;
            if (label) {
              lastHoveredInfo.value = label;
            }
          });

        globe.value(globeContainer.value);

        resizeObserver = new ResizeObserver(() => {
          globe.value.width(globeContainer.value.clientWidth);
          globe.value.height(globeContainer.value.clientHeight);
        });
        resizeObserver.observe(globeContainer.value);

        const handleResize = () => {
          if (globe.value) {
            globe.value.width(globeContainer.value.clientWidth);
            globe.value.height(globeContainer.value.clientHeight);
          }
        };

        window.addEventListener("resize", handleResize);
        
        // Store cleanup function
        onUnmounted(() => {
          // Remove resize observer
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
          
          // Remove event listener
          window.removeEventListener("resize", handleResize);
          
          // Clean up Three.js scene
          if (globe.value) {
            // Access the underlying Three.js renderer and scene
            const renderer = globe.value.renderer();
            const scene = globe.value.scene();
            
            // Dispose of Three.js resources
            if (renderer) {
              renderer.dispose();
              renderer.forceContextLoss();
              renderer.domElement.remove();
            }
            
            // Clear any references
            globe.value = null;
          }
        });
      } else {
        console.error("Globe container not found");
      }
    });

    return {
      globeContainer,
      places,
      hoverInfo,
      lastHoveredInfo,
    };
  },
};
</script>

<style scoped>
.interactive-globe {
  display: flex;
  height: 100vh;
}

.globe-container {
  width: 75%;
  height: 100%;
}

.info-sidebar {
  width: 25%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f3f4f6;
}

.info-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
