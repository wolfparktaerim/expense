<template>
  <div class="interactive-globe">
    <div ref="globeContainer" class="globe-container"></div>
    <div class="info-sidebar">
      <div class="info-card">
        <h2>Cuisine Information</h2>
        <div v-if="hoverInfo">
          <h3>{{ hoverInfo.label }}</h3>
          <p>Cuisine: {{ hoverInfo.cuisine }}</p>
        </div>
        <p v-else>Hover over a pin to see cuisine information</p>
      </div>
    </div>
  </div>
</template>

<script>
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { ref, onMounted, onUnmounted } from 'vue';
import Globe from 'globe.gl';
import axios from 'axios';

export default {
  name: 'InteractiveGlobe',
  setup() {
    const globeContainer = ref(null);
    const globe = ref(null);
    const places = ref([]);
    const hoverInfo = ref(null);

    const getCountry = (lat, lng) => {
      console.log(lat, lng);
      // const API_KEY = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
      // const API_KEY = "YOUR_API_KEY";
      console.log(API_KEY);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
      return axios.get(url)
        .then(response => {
          console.log(response.data);
          // Extract country information from response
          console.log(response.data.results)
          const country = response.data.results.find(result => 
            result.types.includes('country')
          );
          return country ? country.formatted_address : 'Unknown';
        })
        .catch(error => {
          console.error(error);
          return 'Error fetching country';
        });
    };

    const handleGlobeClick = async (event) => {
      if (!globe.value) return;

      console.log('Click event:', event);

      const { lat, lng } = event;
      console.log({ lat, lng });

      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates:', { lat, lng });
        return;
      }

      const newPlace = {
        lat,
        lng,
        label: `Location at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
        color: 'red',
        cuisine: 'Loading...'
      };
      places.value.push(newPlace);
      updateGlobe();

      // Make API call only when clicked
      try {
        const country = await getCountry(lat, lng);
        newPlace.label = country;
        newPlace.cuisine = `Cuisine of ${country}`;
        updateGlobe();
      } catch (error) {
        console.error('Error fetching country:', error);
        newPlace.cuisine = 'Error fetching cuisine';
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
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .labelLat(d => d.lat)
          .labelLng(d => d.lng)
          .labelText(d => d.label)
          .labelSize(0.5)
          .labelColor(() => 'white')
          .labelDotRadius(0.3)
          .labelAltitude(0.01)
          .onGlobeClick(handleGlobeClick)
          .onLabelHover(label => {
            hoverInfo.value = label;
          });

        globe.value(globeContainer.value);
        
        // Ensure the globe fills the container and responds to window resizes
        const resizeObserver = new ResizeObserver(() => {
          globe.value.width(globeContainer.value.clientWidth);
          globe.value.height(globeContainer.value.clientHeight);
        });
        resizeObserver.observe(globeContainer.value);

        // Alternative resize handling if ResizeObserver is not supported
        window.addEventListener('resize', () => {
          if (globe.value) {
            globe.value.width(globeContainer.value.clientWidth);
            globe.value.height(globeContainer.value.clientHeight);
          }
        });
      } else {
        console.error('Globe container not found');
      }
    });

    onUnmounted(() => {
      if (globe.value) {
        globe.value.destroy();
      }
    });

    return {
      globeContainer,
      places,
      hoverInfo,
    };
  }
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