<template>
  <div class="container mt-4">
    <div v-if="review" class="review-detail-container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <!-- Review Header -->
          <div class="review-header mb-4">
            <h1 class="review-title">{{ review.Title }}</h1>
            <div class="review-meta">
              <span class="badge bg-primary me-2">{{ review.Source }}</span>
              <span class="badge bg-secondary me-2">{{ review.Tematiki }}</span>
              <span class="text-muted">
                <i class="bi bi-calendar3"></i> 
                {{ formatDate(review.Date) }}
              </span>
            </div>
          </div>

          <!-- Review Images -->
          <div v-if="images.length" class="review-images mb-4">
            <div class="row g-3">
              <div 
                v-for="(image, index) in images" 
                :key="index"
                :class="images.length > 1 ? 'col-md-6' : 'col-12'"
              >
                <div class="image-container">
                  <img 
                    :src="image" 
                    :alt="`Review Image ${index + 1}`" 
                    class="img-fluid rounded shadow-sm"
                    @click="openImageModal(image)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Review Content -->
          <div class="review-content mb-4">
            <div v-html="review.Content_text" class="content-text"></div>
          </div>

          <!-- Additional Information -->
          <div class="additional-info mb-4">
            <h5 class="mb-3">Additional Information</h5>
            <ul class="list-unstyled">
              <li class="mb-2">
                <strong>Original Source:</strong> 
                <a :href="review.Link_to_source" target="_blank" class="text-primary">
                  {{ review.Source }}
                  <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
              </li>
              <li class="mb-2"><strong>Topic:</strong> {{ review.all_topics }}</li>
              <li><strong>Created:</strong> {{ formatDate(review.CreatedAt) }}</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="review-actions">
            <div class="d-flex gap-3">
              <button @click="goBack" class="btn btn-outline-primary">
                <i class="bi bi-arrow-left"></i> Back to Reviews
              </button>
              <a 
                :href="review.Link_to_source" 
                target="_blank" 
                class="btn btn-primary"
              >
                <i class="bi bi-box-arrow-up-right"></i> Read Full Article
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Image Modal -->
    <div 
      class="modal fade" 
      id="imageModal" 
      tabindex="-1" 
      ref="imageModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body p-0">
            <img 
              :src="selectedImage" 
              class="img-fluid" 
              alt="Full size image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'ReviewDetail',
  data() {
    return {
      review: {},
      images: [],
      selectedImage: '',
      modal: null
    }
  },
  created() {
    this.fetchReviewDetail();
  },
  mounted() {
    this.modal = new Modal(this.$refs.imageModal);
  },
  methods: {
    async fetchReviewDetail() {
      try {
          const response = await fetch(`https://moproject.onrender.com/scientific-reviews/user/1`);
      //  const response = await fetch(`http://localhost:900/scientific-reviews/user/1`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        this.review = await data.find(item => item.id === parseInt(this.$route.params.id));
        if (this.review.Image) {
          this.images = this.review.Image.split('|');
        }
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    },
    goBack() {
      this.$router.push('/');
      this.$router.push(`/companies`);
    },
    openImageModal(image) {
      this.selectedImage = image;
      this.modal.show();
    }
  }
}
</script>

<style scoped>
.review-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.review-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.review-meta {
  margin-bottom: 1.5rem;
}

.image-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.image-container:hover {
  transform: scale(1.02);
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
}

.content-text {
  max-width: 100%;
  overflow-wrap: break-word;
}

.content-text :deep(p) {
  margin-bottom: 1.5rem;
}

.content-text :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 8px;
}

.additional-info {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.additional-info h5 {
  color: #2c3e50;
  font-weight: 600;
}

.additional-info li {
  padding: 0.5rem 0;
}

.review-actions {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .review-title {
    font-size: 1.5rem;
  }

  .review-content {
    font-size: 1rem;
    line-height: 1.6;
  }

  .review-actions .d-flex {
    flex-direction: column;
  }

  .review-actions .btn {
    width: 100%;
  }

  .additional-info {
    padding: 1rem;
  }
}

</style>