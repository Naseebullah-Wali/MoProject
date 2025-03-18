<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Project Updates</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <i class="bi bi-plus"></i> Add Update
          </button>
        </div>

        <!-- Table Component -->
        <div v-if="projectUpdates.length > 0">
          <TableComponent
            :data="projectUpdates"
            :exclude-columns="['id', 'created_at', 'file1', 'file2', 'file3', 'file4', 'file5', 'file6']"
            @edit="handleEdit"
            @delete="handleDelete"
          >
            <template #tableActions>
              <button @click="exportToCSV" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-download"></i> Export
              </button>
            </template>
          </TableComponent>
        </div>
        <div v-else class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-info-circle fs-3 text-muted mb-3 d-block"></i>
            <p class="mb-0">No updates found for this project.</p>
            <p class="text-muted mt-2">Click "Add Update" to create your first project update.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      class="modal fade"
      :class="{ show: showCreateModal || isEditing }"
      tabindex="-1"
      :style="{ display: (showCreateModal || isEditing) ? 'block' : 'none' }"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Project Update' : 'Add New Project Update' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
              <div class="mb-3">
                <label class="form-label">Update Date *</label>
                <input
                  v-model="formData.update_date"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.update_date }"
                  required
                />
                <div class="invalid-feedback">{{ errors.update_date }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Update Content *</label>
                <textarea
                  v-model="formData.update_content"
                  class="form-control"
                  :class="{ 'is-invalid': errors.update_content }"
                  rows="8"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.update_content }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Files (optional)</label>
                <div class="row">
                  <div class="col-md-6 mb-2" v-for="i in 6" :key="i">
                    <div class="card">
                      <div class="card-body p-3">
                        <div class="d-flex justify-content-between mb-2">
                          <h6 class="mb-0">File {{ i }}</h6>
                          <button
                            v-if="formData[`file${i}`]"
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeFile(i)"
                          >
                            <i class="bi bi-x"></i>
                          </button>
                        </div>

                        <div v-if="formData[`file${i}`]" class="mb-2">
                          <div class="d-flex align-items-center">
                            <i class="bi bi-file-earmark me-2"></i>
                            <span class="text-truncate">{{ getFileName(formData[`file${i}`]) }}</span>
                          </div>
                        </div>

                        <div class="input-group">
                          <input
                            type="file"
                            class="form-control"
                            :id="`file${i}`"
                            @change="(e) => handleFileChange(e, i)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import TableComponent from '../../components/TableComponent.vue';

// const API_URL = 'http://uvn-235-41.ams01.zonevs.eu:9000/project-updates';
const API_URL = 'https://moproject.onrender.com/project-updates';

const projectUpdates = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const route = useRoute();

const initialFormState = {
  update_date: formatDate(new Date()),
  update_content: '',
  file1: '',
  file2: '',
  file3: '',
  file4: '',
  file5: '',
  file6: '',
  fileUploads: {
    file1: null,
    file2: null,
    file3: null,
    file4: null,
    file5: null,
    file6: null
  }
};

const formData = ref({ ...initialFormState });

onMounted(() => {
  fetchProjectUpdates();
});

