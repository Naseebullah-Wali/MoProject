<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Projects</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <i class="bi bi-plus"></i> Add Project
          </button>
        </div>

        <!-- Table Component --> 
        <TableComponent
          :data="projects"
          :exclude-columns="['id', 'createdAt', 'updatedAt', 'Is_deleted', 'ID', 'Old_ID', 'wplink', 'Topics', 'Companies', 'Priority', 'CreatedAt','Country_ID','Document_Type','Character_ID','Status_ID','UpdatedAt','Topic']"
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Edit Project' : 'Add New Project' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
              <!-- Basic Information -->
              <div class="mb-3">
                <label class="form-label">Project Title *</label>
                <input
                  v-model="formData.Post_Title"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Post_Title }"
                  required
                />
                <div class="invalid-feedback">{{ errors.Post_Title }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Content *</label>
                <textarea
                  v-model="formData.Post_Content"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Post_Content }"
                  rows="5"
                  required
                ></textarea>
                <div class="invalid-feedback">{{ errors.Post_Content }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Topics</label>
                <div class="d-flex flex-wrap gap-2">
                  <div v-for="(topic, index) in availableTopics" :key="index" class="form-check">
                    <input 
                      type="checkbox" 
                      :id="'topic-' + index" 
                      :value="topic" 
                      v-model="formData.selectedTopics"
                      class="form-check-input"
                    />
                    <label :for="'topic-' + index" class="form-check-label">{{ topic }}</label>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Project Date</label>
                  <input
                    type="date"
                    v-model="formData.Project_Date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Project_Date }"
                  />
                  <div class="invalid-feedback">{{ errors.Project_Date }}</div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">Project Number</label>
                  <input
                    v-model="formData.Project_Number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Project_Number }"
                  />
                  <div class="invalid-feedback">{{ errors.Project_Number }}</div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Developer Organization *</label>
                <input
                  v-model="formData.Developer_Organization"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Developer_Organization }"
                  required
                />
                <div class="invalid-feedback">{{ errors.Developer_Organization }}</div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Country *</label>
                  <select
                    v-model="formData.Country_ID"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Country_ID }"
                    required
                  >
                    <option value="">Select a country</option>
                    <option v-for="country in countries" :key="country.id" :value="country.id">
                      {{ country.Country_Name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.Country_ID }}</div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">Document Type *</label>
                  <select
                    v-model="formData.Document_Type"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Document_Type }"
                    required
                  >
                    <option value="">Select document type</option>
                    <option v-for="type in documentTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.Document_Type }}</div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Character *</label>
                  <select
                    v-model="formData.Character_ID"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Character_ID }"
                    required
                  >
                    <option value="">Select character</option>
                    <option v-for="character in characters" :key="character.id" :value="character.id">
                      {{ character.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.Character_ID }}</div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status *</label>
                  <select
                    v-model="formData.Status_ID"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Status_ID }"
                    required
                  >
                    <option value="">Select status</option>
                    <option v-for="status in statuses" :key="status.id" :value="status.id">
                      {{ status.name }}
                    </option>
                  </select>
                  <div class="invalid-feedback">{{ errors.Status_ID }}</div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Took Effect Date</label>
                  <input
                    type="date"
                    v-model="formData.Took_Affect_Date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Took_Affect_Date }"
                  />
                  <div class="invalid-feedback">{{ errors.Took_Affect_Date }}</div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label class="form-label">No Longer Valid Date</label>
                  <input
                    type="date"
                    v-model="formData.No_Longer_Valid_Date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.No_Longer_Valid_Date }"
                  />
                  <div class="invalid-feedback">{{ errors.No_Longer_Valid_Date }}</div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Original Document</label>
                <input
                  v-model="formData.Original_Document"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Original_Document }"
                />
                <div class="invalid-feedback">{{ errors.Original_Document }}</div>
              </div>
              
              <!-- File uploads -->
              <div class="mb-3">
                <label class="form-label">File 1</label>
                <input
                  type="file"
                  @change="handleFile1Change"
                  class="form-control"
                  :class="{ 'is-invalid': errors.File1 }"
                />
                <div v-if="formData.File1" class="mt-2">
                  <span>Current file: {{ getFileName(formData.File1) }}</span>
                </div>
                <div class="invalid-feedback">{{ errors.File1 }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">File 2</label>
                <input
                  type="file"
                  @change="handleFile2Change"
                  class="form-control"
                  :class="{ 'is-invalid': errors.File2 }"
                />
                <div v-if="formData.File2" class="mt-2">
                  <span>Current file: {{ getFileName(formData.File2) }}</span>
                </div>
                <div class="invalid-feedback">{{ errors.File2 }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">File 3</label>
                <input
                  type="file"
                  @change="handleFile3Change"
                  class="form-control"
                  :class="{ 'is-invalid': errors.File3 }"
                />
                <div v-if="formData.File3" class="mt-2">
                  <span>Current file: {{ getFileName(formData.File3) }}</span>
                </div>
                <div class="invalid-feedback">{{ errors.File3 }}</div>
              </div>
              
              <!-- Image upload -->
              <div class="mb-3">
                <label class="form-label">Image</label>
                <input
                  type="file"
                  @change="handleImageChange"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Image }"
                  accept="image/*"
                />
                <div v-if="imagePreview" class="mt-2">
                  <img :src="imagePreview" alt="Image Preview" class="img-fluid" style="max-height: 200px;" />
                </div>
                <div v-else-if="formData.Image" class="mt-2">
                  <img :src="formData.Image" alt="Current Image" class="img-fluid" style="max-height: 200px;" />
                </div>
                <div class="invalid-feedback">{{ errors.Image }}</div>
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
import { ref, onMounted, computed } from 'vue';
import TableComponent from '../../components/TableComponent.vue';

// const API_URL = 'http://localhost:900/projects';
// const COUNTRIES_URL = 'http://localhost:900/countries';
// const COMPANIES_URL = 'http://localhost:900/companies';
const API_URL = 'https://moproject.onrender.com/projects';
const COUNTRIES_URL = 'https://moproject.onrender.com/countries';
const COMPANIES_URL = 'https://moproject.onrender.com/companies';


const projects = ref([]);
const countries = ref([]);
const companies = ref([]);
const availableTopics = ref([
  'Environment', 
  'Energy', 
  'Water', 
  'Agriculture', 
  'Infrastructure', 
  'Health', 
  'Education', 
  'Economy',
  'Social Development',
  'Technology'
]);

const documentTypes = ref([
  { id: 1, name: 'Law' },
  { id: 2, name: 'Decree' },
  { id: 13, name: 'Постановление' },
  // Add more document types as needed
]);
const characters = ref([
  { id: 1, name: 'Required' },
  { id: 2, name: 'Optional' },
  // Add more characters as needed
]);
const statuses = ref([
  { id: 1, name: 'Draft' },
  { id: 2, name: 'Under Review' },
  { id: 3, name: 'Approved' },
  { id: 4, name: 'Open for comments' },
  // Add more statuses as needed
]);

const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const imagePreview = ref(null);

const formData = ref({
  Post_Title: '',
  Post_Content: '',
  selectedTopics: [],
  Topic: '',
  Project_Date: '',
  Project_Number: '',
  Developer_Organization: '',
  Country_ID: '',
  Document_Type: '',
  Character_ID: '',
  Status_ID: '',
  Original_Document: '',
  Took_Affect_Date: '',
  No_Longer_Valid_Date: '',
  File1: '',
  File2: '',
  File3: '',
  Image: null,
  ImageFile: null,
  File1Object: null,
  File2Object: null,
  File3Object: null,
});

const initialFormState = {
  Post_Title: '',
  Post_Content: '',
  selectedTopics: [],
  Topic: '',
  Project_Date: '',
  Project_Number: '',
  Developer_Organization: '',
  Country_ID: '',
  Document_Type: '',
  Character_ID: '',
  Status_ID: '',
  Original_Document: '',
  Took_Affect_Date: '',
  No_Longer_Valid_Date: '',
  File1: '',
  File2: '',
  File3: '',
  Image: null,
  ImageFile: null,
  File1Object: null,
  File2Object: null,
  File3Object: null,
};

onMounted(() => {
  fetchProjects();
  fetchCountries();
  fetchCompanies();
});

function getFileName(path) {
  if (!path) return '';
  return path.split('/').pop();
}

async function fetchProjects() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    
    // Process data to add truncated content for display
    projects.value = data.map(project => ({
      ...project,
      Post_Content: truncateText(project.Post_Content, 500)
    }));
  } catch (error) {
    showError('Error fetching projects', error);
  }
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
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

