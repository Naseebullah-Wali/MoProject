<template>
    <div class="container mt-5">
      <div v-if="project">
        <h2 class="text-center mb-4">{{ project.title }}</h2>
  
        <div class="card shadow-sm p-4 mb-4">
          <h4 class="mb-3">Project Details</h4>
          <ul class="list-group">
            <li class="list-group-item"><strong>Priority:</strong> {{ project.priority }}</li>
            <li class="list-group-item"><strong>Status:</strong> {{ project.status }}</li>
            <li class="list-group-item"><strong>Developer:</strong> {{ project.developer }}</li>
            <li class="list-group-item"><strong>Created Date:</strong> {{ project.createdDate }}</li>
            <li class="list-group-item"><strong>Project Date:</strong> {{ project.projectDate }}</li>
            <li class="list-group-item"><strong>Level of Importance:</strong> {{ project.levelOfImportance }}</li>
            <li class="list-group-item"><strong>Character:</strong> {{ project.character }}</li>
            <li class="list-group-item"><strong>Document Type:</strong> {{ project.documentType }}</li>
          </ul>
        </div>
  
        <div class="card shadow-sm p-4 mb-4">
          <h4 class="mb-3">Rich Text Content</h4>
          <p>{{ project.richText }}</p>
        </div>
  
        <div class="card shadow-sm p-4">
          <h4 class="mb-3">Project Updates</h4>
          <div v-if="updates.length">
            <ul class="list-group">
              <li
                v-for="update in updates"
                :key="update.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{{ update.date }}</span>
                <button
                  class="btn btn-sm btn-primary"
                  @click="viewUpdate(update.id)"
                >
                  View Update
                </button>
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="text-muted">No updates available for this project.</p>
          </div>
        </div>
      </div>
  
      <div v-else>
        <p class="text-center text-muted">Loading project details...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProjectDetails",
    data() {
      return {
        project: null, // The project details
        updates: [], // Updates related to the project
      };
    },
    created() {
      this.fetchProjectDetails();
    },
    methods: {
      async fetchProjectDetails() {
        const projectId = this.$route.params.id; // Get project ID from route params
        try {
          // Fetch project details
          const projectResponse = await fetch(
            `http://localhost:3000/projects/${projectId}`
          );
          this.project = await projectResponse.json();
  
          // Fetch related updates
          const updatesResponse = await fetch(
            `http://localhost:3000/projectUpdates?projectId=${projectId}`
          );
          this.updates = await updatesResponse.json();
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      },
      viewUpdate(updateId) {
        this.$router.push({ name: "UpdateDetail", params: { id: updateId } });
        // alert(`View details for update ID: ${updateId}`);
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
  