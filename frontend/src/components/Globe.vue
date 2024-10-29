<template>
  <div class="interactive-globe">
    <div ref="globeContainer" class="globe-container"></div>
    <div class="info-sidebar bg-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-4">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Discover Global Recipes!</h2>
      <div class="search-container flex items-center">
        <input
          type="text"
          placeholder="Revisit Country"
          class="border rounded px-2 py-1 text-gray-700"
        />
        <button class="bg-purple-600 text-white font-bold ml-2 py-1 px-2 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 max-w-xs">
            Search
        </button>
      </div>
      <div class="info-card">

        <div v-if="isLoading">
          <ScaleLoader />          
          <p class="text-center">Cooking...</p>
        </div>
        <div v-else>
          <div v-if="lastHoveredInfo">
            <p class="text-lg font-bold">Country: <span class="font-normal text-gray-700">{{ lastHoveredInfo.label }}</span></p>
            <p class="text-lg font-bold">Dish Name: <span class="font-normal text-gray-700">{{ lastHoveredInfo.popularDish.name }}</span></p>
            <p class="text-lg font-bold">Cultural Info: <span class="font-normal text-gray-700">{{ lastHoveredInfo.popularDish.culturalInfo }}</span></p>
            <p class="text-lg font-bold">Serving Size: <span v-if="lastHoveredInfo && lastHoveredInfo.popularDish">
            <span class="font-normal text-gray-700">{{ lastHoveredInfo.popularDish.servingSize }}</span></span>
            </p>
          </div>
          <p v-else class="text-gray-600">1. Click on the globe to pin a country. 
            <br>2. Zoom in to pin and hover over it to view its cuisine information.</p>
        </div>
      
      </div>

      <!-- Card for Ingredients Used -->
      <div class="info-card mt-4">
        <h3 class="text-lg font-bold">Ingredients Used</h3>
        <ul v-if="lastHoveredInfo && lastHoveredInfo.popularDish">
          <li v-for="ingredient in lastHoveredInfo.popularDish.ingredients" :key="ingredient" class="text-gray-700">{{ ingredient }}</li>
        </ul>
      </div>

      <!-- Card for Instructions -->
      <div class="info-card mt-4">
        <h3 class="text-lg font-bold">Instructions</h3>
        <ol v-if="lastHoveredInfo && lastHoveredInfo.popularDish">
          <li v-for="(instruction, index) in lastHoveredInfo.popularDish.instructions" :key="instruction" class="flex items-center">
            <p class="font-bold">Step {{ index + 1 }}: <span class="font-normal text-gray-700">{{ instruction }}</span></p>
          </li>
        </ol>
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
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';

export default {
  name: "InteractiveGlobe",
  components: {
    ScaleLoader
  },
  setup() {
    const globeContainer = ref(null);
    const globe = ref(null);
    const places = ref([]);
    const hoverInfo = ref(null);
    const lastHoveredInfo = ref(null);
    const isLoading = ref(false);
    let resizeObserver = null;

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
        newPlace.cuisine = `${country}`;
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
      isLoading.value = true;
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
        ...`
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
      } finally {
        isLoading.value = false;
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
      isLoading
    };
  },
};
</script>

<style scoped>
.interactive-globe {
  display: flex;
  height: 100vh;
}

/* Default styles for larger screens */
.globe-container {
  width: 50%;
  height: 100%;
}

.info-sidebar {
  width: 50%;
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

.info-card ul {
  list-style-type: disc; /* Use disc bullets */
  margin-left: 25px; /* Indent the list */
}

/* Media query for small screens */
@media (max-width: 768px) {
  .interactive-globe {
    flex-direction: column; /* Stack elements vertically */
  }

  .globe-container, .info-sidebar {
    width: 100%; /* Set width to 100% */
    height: 50vh; /* Adjust height to fit on the screen */
  }

  .info-sidebar {
    overflow-y: auto; /* Keep the scroll for sidebar */
  }
}
</style>
