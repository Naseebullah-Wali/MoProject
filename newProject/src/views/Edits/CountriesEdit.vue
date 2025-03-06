<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Countries</h1>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Add Country
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="countries"
          :exclude-columns="['id','createdAt','updatedAt']"
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
              {{ isEditing ? 'Edit Country' : 'Add New Country' }}
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
                <label class="form-label">Country Name</label>
                <input
                  v-model="formData.Country_Name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Country_Name }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Country_Name }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Country Flag</label>
                <div v-if="isEditing && !formData.FlagFile" class="mb-2">
                  <img :src="formData.Flag" alt="Existing Flag" class="img-fluid" style="max-height: 200px;">
                </div>
                <div
                  class="drop-zone"
                  @dragover.prevent
                  @drop="handleDrop"
                >
                  <input
                    type="file"
                    @change="handleFileChange"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Flag }"
                    accept="image/*"
                  >
                  <div class="form-text">
                    Drag & drop a file or click to upload
                  </div>
                </div>
                <div v-if="formData.FlagFile" class="mt-2 d-flex align-items-center">
                  <strong class="me-2">Selected File:</strong> {{ formData.FlagFile.name }}
                  <button type="button" class="btn btn-link p-0 ms-2" @click="removeFile">Remove</button>
                </div>
                <div v-if="imagePreview" class="mt-2">
                  <img :src="imagePreview" alt="Image Preview" class="img-fluid" style="max-height: 200px;">
                </div>
                <div class="invalid-feedback">{{ errors.Flag }}</div>
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

// const API_URL = 'http://localhost:900/countries';
const API_URL = 'https://moproject.onrender.com/countries';

const countries = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const fileInput = ref(null);
const imagePreview = ref(null);

const formData = ref({
  Country_Name: '',
  Flag: '',
  FlagFile: null
});

const initialFormState = {
  Country_Name: '',
  Flag: '',
  FlagFile: null
};

onMounted(fetchCountries);

async function fetchCountries() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch countries');
    countries.value = await response.json();
  } catch (error) {
    showError('Error fetching countries', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Country_Name.trim()) {
    errors.value.Country_Name = 'Country name is required';
  }

  if (isEditing.value && !formData.value.Flag && !formData.value.FlagFile) {
    errors.value.Flag = 'Country flag is required';
  }

  if (!isEditing.value && !formData.value.FlagFile) {
    errors.value.Flag = 'Country flag is required';
  }

  return Object.keys(errors.value).length === 0;
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.FlagFile = file;
    previewImage(file);
  } else {
    errors.value.Flag = 'Please upload a valid image file';
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.FlagFile = file;
    previewImage(file);
  } else {
    errors.value.Flag = 'Please upload a valid image file';
  }
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.value = event.target.result;
  };
  reader.readAsDataURL(file);
}

function removeFile() {
  formData.value.FlagFile = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

async function handleCreate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Country_Name', formData.value.Country_Name);
    form.append('Flag', formData.value.FlagFile);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) throw new Error('Failed to create country');

    await fetchCountries();
    closeModal();
  } catch (error) {
    showError('Error creating country', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(country) {
  formData.value = { ...country, FlagFile: null };
  isEditing.value = true;
}

async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Country_Name', formData.value.Country_Name);
    if (formData.value.FlagFile) {
      form.append('Flag', formData.value.FlagFile);
    }

    const response = await fetch(`${API_URL}/${formData.value.id}`, {
      method: 'PUT',
      body: form,
    });

    if (!response.ok) throw new Error('Failed to update country');

    await fetchCountries();
    closeModal();
  } catch (error) {
    showError('Error updating country', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this country?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete country');

    await fetchCountries();
  } catch (error) {
    showError('Error deleting country', error);
  }
}

function closeModal() {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = { ...initialFormState };
  errors.value = {};
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
}

function exportToCSV() {
  const headers = ['Country Name', 'Flag'];
  const csvContent = [
    headers.join(','),
    ...countries.value.map(country =>
      [country.Country_Name, country.Flag].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'countries.csv';
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

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s;
}

.drop-zone:hover {
  border-color: #007bff;
}

.drop-zone input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.btn-link {
  color: #007bff;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
