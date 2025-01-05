<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Projects</h2>
    <!-- Search Bar -->
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Search Projects"
        v-model="search"
        @input="filterProjects"
      />
    </div>

    <!-- Projects Table -->
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Project Name</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Developer</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in filteredProjects" :key="project.id">
          <td>{{ project.title }}</td>
          <td>{{ project.priority }}</td>
          <td>{{ project.status }}</td>
          <td>{{ project.developer }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              @click="viewProject(project.id)"
            >
              View
            </button>
          </td>
        </tr>
        <tr v-if="filteredProjects.length === 0">
          <td colspan="5" class="text-center">No projects found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Projects",
  data() {
    return {
      projects: [], // List of all projects
      filteredProjects: [], // Filtered list for search
      search: "", // Search term
    };
  },
  created() {
    this.fetchProjects(); // Load projects on component creation
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await fetch("http://localhost:3000/projects");
        this.projects = await response.json();
        this.filteredProjects = this.projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    filterProjects() {
      this.filteredProjects = this.projects.filter((project) =>
        project.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    viewProject(projectId) {
      // Navigate to the project detail page and pass the project ID
      this.$router.push({ name: "projectDetails", params: { id: projectId } });
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
