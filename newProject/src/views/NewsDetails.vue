<template>
    <div class="container mt-4">
      <div v-if="newsDetails" class="news-detail-container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <!-- News Header -->
            <div class="news-header mb-4">
              <h1 class="news-title">{{ newsDetails.Title }}</h1>
              <div class="news-meta">
                <span class="badge bg-primary me-2">{{ newsDetails.Source }}</span>
                <span class="badge bg-secondary me-2">{{ newsDetails.all_topics }}</span>
                <span class="text-muted">
                  <i class="bi bi-calendar3"></i> 
                  {{ formatDate(newsDetails.created_at) }}
                </span>
              </div>
            </div>
  
            <!-- News Images -->
            <div v-if="images.length" class="news-images mb-4">
              <div class="row g-3">
                <div 
                  v-for="(image, index) in images" 
                  :key="index"
                  :class="imageColumnClass"
                >
                  <div class="image-container">
                    <img 
                      :src="image" 
                      :alt="`News Image ${index + 1}`" 
                      class="img-fluid rounded shadow-sm"
                      @click="openImageModal(image)"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <!-- News Content -->
            <div class="news-content mb-4">
              <div v-html="newsDetails.Content_Text" class="content-text"></div>
            </div>
  
            <!-- Action Buttons -->
            <div class="news-actions">
              <div class="d-flex gap-3">
                <button @click="$router.go(-1)" class="btn btn-outline-primary">
                  <i class="bi bi-arrow-left"></i> Back
                </button>
                <a 
                  :href="newsDetails.Link_to_source" 
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
    name: "NewsDetail",
    data() {
      return {
        newsDetails: null,
        images: [],
        selectedImage: '',
        modal: null
      };
    },
    computed: {
      imageColumnClass() {
        return this.images.length > 1 ? 'col-md-6' : 'col-12';
      }
    },
    created() {
      this.fetchNewsDetail();
    },
    mounted() {
      this.modal = new Modal(this.$refs.imageModal);
    },
    methods: {
      async fetchNewsDetail() {
        try {
          const response = await fetch('http://localhost:900/news/1');
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          this.newsDetails = data.find(item => item.id === parseInt(this.$route.params.id));
          
          if (this.newsDetails?.Image) {
            this.images = this.newsDetails.Image.split('|');
          }
        } catch (error) {
          console.error('Error fetching news details:', error);
        }
      },
      formatDate(date) {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
      openImageModal(image) {
        this.selectedImage = image;
        this.modal.show();
      }
    }
  };
  </script>
  
  <style scoped>
  .news-detail-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .news-title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  .news-meta {
    margin-bottom: 1.5rem;
  }
  
  .image-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
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
  
  .news-content {
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
  
  .news-actions {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 768px) {
    .news-title {
      font-size: 1.5rem;
    }
  
    .news-content {
      font-size: 1rem;
      line-height: 1.6;
    }
  
    .news-actions .d-flex {
      flex-direction: column;
    }
  
    .news-actions .btn {
      width: 100%;
    }
  }
  </style>