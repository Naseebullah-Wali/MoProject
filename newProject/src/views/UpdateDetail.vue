<template>
    <div class="container mt-5">
      <div v-if="update">
        <h2 class="text-center mb-4">Update Details</h2>
  
        <div class="card shadow-sm p-4 mb-4">
          <h4 class="mb-3">Update Information</h4>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Date:</strong> {{ update.date }}
            </li>
            <li class="list-group-item">
              <strong>Project ID:</strong> {{ update.projectId }}
            </li>
          </ul>
        </div>
  
        <div class="card shadow-sm p-4 mb-4">
          <h4 class="mb-3">Rich Text Content</h4>
          <p>{{ update.richText }}</p>
        </div>
  
        <div class="card shadow-sm p-4">
          <h4 class="mb-3">Download File</h4>
          <div v-if="update.wordFile">
            <a
              :href="`/files/${update.wordFile}`"
              class="btn btn-primary"
              target="_blank"
              download
            >
              Download {{ update.wordFile }}
            </a>
          </div>
          <div v-else>
            <p class="text-muted">No file available for this update.</p>
          </div>
        </div>
      </div>
  
      <div v-else>
        <p class="text-center text-muted">Loading update details...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "UpdateDetail",
    data() {
      return {
        update: null, 
      };
    },
    created() {
      this.fetchUpdateDetails();
    },
    methods: {
      async fetchUpdateDetails() {
        const updateId = this.$route.params.id;
        try {
          const response = await fetch(
            `http://localhost:3000/projectUpdates/${updateId}`
          );
          this.update = await response.json();
        } catch (error) {
          console.error("Error fetching update details:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  .card {
    margin-bottom: 20px;
  }
  .list-group-item {
    font-size: 16px;
  }
  </style>
  