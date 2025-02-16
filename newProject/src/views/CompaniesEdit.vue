<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Companies</h1>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Add Company
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="companies"
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
              {{ isEditing ? 'Edit Company' : 'Add New Company' }}
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
                <label class="form-label">Company Name</label>
                <input
                  v-model="formData.Company_Name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Company_Name }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Company_Name }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Company Logo URL</label>
                <input
                  v-model="formData.Company_Logo"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Company_Logo }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Company_Logo }}</div>
                <div class="form-text">
                  Enter a valid URL for the company's logo image
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">About</label>
                <textarea
                  v-model="formData.About"
                  class="form-control"
                  :class="{ 'is-invalid': errors.About }"
                  rows="3"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.About }}</div>
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

const API_URL = 'http://localhost:900/companies';
const companies = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  Company_Name: '',
  Company_Logo: '',
  About: ''
});

const initialFormState = {
  Company_Name: '',
  Company_Logo: '',
  About: ''
};

onMounted(fetchCompanies);

async function fetchCompanies() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch companies');
    companies.value = await response.json();
  } catch (error) {
    showError('Error fetching companies', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Company_Name.trim()) {
    errors.value.Company_Name = 'Company name is required';
  }

  if (!formData.value.Company_Logo.trim()) {
    errors.value.Company_Logo = 'Company logo URL is required';
  } else if (!isValidUrl(formData.value.Company_Logo)) {
    errors.value.Company_Logo = 'Please enter a valid URL';
  }

  if (!formData.value.About.trim()) {
    errors.value.About = 'About is required';
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
      throw new Error(errorData.message || 'Failed to create company');
    }

    await fetchCompanies();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error creating company', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(company) {
  formData.value = { ...company };
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
      throw new Error(errorData.message || 'Failed to update company');
    }

    await fetchCompanies();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error updating company', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this company?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete company');

    await fetchCompanies();
  } catch (error) {
    showError('Error deleting company', error);
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
  const headers = ['Company Name', 'Company Logo', 'About'];
  const csvContent = [
    headers.join(','),
    ...companies.value.map(company =>
      [company.Company_Name, company.Company_Logo, company.About].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'companies.csv';
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
