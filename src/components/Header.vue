<template>
  <div class="heading">

    <!--    time zone and local time-->
    <div class="time-container">
      <span class="time"><i class="fa fa-globe"/> Time Zone: {{ timeZone }}</span>
      <span class="time"><i class="fa fa-clock-o"/> Local Time: {{ localTime }}</span>
    </div>

    <!--    'locate me' button-->
    <v-btn class="getLocation" size="large" @click="getCurrentLocation">
      <template v-if="loading">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </template>
      <template v-else>
        Locate Me
      </template>
    </v-btn>

    <!--    search box-->
    <v-toolbar density="compact" class="search-box-container">
      <input placeholder="Please enter a location" class="search-box" type="text" ref="searchInput"
             @keyup.enter="searchInputLocation"/>
      <v-btn @click="searchInputLocation">Search</v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';

export default {

  setup(props, {emit}) {
    const currentLocation = ref(null);
    const searchInput = ref(null)
    const loading = ref(false)
    const google = window.google
    const timeZone = ref('')
    const localTime = ref('')
    let geocoder = new google.maps.Geocoder();
    let autocomplete;

    const getCurrentLocation = () => {
      loading.value = true
      navigator.geolocation.getCurrentPosition((position) => {
        currentLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        emit('currentLocation', currentLocation.value)
        getTime(currentLocation.value.lat, currentLocation.value.lng)
        loading.value = false
      })
    }

    const searchInputLocation = () => {
      console.log(searchInput)
      let address = searchInput.value.value;
      geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
          let location = results[0].geometry.location
          addMarksAndChangeTime(location, results[0].formatted_address)
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    const addMarksAndChangeTime = (location, name) => {
      // const id = generateUniqueId(); // 生成唯一的 id
      const locationDetail = {
        location: location,
        name: name
      }
      emit('newLocation', locationDetail)
      getTime(location.lat(), location.lng())
    }

    const getTime = async (latitude, longitude) => {
      const apiKey = 'AIzaSyAvGgPeNKHRKyp1us_QfNN-zSbXgVSxIrU';
      const timestamp = Math.floor(Date.now() / 1000);
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
          timeZone.value = data.timeZoneId;
          localTime.value = new Date().toLocaleTimeString('en-US', {timeZone: timeZone.value});
        }
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };

    onMounted(() => {
      autocomplete = new google.maps.places.Autocomplete(searchInput.value);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const location = place.geometry.location;
        addMarksAndChangeTime(location, place.formatted_address)
      });
    })

    return {
      timeZone,
      loading,
      localTime,
      searchInput,
      getCurrentLocation,
      searchInputLocation
    };
  }
};
</script>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.getLocation {
  width: 15%;
}

.time-container {
  width: 30%;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

.time {
  display: block;
  color: #333;
  font-size: 16px;
  margin-right: 10px;
}

.search-box-container {
  width: 40%;
  display: flex;
  padding-left: 10px;
  height: 50px;
}

.search-box {
  width: 100%;
  padding: 2px;
  border-bottom: darkgrey solid 1px;
}</style>