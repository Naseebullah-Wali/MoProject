<template>
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">Document Types</h1>
            <button @click="showCreateModal = true" class="btn btn-primary">
              <i class="bi bi-plus"></i> Add Document Type
            </button>
          </div>
  
          <!-- Table Component -->
          <TableComponent
            :data="documentTypes"
            :exclude-columns="['id', 'Is_Deleted']"
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
                {{ isEditing ? 'Edit Document Type' : 'Add New Document Type' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="isEditing ? handleUpdate() : handleCreate()">
                <div class="mb-3">
                  <label class="form-label">Document Type Name *</label>
                  <input
                    v-model="formData.Doc_Type"
                    class="form-control"
                    :class="{ 'is-invalid': errors.Doc_Type }"
                    required
                  />
                  <div class="invalid-feedback">{{ errors.Doc_Type }}</div>
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
  
  const API_URL = 'http://localhost:900/document-types';
  const documentTypes = ref([]);
  const showCreateModal = ref(false);
  const isEditing = ref(false);
  const loading = ref(false);
  const errors = ref({});
  
  const formData = ref({
    Doc_Type: '',
  });
  
  const initialFormState = {
    Doc_Type: '',
  };
  
  onMounted(() => {
    fetchDocumentTypes();
  });
  
  async function fetchDocumentTypes() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch document types');
      documentTypes.value = await response.json();
    } catch (error) {
      showError('Error fetching document types', error);
    }
  }
  
  function validateForm() {
    errors.value = {};
  
    if (!formData.value.Doc_Type.trim()) {
      errors.value.Doc_Type = 'Document type name is required';
    }
  
    return Object.keys(errors.value).length === 0;
  }
  
  async function handleCreate() {
    if (!validateForm()) return;
  
    loading.value = true;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create document type');
      }
  
      await fetchDocumentTypes();
      closeModal();
    } catch (error) {
      showError('Error creating document type', error);
    } finally {
      loading.value = false;
    }
  }
  
  function handleEdit(docType) {
    isEditing.value = true;
    formData.value = { ...docType };
  }
  
  async function handleUpdate() {
    if (!validateForm()) return;
  
    loading.value = true;
    try {
      const response = await fetch(`${API_URL}/${formData.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update document type');
      }
  
      await fetchDocumentTypes();
      closeModal();
    } catch (error) {
      showError('Error updating document type', error);
    } finally {
      loading.value = false;
    }
  }
  
  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this document type?')) return;
  
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete document type');
  
      await fetchDocumentTypes();
    } catch (error) {
      showError('Error deleting document type', error);
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
    const headers = ['Document Type'];
    const csvContent = [
      headers.join(','),
      ...documentTypes.value.map(docType => [docType.Doc_Type].join(',')),
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document_types.csv';
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
  