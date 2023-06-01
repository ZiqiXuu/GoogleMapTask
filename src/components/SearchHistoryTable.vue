<template>
  <div class="table-container">
    <!--    table content-->
    <v-table class="location-table">
      <thead>
      <tr>
        <th>
          <v-btn variant="flat" @click="deleteSelectedLocations">
            <font-awesome-icon style="font-size: 15px" icon="fa-regular fa-trash-can"/>
          </v-btn>
        </th>
        <th>Search History</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="location in paginatedLocations" :key="location.id">
        <td>
          <input type="checkbox" :value="location.id" v-model="checkedLocations">
        </td>
        <td>{{ location.name }}</td>
      </tr>
      </tbody>
    </v-table>
    <!--    pagination buttons-->
    <div class="button-container">
      <v-btn @click="currentPage--" :disabled="currentPage <= 1">Previous page</v-btn>
      <v-btn @click="currentPage++" :disabled="currentPage >= totalPages">Next page</v-btn>
    </div>
  </div>
</template>

<script>
import {computed, ref} from "vue";

export default {

  name: "SearchHistoryTable",
  props: ['locations'],

  setup(props, {emit}) {
    const currentPage = ref(1);
    const paginatedLocations = computed(() => {
      const startIndex = (currentPage.value - 1) * 10;
      return props.locations?.slice(startIndex, startIndex + 10);
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(props.locations?.length / 10)));
    const checkedLocations = ref([])
    const deleteSelectedLocations = () => {
      const selectedLocations = props.locations.filter(location => checkedLocations.value.includes(location.id));
      emit('deleteSelectedLocations', selectedLocations);
      console.log(selectedLocations)
      checkedLocations.value = []; // clear checkedLocations
    }

    return {
      deleteSelectedLocations,
      checkedLocations,
      paginatedLocations,
      currentPage,
      totalPages,
    }

  }
}
</script>

<style scoped>

.button-container {
  display: flex;
  justify-content: space-between;
}

.table-container {
  width: 50%;
}

.location-table {
  min-height: 500px;
}

.location-table td:first-child {
  text-align: center;
  vertical-align: middle;
}

.location-table th:nth-child(1), .location-table td:nth-child(1) {
  width: 100px;
}
</style>