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
          :exclude-columns="['Post_Content','Project_Number','Developer_Organization','File1','File2','File3','Original_Document','Took_Affect_Date', 'createdAt', 'updatedAt', 'Is_deleted', 'Old_ID', 'wplink', 'Topics', 'Companies', 'Priority', 'CreatedAt','Country_ID','Document_Type','Character_ID','Status_ID','UpdatedAt','Topic', 'No_Longer_Valid_Date','Image']"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #tableActions>
            <button @click="exportToCSV" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-download"></i> Export
            </button>
          </template>
          <template #customActions="{ item }">
            <router-link
              :to="{ path: '/projectUpdates_edit', query: { projectId: item.id } }"
              class="btn btn-outline-info btn-sm"
              title="Project Updates"
            >
              <i class="bi bi-arrow-up-circle"></i>
            </router-link>
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
                  <div v-for="topic in availableTopics" :key="topic.id" class="form-check">
                    <input
                      type="checkbox"
                      :id="'topic-' + topic.id"
                      :value="topic.id"
                      v-model="formData.selectedTopics"
                      class="form-check-input"
                    />
                    <label :for="'topic-' + topic.id" class="form-check-label">{{ topic.Topic }}</label>
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
                      {{ type.Doc_Type }}
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
                      {{ character.Character_name }}
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
                      {{ status.Status_Name }}
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

const API_URL = 'https://moproject.onrender.com/projects';
const COUNTRIES_URL = 'https://moproject.onrender.com/countries';
const COMPANIES_URL = 'https://moproject.onrender.com/companies';
const TOPICS_URL = 'https://moproject.onrender.com/topics';
const DOCUMENT_TYPES_URL = 'https://moproject.onrender.com/document-types';
const CHARACTERS_URL = 'https://moproject.onrender.com/characters';
const STATUSES_URL = 'https://moproject.onrender.com/statuses';
const PROJECT_TOPICS_URL = 'https://moproject.onrender.com/project-topicsRelation';

// State variables
const projects = ref([]);
const countries = ref([]);
const companies = ref([]);
const availableTopics = ref([]);
const documentTypes = ref([]);
const characters = ref([]);
const statuses = ref([]);

const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});
const currentProjectTopics = ref([]);

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
  File1Object: null,
  File2Object: null,
  File3Object: null,
};

onMounted(() => {
  fetchProjects();
  fetchCountries();
  fetchCompanies();
  fetchTopics();
  fetchDocumentTypes();
  fetchCharacters();
  fetchStatuses();
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

async function fetchTopics() {
  try {
    const response = await fetch(TOPICS_URL);
    if (!response.ok) throw new Error('Failed to fetch topics');
    availableTopics.value = await response.json();
  } catch (error) {
    showError('Error fetching topics', error);
  }
}

async function fetchDocumentTypes() {
  try {
    const response = await fetch(DOCUMENT_TYPES_URL);
    if (!response.ok) throw new Error('Failed to fetch document types');
    documentTypes.value = await response.json();
  } catch (error) {
    showError('Error fetching document types', error);
  }
}

async function fetchCharacters() {
  try {
    const response = await fetch(CHARACTERS_URL);
    if (!response.ok) throw new Error('Failed to fetch characters');
    characters.value = await response.json();
  } catch (error) {
    showError('Error fetching characters', error);
  }
}

async function fetchStatuses() {
  try {
    const response = await fetch(STATUSES_URL);
    if (!response.ok) throw new Error('Failed to fetch statuses');
    statuses.value = await response.json();
  } catch (error) {
    showError('Error fetching statuses', error);
  }
}

async function fetchProjectTopics(projectId) {
  try {
    const response = await fetch(`${PROJECT_TOPICS_URL}/project/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch project topics');
    const data = await response.json();
    currentProjectTopics.value = data;
    // Extract topic IDs from the response
    return data.map(item => item.Topic_ID);
  } catch (error) {
    console.error('Error fetching project topics:', error);
    showError('Error fetching project topics', error);
    return [];
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

async function handleEdit(project) {
  // Fetch related topics from the Project_topics table
  const topicIds = await fetchProjectTopics(project.id);

  // Format dates if needed
  const projectDate = project.Project_Date ? formatDateForInput(project.Project_Date) : '';
  const tookAffectDate = project.Took_Affect_Date ? formatDateForInput(project.Took_Affect_Date) : '';
  const noLongerValidDate = project.No_Longer_Valid_Date ? formatDateForInput(project.No_Longer_Valid_Date) : '';

  formData.value = {
    ...project,
    Project_Date: projectDate,
    Took_Affect_Date: tookAffectDate,
    No_Longer_Valid_Date: noLongerValidDate,
    selectedTopics: topicIds,
    File1Object: null,
    File2Object: null,
    File3Object: null
  };

  isEditing.value = true;
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
    // Keep the original Topic field for backward compatibility if needed
    formData.value.Topic = formData.value.selectedTopics.join(',');

    const form = new FormData();

    // Add all text fields
    Object.keys(formData.value).forEach(key => {
      // Skip file objects and arrays as they're handled separately
      if (
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

    // Create the project
    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project');
    }

    // Get the created project with its ID
    const createdProject = await response.json();
    const projectId = createdProject.ID || createdProject.id;

    // Create topic relationships in the Project_Topics table
    if (formData.value.selectedTopics && formData.value.selectedTopics.length > 0) {
      await createProjectTopicRelations(projectId, formData.value.selectedTopics);
    }

    // Send notification about the new project
    try {
      const companyId = localStorage.getItem('companyId');
      const countryId = formData.value.Country_ID || formData.value.countryId;
      
      await fetch('https://moproject.onrender.com/notify/new-project', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countryId: countryId,
          projectName: formData.value.Post_Title,
          projectId: projectId
        }),
      });
    } catch (notificationError) {
      // Log but don't block the flow if notification fails
      console.error('Error sending project notifications:', notificationError);
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

async function createProjectTopicRelations(projectId, topicIds) {
  const createPromises = topicIds.map(topicId => {
    return fetch(PROJECT_TOPICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Project_ID: projectId,
        Topic_ID: topicId
      }),
    });
  });

  try {
    const results = await Promise.allSettled(createPromises);

    // Log any failures for debugging
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to create relation for topic ${topicIds[index]}:`, result.reason);
      }
    });
  } catch (error) {
    console.error('Error creating project topic relations:', error);
    throw error;
  }
}

