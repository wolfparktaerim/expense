<!-- src/components/globe/index.vue -->
<template>
  <div class="interactive-globe">
    <div ref="globeContainer" class="globe-container"></div>
    <div
      class="info-sidebar bg-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-4"
    >
      <h2 class="text-3xl font-bold mb-4 text-purple-600">
        Discover Global Recipes!
      </h2>
      <div class="search-container flex items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="e.g. Tokyo, Sichuan, India, Asia"
          class="border rounded px-2 py-1 text-gray-700 flex-1"
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="bg-purple-600 text-white font-bold ml-2 py-1 px-2 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 mr-3"
          :disabled="isLoading"
        >
          Search
        </button>
      </div>
      <p class="text-xs text-gray-500 italic">
          Search by city, province, country or region
        </p>
      <div class="info-card">
        <!-- Loading State -->
        <div v-if="isLoading">
          <ScaleLoader />
          <p class="text-center text-gray-600">Preparing dish...</p>
        </div>
        <!-- Content State -->
        <div v-else>
          <div v-if="selectedCountryInfo">
            <p class="text-lg font-bold text-gray-800">
              Country:
              <span class="font-normal text-gray-700">{{
                selectedCountryInfo.label
              }}</span>
            </p>
            <p class="text-lg font-bold text-gray-800">
              Dish Name:
              <span class="font-normal text-gray-700">{{
                selectedCountryInfo.popularDish.name
              }}</span>
            </p>
            <p class="text-lg font-bold text-gray-800">
              Cultural Info:
              <span class="font-normal text-gray-700">{{
                selectedCountryInfo.popularDish.culturalInfo
              }}</span>
            </p>
            <p class="text-lg font-bold text-gray-800">
              Serving Size:
              <span
                v-if="selectedCountryInfo && selectedCountryInfo.popularDish"
                ><span class="font-normal text-gray-700">{{
                  selectedCountryInfo.popularDish.servingSize
                }}</span></span
              >
            </p>
          </div>
          <p v-else class="text-gray-600">
            1. Click on the globe to pin a country and prepare its dish.<br />
            2. Or search for a specific city, province, country or region by name.<br />
            3. Hover over individual pins to switch between recipes.
          </p>
        </div>
      </div>

      <!-- Ingredients Card -->
      <div class="info-card mt-4">
        <h3 class="text-lg font-bold text-gray-800">Ingredients Used</h3>
        <div v-if="isLoading">
          <ScaleLoader />
          <p class="text-center text-gray-600">Preparing ingredients...</p>
        </div>
        <ul v-else-if="selectedCountryInfo && selectedCountryInfo.popularDish">
          <li
            v-for="ingredient in selectedCountryInfo.popularDish.ingredients"
            :key="ingredient"
            class="text-gray-700"
          >
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <!-- Instructions Card -->
      <div class="info-card mt-4">
        <h3 class="text-lg font-bold text-gray-800">Instructions</h3>
        <div v-if="isLoading">
          <ScaleLoader />
          <p class="text-center text-gray-600">Preparing instructions...</p>
        </div>
        <ol v-else-if="selectedCountryInfo && selectedCountryInfo.popularDish">
          <li
            v-for="(instruction, index) in selectedCountryInfo.popularDish
              .instructions"
            :key="instruction"
            class="flex items-center"
          >
            <p class="font-bold text-gray-800">
              Step {{ index + 1 }}:
              <span class="font-normal text-gray-700">{{ instruction }}</span>
            </p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import { initGlobe, updateGlobe } from "./GlobeVisualization";
import {
  getCoordinatesForCountry,
  getCountry,
  getPopularDishes,
} from "./ApiService";
import "./styles.css";

export default {
  name: "InteractiveGlobe",
  components: {
    ScaleLoader,
  },
  setup() {
    const globeContainer = ref(null);
    const globe = ref(null);
    const places = ref([]);
    const hoverInfo = ref(null);
    const selectedCountryInfo = ref(null);
    const isLoading = ref(false);
    const searchQuery = ref("");
    let resizeObserver = null;

    const setLoadingState = (loading) => {
      isLoading.value = loading;
      if (loading) {
        selectedCountryInfo.value = null; // Clear current selection while loading
      }
    };

    const rotateGlobe = (targetLat, targetLng) => {
      if (!globe.value) return;
      globe.value.pointOfView(
        { lat: targetLat, lng: targetLng, altitude: 5 },
        1000
      );
      setTimeout(() => {
        globe.value.pointOfView(
          { lat: targetLat, lng: targetLng, altitude: 0.7 },
          1000
        );
      }, 1500);
    };

    const handleSearch = async () => {
      if (!searchQuery.value || isLoading.value) return;
      setLoadingState(true);
      try {
        const coordinates = await getCoordinatesForCountry(searchQuery.value);
        if (coordinates) {
          rotateGlobe(coordinates.lat, coordinates.lng);
          await handleGlobeClick(coordinates);
        } else {
          alert("Country not found. Please try again.");
        }
      } catch (error) {
        console.error("Search error:", error);
        alert("Error searching for country. Please try again.");
      } finally {
        setLoadingState(false);
        searchQuery.value = "";
      }
    };

    const handleGlobeClick = async (event) => {
      if (!globe.value) return;

      const { lat, lng, formatted_address } = event;
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", { lat, lng });
        return;
      }

      try {
        setLoadingState(true);
        const country = formatted_address || (await getCountry(lat, lng));
        const existingPlace = places.value.find((p) => p.label === country);

        if (existingPlace) {
          rotateGlobe(existingPlace.lat, existingPlace.lng);
          selectedCountryInfo.value = existingPlace;
          setLoadingState(false);
          return;
        }

        const newPlace = {
          lat,
          lng,
          label: country,
          color: "red",
          cuisine: country,
          popularDish: { loading: false },
        };

        places.value = [...places.value, newPlace];
        updateGlobe(globe.value, places.value);

        if (country !== "Unknown" && country !== "Error fetching country") {
          await getPopularDishes(
            country,
            places,
            updateGlobe,
            globe,
            setLoadingState
          );
          selectedCountryInfo.value = places.value.find(
            (p) => p.label === country
          );
        }
      } catch (error) {
        console.error("Error in handleGlobeClick:", error);
        const newPlace = {
          lat,
          lng,
          label: "Unknown",
          color: "red",
          cuisine: "Unknown",
          popularDish: { loading: false },
        };
        places.value = [...places.value, newPlace];
        updateGlobe(globe.value, places.value);
      } finally {
        setLoadingState(false);
      }
    };

    onMounted(() => {
      if (globeContainer.value) {
        globe.value = initGlobe(globeContainer.value, handleGlobeClick, (d) => {
          if (d) {
            hoverInfo.value = d;
            selectedCountryInfo.value = d;
          }
        });

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

        onUnmounted(() => {
          if (resizeObserver) resizeObserver.disconnect();
          window.removeEventListener("resize", handleResize);
          if (globe.value) {
            const renderer = globe.value.renderer();
            if (renderer) {
              renderer.dispose();
              renderer.forceContextLoss();
              renderer.domElement.remove();
            }
            globe.value = null;
          }
        });
      }
    });

    return {
      globeContainer,
      places,
      hoverInfo,
      selectedCountryInfo,
      isLoading,
      searchQuery,
      handleSearch,
    };
  },
};
</script>
