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
                <label class="form-label">Flag URL</label>
                <input 
                  v-model="formData.Flag" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.Flag }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Flag }}</div>
                <div class="form-text">
                  Enter a valid URL for the country's flag image
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

const API_URL = 'http://localhost:900/countries';
const countries = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  Country_Name: '',
  Flag: ''
});

const initialFormState = {
  Country_Name: '',
  Flag: ''
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
  
  if (!formData.value.Flag.trim()) {
    errors.value.Flag = 'Flag URL is required';
  } else if (!isValidUrl(formData.value.Flag)) {
    errors.value.Flag = 'Please enter a valid URL';
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
  formData.value = { ...country };
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
</style>