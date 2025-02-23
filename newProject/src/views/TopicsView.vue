<template>
  <div class="container mt-5">
    <!-- Search Bar -->
    <div class="row mb-3">
      <div class="col">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search news..."
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Filters Section -->
    <div class="row mb-3 align-items-end">
      <div class="col-md-4">
        <label class="form-label">Topic</label>
        <select class="form-select" v-model="filters.topic" @change="applyFilters">
          <option value="">All Topics</option>
          <option v-for="topic in uniqueTopics" :key="topic" :value="topic">{{ topic }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Source</label>
        <select class="form-select" v-model="filters.source" @change="applyFilters">
          <option value="">All Sources</option>
          <option v-for="source in uniqueSources" :key="source" :value="source">{{ source }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Sort By</label>
        <select class="form-select" v-model="sortBy" @change="sortNews">
          <option value="created_at">Date</option>
          <option value="Title">Title</option>
        </select>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="text-end mb-4" v-if="isFilterApplied">
      <button class="btn btn-danger" @click="resetFilters">Clear Filters</button>
    </div>

    <!-- News Cards -->
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="news in visibleNews" :key="news.id">
        <div class="card h-100" @click="goToDetailPage(news.id)" style="cursor: pointer;">
          <div class="card-img-container">
            <img 
              v-if="news.image" 
              :src="news.image" 
              class="card-img-top" 
              alt="News Image"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ news.title }}</h5>
            <p class="card-text" v-html="truncateText(news.content_text, 200)"></p>
          </div>
          <div class="card-footer text-muted">
            <small>
              Source: {{ news.source }} | Topics: {{ news.all_topics }} | Published: {{ formatDate(news.created_at) }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- No News Found -->
    <div v-if="filteredNews.length === 0" class="text-center mt-4">
      <p>No news found</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "News",
  data() {
    return {
      news: [],
      filteredNews: [],
      visibleNews: [],
      newsToShow: 5,
      searchQuery: "",
      sortBy: "created_at",
      filters: {
        topic: "",
        source: "",
      },
    };
  },
  computed: {
    uniqueTopics() {
      return [...new Set(this.news.map((n) => n.all_topics))];
    },
    uniqueSources() {
      return [...new Set(this.news.map((n) => n.source))];
    },
    isFilterApplied() {
      return this.filters.topic || this.filters.source || this.searchQuery;
    },
  },
  created() {
    this.fetchNews();
  },
  methods: {
    async fetchNews() {
      try {
        const response = await fetch("https://moproject.onrender.com/news/1");
        const data = await response.json();
        this.news = data; // Assuming data is an array with a single item
        this.applyFilters();
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    applyFilters() {
      this.filteredNews = this.news.filter((newsItem) => {
        return (
          (!this.filters.topic || newsItem.all_topics.includes(this.filters.topic)) &&
          (!this.filters.source || newsItem.Source === this.filters.source) &&
          (!this.searchQuery ||
            newsItem.Title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            newsItem.Content_Text.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      });
      this.sortNews();
    },
    sortNews() {
      this.filteredNews.sort((a, b) => {
        if (this.sortBy === "created_at") return new Date(b.created_at) - new Date(a.created_at);
        return a[this.sortBy].localeCompare(b[this.sortBy]);
      });
      this.updateVisibleNews();
    },
    resetFilters() {
      this.filters = { topic: "", source: "" };
      this.searchQuery = "";
      this.applyFilters();
    },
    updateVisibleNews() {
      this.visibleNews = this.filteredNews.slice(0, this.newsToShow);
    },
    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString();
    },
    goToDetailPage(newsId) {
      this.$router.push(`/news/${newsId}`);
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
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-container {
  height: 200px;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-footer {
  background-color: #f8f9fa;
  font-size: 0.85rem;
}
</style>
