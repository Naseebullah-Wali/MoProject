<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Project Comments</h1>
          <div class="d-flex align-items-center gap-3">
            <input
              v-model="projectIdInput"
              class="form-control form-control-sm"
              placeholder="Enter Project ID"
              style="width: 200px"
            >
            <button
              @click="fetchProjectComments"
              class="btn btn-secondary"
            >
              <i class="bi bi-search"></i> Search
            </button>
          </div>
        </div>

        <!-- Table Component -->
        <TableComponent
          v-if="projectComments.length > 0"
          :data="projectComments"
          :exclude-columns="['id']"
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
        <div v-else class="text-center py-4">
          <p>No data found. Please enter a Project ID and click Search.</p>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      class="modal fade"
      :class="{ show: isEditing }"
      tabindex="-1"
      :style="{ display: isEditing ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Comment</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdate">
              <div class="mb-3">
                <label class="form-label">Comment</label>
                <textarea
                  v-model="formData.Comment"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Comment }"
                  rows="3"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.Comment }}</div>
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade"
      :class="{ show: isEditing }"
      v-if="isEditing"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TableComponent from '../components/TableComponent.vue';

const API_URL = 'http://localhost:900/project-comments';
const projectComments = ref([]);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const projectIdInput = ref('');
const projectId = ref('');

const formData = ref({
  Comment: '',
  Project_ID: ''
});

const initialFormState = {
  Comment: '',
  Project_ID: ''
};

async function fetchProjectComments() {
  if (!projectIdInput.value.trim()) {
    alert('Please enter a Project ID.');
    return;
  }

  projectId.value = projectIdInput.value.trim();

  try {
    const response = await fetch(`${API_URL}/${projectId.value}`);
    if (!response.ok) throw new Error('Failed to fetch project comments');
    projectComments.value = await response.json();
  } catch (error) {
    showError('Error fetching project comments', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Comment.trim()) {
    errors.value.Comment = 'Comment is required';
  }

  return Object.keys(errors.value).length === 0;
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
      throw new Error(errorData.message || 'Failed to update comment');
    }

    await fetchProjectComments();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error updating comment', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(comment) {
  formData.value = { ...comment };
  isEditing.value = true;
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete comment');

    await fetchProjectComments();
  } catch (error) {
    showError('Error deleting comment', error);
  }
}

function closeModal() {
  isEditing.value = false;
  formData.value = { ...initialFormState };
  errors.value = {};
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
}

function exportToCSV() {
  const headers = ['Comment', 'CreatedAt', 'UpdatedAt', 'Name'];
  const csvContent = [
    headers.join(','),
    ...projectComments.value.map(comment =>
      [comment.Comment, comment.CreatedAt, comment.UpdatedAt, comment.Name].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project-comments.csv';
  link.click();
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
