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
        <select class="form-select" v-model="sortBy" @change="sortItems">
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
      <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="news in visibleItems" :key="news.id">
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
    <div v-if="filteredItems.length === 0" class="text-center mt-4">
      <p>No news found</p>
    </div>
  </div>
</template>

<script>
import listingMixin from '@/mixins/listingMixin';
import { getUniqueCSVValues, filterItems } from '@/utils/utils';

export default {
  name: "News",
  mixins: [listingMixin],
  data() {
    return {
      news: [],
      filters: {
        topic: "",
        source: "",
      },
      sortBy: "created_at",
    };
  },
  computed: {
    uniqueTopics() {
      return getUniqueCSVValues(this.news, 'all_topics');
    },
    uniqueSources() {
      return getUniqueCSVValues(this.news, 'source');
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
        this.news = data;
        this.items = data; // Set items for the mixin
        this.applyFilters();
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    applyFilters() {
      this.filteredItems = filterItems(this.news, this.filters, this.searchQuery, ['title', 'content_text']);
      this.sortItems();
    },
    goToDetailPage(newsId) {
      this.$router.push(`/news_details/${newsId}`);
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
