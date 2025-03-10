<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Scientific Reviews</h1>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Add Scientific Review
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="truncatedScientificReviews"
          :exclude-columns="['id','createdAt','updatedAt','Old_ID','Permalink','Content_text','Image','Source','Link_to_source','Tematiki']"
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
              {{ isEditing ? 'Edit Scientific Review' : 'Add New Scientific Review' }}
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
                <label class="form-label">Old ID (Optional)</label>
                <input
                  v-model="formData.Old_ID"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Old_ID }"
                  type="number"
                >
                <div class="invalid-feedback">{{ errors.Old_ID }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Permalink</label>
                <input
                  v-model="formData.Permalink"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Permalink }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Permalink }}</div>
              </div>
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
                  v-model="formData.Content_text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Content_text }"
                  rows="5"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.Content_text }}</div>
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
              <div class="mb-3">
                <label class="form-label">Date</label>
                <input
                  v-model="formData.reviewDate"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Date }"
                  type="date"
                  required
                >
                <div class="invalid-feedback">{{ errors.Date }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tematiki</label>
                <input
                  v-model="formData.Tematiki"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Tematiki }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Tematiki }}</div>
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
import TableComponent from '../components/TableComponent.vue';

const API_URL = 'https://moproject.onrender.com/scientific-reviews';
// const API_URL = 'http://localhost:900/scientific-reviews';
const scientificReviews = ref([]);
const truncatedScientificReviews = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  Old_ID: null,
  Permalink: '',
  Title: '',
  Content_text: '',
  Image: '',
  Source: '',
  Link_to_source: '',
  reviewDate: '',
  Tematiki: ''
});

const initialFormState = {
  Old_ID: null,
  Permalink: '',
  Title: '',
  Content_text: '',
  Image: '',
  Source: '',
  Link_to_source: '',
  reviewDate: '',
  Tematiki: ''
};

onMounted(fetchScientificReviews);

async function fetchScientificReviews() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch scientific reviews');
    scientificReviews.value = await response.json();
    console.log(scientificReviews.value)
    truncateContentText();
  } catch (error) {
    showError('Error fetching scientific reviews', error);
  }
}

function truncateContentText() {
  truncatedScientificReviews.value = scientificReviews.value.map(review => ({
    ...review,
    Content_text: truncateText(review.Content_text, 50)
  }));
}

function validateForm() {
  errors.value = {};

  if (formData.value.Old_ID && isNaN(formData.value.Old_ID)) {
    errors.value.Old_ID = 'Old ID must be a number';
  }

  if (!formData.value.Permalink.trim()) {
    errors.value.Permalink = 'Permalink is required';
  }

  if (!formData.value.Title.trim()) {
    errors.value.Title = 'Title is required';
  }

  if (!formData.value.Content_text.trim()) {
    errors.value.Content_text = 'Content is required';
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

  if (!formData.value.reviewDate) {
    errors.value.reviewDate = 'Date is required';
  }

  if (!formData.value.Tematiki.trim()) {
    errors.value.Tematiki = 'Tematiki is required';
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
      throw new Error(errorData.message || 'Failed to create scientific review');
    }

    await fetchScientificReviews();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error creating scientific review', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(scientificReview) {
  formData.value = { ...scientificReview };
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
      throw new Error(errorData.message || 'Failed to update scientific review');
    }

    await fetchScientificReviews();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error updating scientific review', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this scientific review?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete scientific review');

    await fetchScientificReviews();
  } catch (error) {
    showError('Error deleting scientific review', error);
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
  const headers = ['Title', 'Content', 'Image', 'Source', 'Link to Source', 'reviewDate', 'Tematiki', 'Permalink', 'Old_ID'];
  const csvContent = [
    headers.join(','),
    ...scientificReviews.value.map(scientificReview =>
      [scientificReview.Title, scientificReview.Content_text, scientificReview.Image, scientificReview.Source, scientificReview.Link_to_source, scientificReview.reviewDate, scientificReview.Tematiki, scientificReview.Permalink, scientificReview.Old_ID].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'scientific_reviews.csv';
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
