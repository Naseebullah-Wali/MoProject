<template>
  <div class="container mt-5">
    <!-- Search Bar -->
    <div class="row mb-3">
      <div class="col">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search projects..."
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Filters and Sorting Section -->
    <div class="row mb-3 align-items-end">
      <!-- Filters -->
      <div class="col-md-3">
        <label class="form-label">Country</label>
        <select class="form-select" v-model="filters.country" @change="applyFilters">
          <option value="">All Countries</option>
          <option v-for="country in uniqueCountries" :key="country" :value="country">{{ country }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Topic</label>
        <select class="form-select" v-model="filters.topic" @change="applyFilters">
          <option value="">All Topics</option>
          <option v-for="topic in uniqueTopics" :key="topic" :value="topic">{{ topic }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Status</label>
        <select class="form-select" v-model="filters.status" @change="applyFilters">
          <option value="">All Statuses</option>
          <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Character</label>
        <select class="form-select" v-model="filters.character" @change="applyFilters">
          <option value="">All Characters</option>
          <option v-for="character in uniqueCharacters" :key="character" :value="character">{{ character }}</option>
        </select>
      </div>
    </div>

    <!-- Sorting and Clear Sorting -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Sort By</label>
        <select class="form-select" v-model="sortBy" @change="sortProjects">
          <option value="CreatedAt">Date</option>
          <option value="Country_Name">Country</option>
          <option value="all_topics">Topic</option>
        </select>
      </div>
      <div class="col-md-4 align-self-end" v-if="sortBy !== 'CreatedAt'">
        <button class="btn btn-danger" @click="clearSorting">Clear Sorting</button>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="text-end mb-4" v-if="isFilterApplied">
      <button class="btn btn-danger" @click="resetFilters">Clear Filters</button>
    </div>

    <!-- Projects Cards -->
    <div class="row">
      <div class="col-12 mb-4" v-for="project in visibleProjects" :key="project.ID">
        <div class="card" @click="goToDetailPage(project.ID)" style="cursor: pointer;">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <img
                :src="project.Flag"
                alt="Country Flag"
                class="me-2"
                style="width: 20px; height: 15px;"
              />
              <strong>{{ project.Post_Title }}</strong>
            </div>
            <span class="text-muted" style="font-size: 0.9rem;">
              {{ project.Project_Date }}
            </span>
          </div>
          <div class="card-body">
            <!-- Render Post_Content as HTML -->
            <p class="card-text" v-html="truncateText(project.Post_Content,200)"></p>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              {{ project.Country_Name }} | {{ project.all_topics }} | {{ project.Status_Name }} |
              Took effect: {{ formatDate(project.Took_Affect_Date) }} |
              No longer valid: {{ formatDate(project.No_Longer_Valid_Date) }}
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
      projects: [],
      filteredProjects: [],
      visibleProjects: [],
      projectsToShow: 5,
      searchQuery: "",
      sortBy: "CreatedAt",
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
      return [...new Set(this.projects.map((p) => p.Country_Name))];
    },
    // uniqueTopics() {
    //   return [...new Set(this.projects.map((p) => p.all_topics))];
    // },
    uniqueTopics() {
      const topics = this.projects
        .flatMap((p) => (p.all_topics ? p.all_topics.split(",") : [])) // Split by comma
        .map((topic) => topic.trim()) // Trim spaces
        .filter((topic) => topic !== ""); // Remove empty values
      return [...new Set(topics)]; // Ensure uniqueness
    },


    uniqueStatuses() {
      return [...new Set(this.projects.map((p) => p.Status_Name))];
    },
    uniqueCharacters() {
      return [...new Set(this.projects.map((p) => p.Character_name))];
    },
    isFilterApplied() {
      return this.filters.country || this.filters.topic || this.filters.status || this.filters.character || this.searchQuery;
    },
    canLoadMore() {
      return this.visibleProjects.length < this.filteredProjects.length;
    },
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
          // const response = await fetch("https://moproject.onrender.com/project-topics/1");
       const response = await fetch("http://localhost:900/project-topics/1");
        console.log(response)
        this.projects = await response.json();
        this.applyFilters();
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    applyFilters() {
      this.filteredProjects = this.projects.filter((project) => {
        return (
          (!this.filters.country || project.Country_Name === this.filters.country) &&
          // (!this.filters.topic || project.all_topics.includes(this.filters.topic)) &&
          (!this.filters.topic || (project.all_topics &&
            project.all_topics.split(",").map(t => t.trim()).some(t => t === this.filters.topic))) &&
          (!this.filters.status || project.Status_Name === this.filters.status) &&
          (!this.filters.character || project.Character_name === this.filters.character) &&
          (!this.searchQuery ||
            project.Post_Title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            project.Post_Content.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      });
      this.sortProjects();
    },
    sortProjects() {
      this.filteredProjects.sort((a, b) => {
        if (this.sortBy === "CreatedAt") return new Date(b.Project_Date) - new Date(a.Project_Date);
        return a[this.sortBy].localeCompare(b[this.sortBy]);
      });
      this.updateVisibleProjects();
    },
    clearSorting() {
      this.sortBy = "CreatedAt";
      this.sortProjects();
    },
    resetFilters() {
      this.filters = { country: "", topic: "", status: "", character: "" };
      this.searchQuery = "";
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
      return new Date(date).toLocaleDateString();
    },
    getCountryFlag(country) {
      // return `https://flagcdn.com/32x24/${country.toLowerCase()}.png`;
      return `https://flagcdn.com/32x24/kz.png`
    },
    goToDetailPage(id) {
      this.$router.push({ name: "ProjectDetails", params: { id } });
    },
    truncateText(text, maxLength) {
      if (!text) return "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text; 
      const plainText = tempDiv.textContent || tempDiv.innerText;
      return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
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
