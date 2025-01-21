<template>
  <div class="container mt-5">
    <!-- Filters Section -->
    <div class="row mb-4">
      <div class="col-md-3">
        <label for="countryFilter" class="form-label">Country</label>
        <select
          id="countryFilter"
          class="form-select"
          v-model="filters.country"
          @change="applyFilters"
        >
          <option value="">All Countries</option>
          <option v-for="country in uniqueCountries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="topicFilter" class="form-label">Topic</label>
        <select
          id="topicFilter"
          class="form-select"
          v-model="filters.topic"
          @change="applyFilters"
        >
          <option value="">All Topics</option>
          <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
            {{ topic }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="statusFilter" class="form-label">Status</label>
        <select
          id="statusFilter"
          class="form-select"
          v-model="filters.status"
          @change="applyFilters"
        >
          <option value="">All Statuses</option>
          <option v-for="status in uniqueStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="characterFilter" class="form-label">Character</label>
        <select
          id="characterFilter"
          class="form-select"
          v-model="filters.character"
          @change="applyFilters"
        >
          <option value="">All Characters</option>
          <option v-for="character in uniqueCharacters" :key="character" :value="character">
            {{ character }}
          </option>
        </select>
      </div>
    </div>
    <div class="text-end mb-4" v-if="isFilterApplied">
      <button class="btn btn-danger" @click="resetFilters">Clear Filters</button>
    </div>

    <!-- Projects Cards -->
    <div class="row">
      <div
        class="col-12 mb-4"
        v-for="project in visibleProjects"
        :key="project.id"
      >
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <img
                :src="getCountryFlag(project.country)"
                alt="Country Flag"
                class="me-2"
                style="width: 20px; height: 15px;"
              />
              <strong>{{ project.title }}</strong>
            </div>
            <span class="text-muted" style="font-size: 0.9rem;">
              {{ formatDate(project.createdDate) }}
            </span>
          </div>
          <div class="card-body">
            <p class="card-text">{{ project.richText }}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              {{ project.country }} | {{ project.topic }} | {{ project.status }} | Took effect: {{ formatDate(project.tookEffectDate) }} | No longer valid: {{ formatDate(project.noLongerValidDate) }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center mt-4" v-if="canLoadMore">
      <button class="btn btn-primary" @click="loadMoreProjects">
        Show More <i class="fas fa-chevron-down ms-2"></i>
      </button>
    </div>

    <!-- No Projects Found -->
    <div v-if="filteredProjects.length === 0" class="text-center mt-4">
      <p>No projects found</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Projects",
  data() {
    return {
      projects: [], // List of all projects
      filteredProjects: [], // Filtered list after applying filters
      visibleProjects: [], // Projects currently visible on screen
      projectsToShow: 2, // Number of projects to show at a time
      filters: {
        country: "",
        topic: "",
        status: "",
        character: "",
      },
    };
  },
  computed: {
    uniqueCountries() {
      return [...new Set(this.projects.map((p) => p.country))];
    },
    uniqueTopics() {
      return [...new Set(this.projects.map((p) => p.topic))];
    },
    uniqueStatuses() {
      return [...new Set(this.projects.map((p) => p.status))];
    },
    uniqueCharacters() {
      return [...new Set(this.projects.map((p) => p.character))];
    },
    isFilterApplied() {
      return (
        this.filters.country ||
        this.filters.topic ||
        this.filters.status ||
        this.filters.character
      );
    },
    canLoadMore() {
      return this.visibleProjects.length < this.filteredProjects.length;
    },
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
        this.updateVisibleProjects();
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    applyFilters() {
      this.filteredProjects = this.projects.filter((project) => {
        return (
          (!this.filters.country || project.country === this.filters.country) &&
          (!this.filters.topic || project.topic === this.filters.topic) &&
          (!this.filters.status || project.status === this.filters.status) &&
          (!this.filters.character || project.character === this.filters.character)
        );
      });
      this.updateVisibleProjects();
    },
    resetFilters() {
      this.filters = {
        country: "",
        topic: "",
        status: "",
        character: "",
      };
      this.applyFilters();
    },
    updateVisibleProjects() {
      this.visibleProjects = this.filteredProjects.slice(0, this.projectsToShow);
    },
    loadMoreProjects() {
      this.projectsToShow += 5;
      this.updateVisibleProjects();
    },
    formatDate(date) {
      if (!date) return "N/A";
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    getCountryFlag(country) {
      return `https://flagcdn.com/32x24/${country.toLowerCase()}.png`; // Replace with your preferred flag source
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #f8f9fa;
}
.card-footer {
  background-color: #f8f9fa;
  font-size: 0.85rem;
}
button.btn-primary {
  display: inline-flex;
  align-items: center;
}
</style>
