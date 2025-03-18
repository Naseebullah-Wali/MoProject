<template>
  <div class="container mt-5">
    <!-- Search Bar -->
    <div class="row mb-3">
      <div class="col">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search scientific reviews..."
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
          <option value="CreatedAt">Date</option>
          <option value="Title">Title</option>
        </select>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="text-end mb-4" v-if="isFilterApplied">
      <button class="btn btn-danger" @click="resetFilters">Clear Filters</button>
    </div>

    <!-- Reviews Cards -->
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="review in visibleItems" :key="review.id">
        <div class="card h-100" @click="goToDetailPage(review.id)" style="cursor: pointer;">
          <div class="card-img-container">
            <img
              v-if="review.Image"
              :src="review.Image.split('|')[0]"
              class="card-img-top"
              alt="Review Image"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ review.Title }}</h5>
            <p class="card-text" v-html="truncateText(review.Content_text, 200)"></p>
          </div>
          <div class="card-footer text-muted">
            <small>
              Source: {{ review.Source }} | Topic: {{ review.Tematiki }} | Published: {{ formatDate(review.Date) }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center mt-4" v-if="canLoadMore">
      <button class="btn btn-primary" @click="loadMoreItems">Show More</button>
    </div>

    <!-- No Reviews Found -->
    <div v-if="filteredItems.length === 0" class="text-center mt-4">
      <p>No scientific reviews found</p>
    </div>
  </div>
</template>

<script>
import listingMixin from '@/mixins/listingMixin';
import { getUniqueValues, filterItems } from '@/utils/utils';

export default {
  name: "ScientificReviews",
  mixins: [listingMixin],
  data() {
    return {
      reviews: [],
      filters: {
        topic: "",
        source: "",
      },
      sortBy: "CreatedAt",
    };
  },
  computed: {
    uniqueTopics() {
      return getUniqueValues(this.reviews, 'Tematiki');
    },
    uniqueSources() {
      return getUniqueValues(this.reviews, 'Source');
    },
  },
  created() {
    this.fetchReviews();
  },
  methods: {
    async fetchReviews() {
      try {
        const response = await fetch(`https://moproject.onrender.com/scientific-reviews/user/${this.user_id}`);
        // const response = await fetch(`http://localhost:900/scientific-reviews/user/${this.user_id}`);
        const data = await response.json();
        this.reviews = data;
        this.items = data; // Set items for the mixin
        this.applyFilters();
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    applyFilters() {
      this.filteredItems = filterItems(this.reviews, this.filters, this.searchQuery, ['Title', 'Content_text']);
      this.sortItems();
    },
    goToDetailPage(reviewId) {
      this.$router.push(`/reviews/${reviewId}`);
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
