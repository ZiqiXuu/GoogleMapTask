<template>
  <v-sheet class="container">
    <Header :map="map" @currentLocation="changeCurrentLocation" @newLocation="addMarks"/>
    <div class="map-table-container">
      <div ref="mapDiv" class="map-container"></div>
      <SearchHistoryTable :key="locations.value?.length" :locations="locations" @deleteSelectedLocations="deleteSelectedLocations"/>
    </div>
  </v-sheet>
</template>

<script>
import {ref, onMounted} from 'vue'
import Header from "./Header.vue";
import SearchHistoryTable from "./SearchHistoryTable.vue";

export default {

  components: {SearchHistoryTable, Header},

  setup() {
    const locations = ref([]);
    const mapDiv = ref(null)
    const map = ref(null)
    const currentLocation = ref(null)
    const google = window.google
    let markers = [];

    const changeCurrentLocation = (location) => {
      if (map.value) {
        const newLocation = new google.maps.LatLng(location.lat, location.lng)
        map.value.setCenter(newLocation)
      }
    }

    const generateUniqueId = () => {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    const addMarks = (location) => {
      const id = generateUniqueId();
      map.value.setCenter(location.location);
      const marker = new google.maps.Marker({
        map: map.value,
        position: location.location
      });
      markers.push(marker)
      locations.value.unshift({
        id: id,
        name: location.name,
        marker: marker
      });
      console.log(locations.value)
    }

    const deleteSelectedLocations = (selectedLocations) => {
      selectedLocations.forEach(selectedLocation => {
        const targetMarker = markers.find(marker => marker && marker.getPosition().toString() === selectedLocation.marker.getPosition().toString());
        if (targetMarker) {
          targetMarker.setMap(null);//Remove marker(s) from map
          markers = markers.filter(marker => marker !== targetMarker);//Delete marker(s) from array
        }
      });
      locations.value = locations.value.filter(location => !selectedLocations.find(selLoc => selLoc.id === location.id));
    }

    onMounted(() => {
      currentLocation.value = {lat: 43.651070, lng: -79.347015}  // default map center
      map.value = new google.maps.Map(mapDiv.value, {
        center: currentLocation.value,
        zoom: 11,
      })
    })

    return {
      addMarks,
      map,
      locations,
      mapDiv,
      currentLocation,
      deleteSelectedLocations,
      changeCurrentLocation,
    }

  },
}
</script>

<style scoped>

.container {
  padding: 20px;
  margin: 10px;
}

.map-table-container {
  display: flex;
  justify-content: space-between;
}

.map-container {
  flex-basis: 60%;
  height: 500px;
  margin-right: 20px;
  width: 50%;
}

</style>