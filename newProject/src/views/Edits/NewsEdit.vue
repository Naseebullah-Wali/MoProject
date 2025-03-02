<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">News Articles</h1>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Add News Article
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="truncatedNews"
          :exclude-columns="['id','createdAt','updatedAt','created_at']"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #tableActions>
            <button
              @click="exportToCSV"
              class="btn btn-outline-secondary btn-sm"
            >
              <i class="bi bi-download"></i> Export
            </button>
          </template>
        </TableComponent>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      class="modal fade"
      :class="{ show: showCreateModal || isEditing }"
      tabindex="-1"
      :style="{ display: (showCreateModal || isEditing) ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit News Article' : 'Add New News Article' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  v-model="formData.Title"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Title }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Title }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea
                  v-model="formData.Content_Text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Content_Text }"
                  rows="5"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.Content_Text }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL</label>
                <input
                  v-model="formData.Image"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Image }"
                >
                <div class="invalid-feedback">{{ errors.Image }}</div>
                <div class="form-text">
                  Enter a valid URL for the image
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Source</label>
                <input
                  v-model="formData.Source"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Source }"
                >
                <div class="invalid-feedback">{{ errors.Source }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Link to Source</label>
                <input
                  v-model="formData.Link_to_source"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Link_to_source }"
                >
                <div class="invalid-feedback">{{ errors.Link_to_source }}</div>
                <div class="form-text">
                  Enter a valid URL for the source link
                </div>
              </div>
              <div class="modal-footer px-0 pb-0">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  {{ isEditing ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade"
      :class="{ show: showCreateModal || isEditing }"
      v-if="showCreateModal || isEditing"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from '../../components/TableComponent.vue';

const API_URL = 'http://localhost:900/news';
// const API_URL = 'https://moproject.onrender.com/news';
const newsArticles = ref([]);
const truncatedNews = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  Title: '',
  Content_Text: '',
  Image: '',
  Source: '',
  Link_to_source: ''
});

const initialFormState = {
  Title: '',
  Content_Text: '',
  Image: '',
  Source: '',
  Link_to_source: ''
};

onMounted(fetchNewsArticles);

async function fetchNewsArticles() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch news articles');
    newsArticles.value = await response.json();
    truncateContentText();
  } catch (error) {
    showError('Error fetching news articles', error);
  }
}

function truncateContentText() {
  truncatedNews.value = newsArticles.value.map(article => ({
    ...article,
    Content_Text: truncateText(article.Content_Text, 50)
  }));
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Title.trim()) {
    errors.value.Title = 'Title is required';
  }

  if (!formData.value.Content_Text.trim()) {
    errors.value.Content_Text = 'Content is required';
  }

  if (formData.value.Image && !isValidUrl(formData.value.Image)) {
    errors.value.Image = 'Please enter a valid URL';
  }

  if (!formData.value.Source.trim()) {
    errors.value.Source = 'Source is required';
  }

  if (formData.value.Link_to_source && !isValidUrl(formData.value.Link_to_source)) {
    errors.value.Link_to_source = 'Please enter a valid URL';
  }

  return Object.keys(errors.value).length === 0;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function handleCreate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create news article');
    }

    await fetchNewsArticles();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error creating news article', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(newsArticle) {
  formData.value = { ...newsArticle };
  isEditing.value = true;
}

async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/${formData.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update news article');
    }

    await fetchNewsArticles();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error updating news article', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this news article?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete news article');

    await fetchNewsArticles();
  } catch (error) {
    showError('Error deleting news article', error);
  }
}

function closeModal() {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = { ...initialFormState };
  errors.value = {};
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
}

function exportToCSV() {
  const headers = ['Title', 'Content', 'Image', 'Source', 'Link to Source'];
  const csvContent = [
    headers.join(','),
    ...newsArticles.value.map(newsArticle =>
      [newsArticle.Title, truncateText(newsArticle.Content_Text, 10), newsArticle.Image, newsArticle.Source, newsArticle.Link_to_source].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'news_articles.csv';
  link.click();
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
  display: block;
}

.modal-backdrop.show {
  opacity: 0;
}
</style>