watch(() => route.query.projectId, () => {
  fetchProjectUpdates();
});

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchProjectUpdates() {
  const projectId = route.query.projectId;
  if (!projectId) return;

  try {
    const response = await fetch(`${API_URL}/${projectId}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Instead of alert and going back, we'll just set an empty array
        projectUpdates.value = [];
      } else {
        throw new Error('Failed to fetch project updates');
      }
      return;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      projectUpdates.value = data.map(update => ({
        ...update,
        update_content: truncateText(update.update_content, 200),
        created_date: update.update_date
      }));
    } else {
      projectUpdates.value = [];
    }
  } catch (error) {
    showError('Error fetching project updates', error);
    projectUpdates.value = []; // Set empty array on error
  }
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function validateForm() {
  errors.value = {};

  if (!formData.value.update_date) {
    errors.value.update_date = 'Update date is required';
  }

  if (!formData.value.update_content?.trim()) {
    errors.value.update_content = 'Update content is required';
  }

  return Object.keys(errors.value).length === 0;
}

function handleFileChange(event, fileNumber) {
  const file = event.target.files[0];
  if (file) {
    formData.value.fileUploads[`file${fileNumber}`] = file;
  }
}

function getFileName(path) {
  if (!path) return '';
  return path.split('/').pop();
}

function removeFile(fileNumber) {
  formData.value[`file${fileNumber}`] = '';
  formData.value.fileUploads[`file${fileNumber}`] = null;

  // Reset the file input
  const fileInput = document.getElementById(`file${fileNumber}`);
  if (fileInput) fileInput.value = '';
}

async function handleCreate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Project_ID', route.query.projectId);

    // Convert date from YYYY-MM-DD to DD.MM.YYYY for API
    const dateParts = formData.value.update_date.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    form.append('update_date', formattedDate);

    form.append('update_content', formData.value.update_content);

    // Append files if they exist
    for (let i = 1; i <= 6; i++) {
      if (formData.value.fileUploads[`file${i}`]) {
        form.append(`file${i}`, formData.value.fileUploads[`file${i}`]);
      }
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project update');
    }

    const createdUpdate = await response.json();
    try {
      const projectId = route.query.projectId;
      const countryId = localStorage.getItem('company_id');
      const projectName = formData.value.update_content.substring(0,50)+ '...' || 'Project Update';
      
      // Extract a brief update title from the content (first 50 chars or so)
      // const updateTitle = formData.value.update_content.length > 50 
        // ? formData.value.update_content.substring(0, 50) + '...' 
        // : formData.value.update_content;

      await fetch('https://moproject.onrender.com/notify/project-update', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countryId: countryId,
          projectId: projectId,
          projectName: projectName,
        }),
      });
    } catch (notificationError) {
      // Log but don't block the flow if notification fails
      console.error('Error sending update notifications:', notificationError);
    }

    await fetchProjectUpdates();
    closeModal();
  } catch (error) {
    showError('Error creating project update', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(update) {
  isEditing.value = true;

  // Reset form data first
  formData.value = { ...initialFormState };

  if (update && update.id) {
    // Convert date from DD.MM.YYYY to YYYY-MM-DD for the form input
    let formattedDate = update.update_date;
    if (update.update_date) {
      formattedDate = formatDisplayDate(update.update_date);
    }

    formData.value = {
      id: update.id,
      update_date: formattedDate,
      update_content: update.update_content || '',
      file1: update.file1 || '',
      file2: update.file2 || '',
      file3: update.file3 || '',
      file4: update.file4 || '',
      file5: update.file5 || '',
      file6: update.file6 || '',
      fileUploads: {
        file1: null,
        file2: null,
        file3: null,
        file4: null,
        file5: null,
        file6: null
      }
    };
  }
}

async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Project_ID', route.query.projectId);

    // Convert date from YYYY-MM-DD to DD.MM.YYYY for API
    const dateParts = formData.value.update_date.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    form.append('update_date', formattedDate);

    form.append('update_content', formData.value.update_content);

    // Append existing files
    for (let i = 1; i <= 6; i++) {
      // Only include the existing file paths if they weren't removed
      if (formData.value[`file${i}`]) {
        form.append(`existing_file${i}`, formData.value[`file${i}`]);
      }

      // Append new files if they exist
      if (formData.value.fileUploads[`file${i}`]) {
        form.append(`file${i}`, formData.value.fileUploads[`file${i}`]);
      }
    }

    const response = await fetch(`${API_URL}/${formData.value.id}`, {
      method: 'PUT',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update project update');
    }

    await fetchProjectUpdates();
    closeModal();
  } catch (error) {
    showError('Error updating project update', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this project update?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete project update');

    await fetchProjectUpdates();
  } catch (error) {
    showError('Error deleting project update', error);
  }
}

function closeModal() {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = { ...initialFormState };
  errors.value = {};
}

function formatDisplayDate(dateString) {
  // Convert from DD.MM.YYYY to YYYY-MM-DD for the input field
  if (!dateString) return '';
  
  const parts = dateString.split('.');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
}

function exportToCSV() {
  if (projectUpdates.value.length === 0) {
    alert('No data available to export.');
    return;
  }
  
  const headers = ['Project', 'Title', 'Date', 'Content'];
  const csvContent = [
    headers.join(','),
    ...projectUpdates.value.map(update => {
      const projectName = route.query.projectId;
      return [
        `"${projectName}"`,
        `"${(update.Project_Title || '').replace(/"/g, '""')}"`,
        update.update_date,
        `"${(update.update_content || '').replace(/"/g, '""').replace(/<[^>]*>/g, '')}"` // Remove HTML tags
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project-updates.csv';
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

.btn-link {
  color: #007bff;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-toggle::after {
  display: none;
}

.project-item {
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.project-item:hover {
  background-color: #f8f9fa;
}

.form-check {
  display: flex;
  align-items: center;
  margin: 0;
}

.form-check-label {
  cursor: pointer;
  padding-left: 8px;
}
</style>