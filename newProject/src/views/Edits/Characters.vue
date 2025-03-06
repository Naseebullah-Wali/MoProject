<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Characters</h1>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Add Character
          </button>
        </div>

        <!-- Table Component -->
        <TableComponent
          :data="characters"
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
              {{ isEditing ? 'Edit Character' : 'Add New Character' }}
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
                <label class="form-label">Character Name</label>
                <input
                  v-model="formData.Character_name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Character_name }"
                  required
                >
                <div class="invalid-feedback">{{ errors.Character_name }}</div>
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

// const API_URL = 'http://localhost:900/characters';
const API_URL = 'https://moproject.onrender.com/characters';
const characters = ref([]);
const showCreateModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  Character_name: ''
});

const initialFormState = {
  Character_name: ''
};

onMounted(fetchCharacters);

async function fetchCharacters() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch characters');
    characters.value = await response.json();
  } catch (error) {
    showError('Error fetching characters', error);
  }
}

function validateForm() {
  errors.value = {};

  if (!formData.value.Character_name.trim()) {
    errors.value.Character_name = 'Character name is required';
  }

  return Object.keys(errors.value).length === 0;
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
      throw new Error(errorData.message || 'Failed to create character');
    }

    await fetchCharacters();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error creating character', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(character) {
  formData.value = { ...character };
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
      throw new Error(errorData.message || 'Failed to update character');
    }

    await fetchCharacters();
    closeModal();
  } catch (error) {
    console.error('Request payload:', formData.value);
    console.error('Response:', error);
    showError('Error updating character', error);
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this character?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete character');

    await fetchCharacters();
  } catch (error) {
    showError('Error deleting character', error);
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
  const headers = ['Character Name'];
  const csvContent = [
    headers.join(','),
    ...characters.value.map(character =>
      [character.Character_name].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'characters.csv';
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
