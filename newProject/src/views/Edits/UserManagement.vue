<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Users</h1>
          <button
            @click="showInviteModal = true"
            class="btn btn-primary"
          >
            <i class="bi bi-plus"></i> Invite New User
          </button>
        </div>

        <!-- Company Selector -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3">
                <label class="form-label">Select Company</label>
                <select 
                  v-model="selectedCompany" 
                  @change="loadUsers" 
                  class="form-select"
                >
                  <option 
                    v-for="company in companies" 
                    :key="company.id" 
                    :value="company.id"
                  >
                    {{ company.Company_Name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Created at</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.Name || 'N/A' }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ getUserTypeName(user.User_Type_ID) }}</td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td>
                      <button 
                        @click="handleEdit(user)" 
                        class="btn btn-sm btn-outline-primary me-2"
                      >
                        <i class="bi bi-pencil"></i> Edit
                      </button>
                    </td>
                  </tr>
                  <tr v-if="users.length === 0">
                    <td colspan="5" class="text-center py-4 text-muted">
                      No users found in this company
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      class="modal fade"
      :class="{ show: isEditing }"
      tabindex="-1"
      :style="{ display: isEditing ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeEditModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleUpdate">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  v-model="currentUser.Name"
                  class="form-control"
                  :class="{ 'is-invalid': errors.Name }"
                >
                <div class="invalid-feedback">{{ errors.Name }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="currentUser.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                >
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input
                  v-model="currentUser.Phone"
                  class="form-control"
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">Telegram</label>
                <input
                  v-model="currentUser.Telegram"
                  class="form-control"
                >
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Created at</label>
                  <input
                    :value="formatDate(currentUser.createdAt)"
                    class="form-control"
                    readonly
                    disabled
                  >
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Updated at</label>
                  <input
                    :value="currentUser.updatedAt ? formatDate(currentUser.updatedAt) : 'Never'"
                    class="form-control"
                    readonly
                    disabled
                  >
                </div>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input
                    type="checkbox"
                    id="is-deleted"
                    v-model="currentUser.is_deleted"
                    class="form-check-input"
                  >
                  <label for="is-deleted" class="form-check-label">
                    Is Deleted <small class="text-muted">(Editable)</small>
                  </label>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">User Type</label>
                <select
                  v-model="selectedUserTypeId"
                  class="form-select"
                  :class="{ 'is-invalid': errors.User_Type }"
                >
                  <option 
                    v-for="userType in userTypes" 
                    :key="userType.id" 
                    :value="userType.id"
                  >
                    {{ userType.User_Type }}
                  </option>
                </select>
                <div class="invalid-feedback">{{ errors.User_Type }}</div>
              </div>
              
              <div class="modal-footer px-0 pb-0">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeEditModal"
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

    <!-- Invite User Modal -->
    <div
      class="modal fade"
      :class="{ show: showInviteModal }"
      tabindex="-1"
      :style="{ display: showInviteModal ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invite New User</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeInviteModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="sendInvitation">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="newUser.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.newEmail }"
                  placeholder="Type Email here..."
                  required
                >
                <div class="invalid-feedback">{{ errors.newEmail }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">User Type</label>
                <select
                  v-model="newUser.userTypeId"
                  class="form-select"
                  :class="{ 'is-invalid': errors.newUserType }"
                  required
                >
                  <option 
                    v-for="userType in userTypes" 
                    :key="userType.id" 
                    :value="userType.id"
                  >
                    {{ userType.User_Type }}
                  </option>
                </select>
                <div class="invalid-feedback">{{ errors.newUserType }}</div>
              </div>
              
              <div class="alert alert-info">
                <small>
                  This will create a new user in the DB with a random password and send an email to the person with the generated password.
                </small>
              </div>
              
              <div class="modal-footer px-0 pb-0">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeInviteModal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div
      class="modal-backdrop fade"
      :class="{ show: isEditing || showInviteModal }"
      v-if="isEditing || showInviteModal"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// const API_URL = 'http://localhost:900';
const API_URL = 'https://moproject.onrender.com';
const users = ref([]);
const companies = ref([]);
const userTypes = ref([]);
const selectedCompany = ref(null);
const isEditing = ref(false);
const showInviteModal = ref(false);
const loading = ref(false);
const errors = ref({});

const currentUser = ref({
  id: null,
  Name: '',
  email: '',
  Phone: '',
  Telegram: '',
  createdAt: null,
  updatedAt: null,
  is_deleted: false,
  User_Type: null, // This will be populated with ID before sending to API
  User_Type_ID: null, // This is for display/reference purposes
  Company_ID: null
});

// Create a separate ref for the selected user type ID in the edit form
const selectedUserTypeId = ref(null);

// Watch for changes to selectedUserTypeId
const watchSelectedUserTypeId = computed({
  get() {
    return selectedUserTypeId.value;
  },
  set(value) {
    selectedUserTypeId.value = value;
  }
});

const newUser = ref({
  email: '',
  userTypeId: null
});

onMounted(async () => {
  await Promise.all([
    loadCompanies(),
    loadUserTypes()
  ]);
  
  if (companies.value.length > 0) {
    selectedCompany.value = companies.value[0].id;
    await loadUsers();
  }
});

async function loadCompanies() {
  try {
    const response = await fetch(`${API_URL}/companies`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    companies.value = await response.json();
  } catch (error) {
    showError('Error fetching companies', error);
  }
}

async function loadUserTypes() {
  try {
    const response = await fetch(`${API_URL}/user-types`);
    if (!response.ok) throw new Error('Failed to fetch user types');
    userTypes.value = await response.json();
    
    // Set default value for new user if user types are loaded
    if (userTypes.value.length > 0) {
      // Find Employee type by default, or use the first type
      const employeeType = userTypes.value.find(type => type.User_Type === 'Employee');
      newUser.value.userTypeId = employeeType ? employeeType.id : userTypes.value[0].id;
    }
  } catch (error) {
    showError('Error fetching user types', error);
  }
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const allUsers = await response.json();
    // Filter users by company ID
    users.value = allUsers.filter(user => user.Company_ID === selectedCompany.value);
  } catch (error) {
    showError('Error fetching users', error);
  }
}

function handleEdit(user) {
  currentUser.value = { ...user };
  // Set the selected user type ID from the user's User_Type_ID
  selectedUserTypeId.value = user.User_Type_ID;
  isEditing.value = true;
}

function closeEditModal() {
  isEditing.value = false;
  selectedUserTypeId.value = null;
  errors.value = {};
  // Refresh users data to ensure up-to-date information
  loadUsers();
}

function closeInviteModal() {
  showInviteModal.value = false;
  // Reset new user fields but keep the selected user type
  newUser.value = {
    email: '',
    userTypeId: newUser.value.userTypeId
  };
  errors.value = {};
}

function validateEditForm() {
  errors.value = {};
  
  if (!currentUser.value.email?.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(currentUser.value.email)) {
    errors.value.email = 'Please enter a valid email address';
  }
  
  if (!selectedUserTypeId.value) {
    errors.value.User_Type = 'User Type is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

function validateInviteForm() {
  errors.value = {};
  
  if (!newUser.value.email?.trim()) {
    errors.value.newEmail = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(newUser.value.email)) {
    errors.value.newEmail = 'Please enter a valid email address';
  }
  
  if (!newUser.value.userTypeId) {
    errors.value.newUserType = 'User Type is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

async function handleUpdate() {
  if (!validateEditForm()) return;
  
  // Create a payload that sends the user type ID as User_Type
  const payload = {
    ...currentUser.value,
    User_Type: selectedUserTypeId.value // Send the ID as User_Type
  };
  
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/users/${currentUser.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    // Close modal and reload users to ensure data consistency
    closeEditModal();
  } catch (error) {
    console.error('Request payload:', payload);
    showError('Error updating user', error);
  } finally {
    loading.value = false;
  }
}

async function sendInvitation() {
  if (!validateInviteForm()) return;
  
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newUser.value.email,
        User_Type: newUser.value.userTypeId, // Send the ID as User_Type
        Company_ID: selectedCompany.value,
        send_invitation: true,
        Is_Pending: true, // Mark user as pending
        Is_Deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to invite user');
    }

    // Close modal and reload users to ensure data consistency
    closeInviteModal();
    // Reload users to show the newly created user
    await loadUsers();
  } catch (error) {
    console.error('Request payload:', {
      email: newUser.value.email,
      User_Type: newUser.value.userTypeId,
      Company_ID: selectedCompany.value,
      send_invitation: true,
      Is_Pending: true,
      Is_Deleted: false
    });
    showError('Error inviting user', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getUserTypeName(userTypeId) {
  const userType = userTypes.value.find(type => type.id === userTypeId);
  return userType ? userType.User_Type : 'Unknown';
}

function showError(message, error) {
  console.error(error);
  alert(message + ': ' + error.message);
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