async function fetchCompanies() {
  try {
    const response = await fetch(COMPANIES_URL);
    if (!response.ok) throw new Error('Failed to fetch companies');
    companies.value = await response.json();
  } catch (error) {
    showError('Error fetching companies', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Post_Title?.trim()) {
    errors.value.Post_Title = 'Project title is required';
  }

  if (!formData.value.Post_Content?.trim()) {
    errors.value.Post_Content = 'Content is required';
  }

  if (!formData.value.Developer_Organization?.trim()) {
    errors.value.Developer_Organization = 'Developer organization is required';
  }

  if (!formData.value.Country_ID) {
    errors.value.Country_ID = 'Country is required';
  }

  if (!formData.value.Document_Type) {
    errors.value.Document_Type = 'Document type is required';
  }

  if (!formData.value.Character_ID) {
    errors.value.Character_ID = 'Character is required';
  }

  if (!formData.value.Status_ID) {
    errors.value.Status_ID = 'Status is required';
  }

  return Object.keys(errors.value).length === 0;
}

function handleImageChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.ImageFile = file;
    previewImage(file);
  } else if (file) {
    errors.value.Image = 'Please upload a valid image file';
  }
}

function handleFile1Change(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.File1Object = file;
  }
}

function handleFile2Change(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.File2Object = file;
  }
}