async function deleteProjectTopicRelations(projectId, exceptTopicIds = []) {
  try {
    // Get current topic relations
    const response = await fetch(`${PROJECT_TOPICS_URL}/project/${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch project topics for deletion');

    const currentRelations = await response.json();

    // Filter out relations that should be kept
    const relationsToDelete = currentRelations.filter(relation =>
      !exceptTopicIds.includes(relation.Topic_ID)
    );

    // Delete each relation that's no longer needed
    const deletePromises = relationsToDelete.map(relation => {
      return fetch(`${PROJECT_TOPICS_URL}/${relation.id}`, {
        method: 'DELETE'
      });
    });

    await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('Error deleting project topic relations:', error);
    throw error;
  }
}

async function handleUpdate() {
  if (!validateForm()) return;

  loading.value = true;
  try {
    // Keep the original Topic field for backward compatibility if needed
    formData.value.Topic = formData.value.selectedTopics.join(',');

    const form = new FormData();

    // Add all text fields
    Object.keys(formData.value).forEach(key => {
      // Skip file objects and arrays as they're handled separately
      if (
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
    if (formData.value.File1Object) {
      form.append('File1', formData.value.File1Object);
    }

    if (formData.value.File2Object) {
      form.append('File2', formData.value.File2Object);
    }

    if (formData.value.File3Object) {
      form.append('File3', formData.value.File3Object);
    }

    // Update the project
    const response = await fetch(`${API_URL}/${formData.value.id}`, {
      method: 'PUT',
      body: form,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update project');
    }

    // Update topic relationships - efficient approach
    const projectId = formData.value.id;
    const selectedTopics = formData.value.selectedTopics || [];

    // Find current topics from when we edited the project
    const currentTopicIds = currentProjectTopics.value.map(item => item.Topic_ID);

    // Find topics to add (in selected but not in current)
    const topicsToAdd = selectedTopics.filter(id => !currentTopicIds.includes(id));

    // Find topics to keep (in both selected and current)
    const topicsToKeep = selectedTopics.filter(id => currentTopicIds.includes(id));

    // Delete relations that are no longer needed
    await deleteProjectTopicRelations(projectId, topicsToKeep);

    // Create new relations for new topics
    if (topicsToAdd.length > 0) {
      await createProjectTopicRelations(projectId, topicsToAdd);
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
    // Delete the project topic relations first
    await deleteProjectTopicRelations(id, []);

    // Then delete the project
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
  currentProjectTopics.value = [];
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
