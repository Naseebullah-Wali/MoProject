<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Companies</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <i class="bi bi-plus"></i> Add Company
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="companies"
          :exclude-columns="['id', 'createdAt', 'updatedAt']"
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
            <button type="button" class="btn-close" @click="closeModal"></button>
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
                />
                <div class="invalid-feedback">{{ errors.Company_Name }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Company Logo</label>
                <div v-if="isEditing && formData.Company_Logo" class="mb-2">
                  <img :src="formData.Company_Logo" alt="Existing Logo" class="img-fluid" style="max-height: 200px;" />
                  <button type="button" class="btn btn-danger btn-sm mt-2" @click="removeExistingLogo">Remove Logo</button>
                </div>

                <div class="drop-zone" @dragover.prevent @drop="handleDrop">
                  <input
                    type="file"
                    @change="handleFileChange"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Company_Logo }"
                    accept="image/*"
                  />
                  <div class="form-text">Drag & drop a file or click to upload</div>
                </div>
                <div v-if="formData.Company_LogoFile" class="mt-2 d-flex align-items-center">
                  <strong class="me-2">Selected File:</strong> {{ formData.Company_LogoFile.name }}
                  <button type="button" class="btn btn-link p-0 ms-2" @click="removeFile">Remove</button>
                </div>
                <div v-if="imagePreview" class="mt-2">
                  <img :src="imagePreview" alt="Image Preview" class="img-fluid" style="max-height: 200px;" />
                </div>
                <div class="invalid-feedback">{{ errors.Company_Logo }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Countries</label>
                <select
                  v-model="formData.Country_Ids"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Country_Ids }"
                  multiple
                  required
                >
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.Country_Name }}
                  </option>
                </select>
                <div class="invalid-feedback">{{ errors.Country_Ids }}</div>
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
import { ref, onMounted } from 'vue';
import TableComponent from '../../components/TableComponent.vue';

// const API_URL = 'http://localhost:900/companies';
// const COUNTRIES_URL = 'http://localhost:900/countries';
const API_URL = 'https://moproject.onrender.com/companies';
const COUNTRIES_URL = 'https://moproject.onrender.com/countries';
const companies = ref([]);
const countries = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const fileInput = ref(null);
const imagePreview = ref(null);

const formData = ref({
  Company_Name: '',
  Company_Logo: '',
  Company_LogoFile: null,
  About: '',
  Country_Ids: []
});

const initialFormState = {
  Company_Name: '',
  Company_Logo: '',
  Company_LogoFile: null,
  About: '',
  Country_Ids: []
};

onMounted(() => {
  fetchCompanies();
  fetchCountries();
});

async function fetchCompanies() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch companies');
    companies.value = await response.json();
  } catch (error) {
    showError('Error fetching companies', error);
  }
}

async function fetchCountries() {
  try {
    const response = await fetch(COUNTRIES_URL);
    if (!response.ok) throw new Error('Failed to fetch countries');
    countries.value = await response.json();
  } catch (error) {
    showError('Error fetching countries', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Company_Name.trim()) {
    errors.value.Company_Name = 'Company name is required';
  }

  if (isEditing.value && !formData.value.Company_Logo && !formData.value.Company_LogoFile) {
    errors.value.Company_Logo = 'Company logo is required';
  }

  if (!isEditing.value && !formData.value.Company_LogoFile) {
    errors.value.Company_Logo = 'Company logo is required';
  }

  if (!formData.value.Country_Ids.length) {
    errors.value.Country_Ids = 'At least one country is required';
  }

  if (!formData.value.About.trim()) {
    errors.value.About = 'About is required';
  }

  return Object.keys(errors.value).length === 0;
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.Company_LogoFile = file;
    previewImage(file);
  } else {
    errors.value.Company_Logo = 'Please upload a valid image file';
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.Company_LogoFile = file;
    previewImage(file);
  } else {
    errors.value.Company_Logo = 'Please upload a valid image file';
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
  formData.value.Company_LogoFile = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function removeExistingLogo() {
  formData.value.Company_Logo = '';
  formData.value.Company_LogoFile = null;
  imagePreview.value = null;
}

async function handleCreate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Company_Name', formData.value.Company_Name);
    if (formData.value.Company_LogoFile) {
      form.append('Company_Logo', formData.value.Company_LogoFile);
    }
    form.append('About', formData.value.About);
    formData.value.Country_Ids.forEach(Country_Id => {
      form.append('Country_Ids[]', Country_Id);
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
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
  if (company && company.id) {
    console.log("Editing company:", company);
    console.log("Available countries:", countries.value);
    if (company.Country_Names && typeof company.Country_Names === 'string') {
      const countryIds = company.Country_Names.split(', ').map(name => {
        const country = countries.value.find(country => country.name === name);
        return country ? country.id : null;
      }).filter(id => id !== null); // Filter out any null values

      formData.value = {
        ...company,
        Company_LogoFile: null,
        Country_Ids: countryIds
      };
      isEditing.value = true;
    } else {
      console.error("Country_Names is not defined or not a string:", company);
    }
  } else {
    console.error("Company ID is undefined:", company);
  }
}




async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('Company_Name', formData.value.Company_Name);
    if (formData.value.Company_LogoFile) {
      form.append('Company_Logo', formData.value.Company_LogoFile);
    }
    form.append('About', formData.value.About);
    formData.value.Country_Ids.forEach(Country_Id => {
      form.append('Country_Ids[]', Country_Id);
    });

    const response = await fetch(`${API_URL}/${formData.value.id}`, {
      method: 'PUT',
      body: form,
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
  const headers = ['Company Name', 'Company Logo', 'Countries', 'About'];
  const csvContent = [
    headers.join(','),
    ...companies.value.map(company =>
      [company.Company_Name, company.Company_Logo, company.Country_Names, company.About].join(',')
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