function handleFile3Change(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.File3Object = file;
  }
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.value = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleEdit(project) {
  console.log("Editing project:", project);
  
  // Prepare selectedTopics from comma-separated string
  let selectedTopics = [];
  if (project.Topic) {
    selectedTopics = project.Topic.split(',').map(topic => topic.trim()).filter(topic => topic);
  }
  
  // Format dates if needed
  const projectDate = project.Project_Date ? formatDateForInput(project.Project_Date) : '';
  const tookAffectDate = project.Took_Affect_Date ? formatDateForInput(project.Took_Affect_Date) : '';
  const noLongerValidDate = project.No_Longer_Valid_Date ? formatDateForInput(project.No_Longer_Valid_Date) : '';
  
  formData.value = {
    ...project,
    Project_Date: projectDate,
    Took_Affect_Date: tookAffectDate,
    No_Longer_Valid_Date: noLongerValidDate,
    selectedTopics: selectedTopics,
    ImageFile: null,
    File1Object: null,
    File2Object: null,
    File3Object: null
  };
  
  isEditing.value = true;
  imagePreview.value = null;
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  // Check if it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Date parsing error:", e);
    return '';
  }
}

async function handleCreate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    // Process topics from selectedTopics array to comma-separated string
    formData.value.Topic = formData.value.selectedTopics.join(',');
    
    const form = new FormData();
    
    // Add all text fields
    Object.keys(formData.value).forEach(key => {
      // Skip file objects and arrays as they're handled separately
      if (
        key !== 'ImageFile' && 
        key !== 'File1Object' && 
        key !== 'File2Object' && 
        key !== 'File3Object' && 
        key !== 'selectedTopics' &&
        formData.value[key] !== null && 
        formData.value[key] !== undefined
      ) {
        form.append(key, formData.value[key]);
      }
    });
    
    // Add files if they exist
    if (formData.value.ImageFile) {
      form.append('Image', formData.value.ImageFile);
    }
    
    if (formData.value.File1Object) {
      form.append('File1', formData.value.File1Object);
    }
    
    if (formData.value.File2Object) {
      form.append('File2', formData.value.File2Object);
    }
    
    if (formData.value.File3Object) {
      form.append('File3', formData.value.File3Object);
    }

    // Debug - log form data before sending
    for (let pair of form.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project');
    }

    await fetchProjects();
    closeModal();
  } catch (error) {
    console.error('Error creating project:', error);
    showError('Error creating project', error);
  } finally {
    loading.value = false;
  }
}

async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    // Process topics from selectedTopics array to comma-separated string
    formData.value.Topic = formData.value.selectedTopics.join(',');
    
    const form = new FormData();
    
    // Add all text fields
    Object.keys(formData.value).forEach(key => {
      // Skip file objects and arrays as they're handled separately
      if (
        key !== 'ImageFile' && 
        key !== 'File1Object' && 
        key !== 'File2Object' && 
        key !== 'File3Object' && 
        key !== 'selectedTopics' &&
        formData.value[key] !== null && 
        formData.value[key] !== undefined
      ) {
        form.append(key, formData.value[key]);
      }
    });
    
    // Add files if they exist
    if (formData.value.ImageFile) {
      form.append('Image', formData.value.ImageFile);
    }
    
    if (formData.value.File1Object) {
      form.append('File1', formData.value.File1Object);
    }
    
    if (formData.value.File2Object) {
      form.append('File2', formData.value.File2Object);
    }
    
    if (formData.value.File3Object) {
      form.append('File3', formData.value.File3Object);
    }

    // Debug - log form data before sending
    for (let pair of form.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await fetch(`${API_URL}/${formData.value.ID}`, {
      method: 'PUT',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update project');
    }

    await fetchProjects();
    closeModal();
  } catch (error) {
    console.error('Error updating project:', error);
    showError('Error updating project', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete project');

    await fetchProjects();
  } catch (error) {
    showError('Error deleting project', error);
  }
}

function closeModal() {
  showCreateModal.value = false;
  isEditing.value = false;
  formData.value = { ...initialFormState };
  errors.value = {};
  imagePreview.value = null;
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
}

function exportToCSV() {
  const headers = [
    'Project Title', 
    'Topic', 
    'Project Date', 
    'Project Number', 
    'Developer Organization',
    'Country',
    'Document Type',
    'Character',
    'Status'
  ];
  
  const csvContent = [
    headers.join(','),
    ...projects.value.map(project =>
      [
        `"${project.Post_Title?.replace(/"/g, '""') || ''}"`,
        `"${project.Topic?.replace(/"/g, '""') || ''}"`,
        `"${project.Project_Date || ''}"`,
        `"${project.Project_Number?.replace(/"/g, '""') || ''}"`,
        `"${project.Developer_Organization?.replace(/"/g, '""') || ''}"`,
        `"${project.Country_Name?.replace(/"/g, '""') || ''}"`,
        `"${project.Document_Type_Name?.replace(/"/g, '""') || ''}"`,
        `"${project.Character_name?.replace(/"/g, '""') || ''}"`,
        `"${project.Status_Name?.replace(/"/g, '""') || ''}"`,
      ].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'projects.csv';
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
</style>