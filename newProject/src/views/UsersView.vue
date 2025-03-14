<template>
  <div class="container mt-5">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="user" class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="mb-4">Edit Profile</h2>
        <form @submit.prevent="updateProfile">
          <!-- Profile Photo Section -->
          <div class="mb-3">
            <label for="photo" class="form-label">Profile Photo</label>
            <div class="d-flex align-items-center">
              <img 
                :src="imagePreview || user.Photo || '/default-avatar.png'" 
                class="rounded-circle me-3" 
                style="width: 100px; height: 100px; object-fit: cover;"
                alt="Profile"
              >
              <input 
                type="file" 
                class="form-control" 
                id="photo" 
                @change="handlePhotoUpload"
                accept="image/*"
              >
            </div>
          </div>

          <!-- Name Input -->
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="editedUser.Name"
              required
            >
          </div>

          <!-- Email (Read-only) -->
          <div class="mb-3">
            <label for="email" class="form-label">Email (Read-only)</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              :value="user.email" 
              readonly
            >
          </div>

          <!-- Company Name (Read-only) -->
          <div class="mb-3">
            <label for="company" class="form-label">Company Name (Read-only)</label>
            <input 
              type="text" 
              class="form-control" 
              id="company" 
              :value="user.Company_Name" 
              readonly
            >
          </div>

          <!-- Phone Input -->
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input 
              type="tel" 
              class="form-control" 
              id="phone" 
              v-model="editedUser.Phone"
            >
          </div>

          <!-- Telegram Input -->
          <div class="mb-3">
            <label for="telegram" class="form-label">Telegram</label>
            <input 
              type="text" 
              class="form-control" 
              id="telegram" 
              v-model="editedUser.Telegram"
            >
          </div>

          <!-- Change Password Button -->
          <div class="mb-3">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showPasswordModal = true"
            >
              Change Password
            </button>
          </div>

          <!-- Save and Cancel Buttons -->
          <div class="d-flex justify-content-between">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isSubmitting"
            >
              <span 
                v-if="isSubmitting" 
                class="spinner-border spinner-border-sm me-1" 
                role="status" 
                aria-hidden="true"
              ></span>
              Save Changes
            </button>
            <button 
              type="button" 
              class="btn btn-outline-secondary" 
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div 
      class="modal fade"
      :class="{ show: showPasswordModal }"
      tabindex="-1" 
      aria-labelledby="passwordModalLabel"
      aria-hidden="true"
      :style="{ display: showPasswordModal ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="passwordModalLabel">Change Password</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="closePasswordModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="currentPassword" 
                  v-model="passwordForm.currentPassword"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="newPassword" 
                  v-model="passwordForm.newPassword"
                  required
                  minlength="8"
                >
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="passwordForm.confirmPassword"
                  required
                  minlength="8"
                >
              </div>
              <div v-if="passwordError" class="alert alert-danger">
                {{ passwordError }}
              </div>
              <div class="modal-footer">
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  @click="closePasswordModal"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isPasswordSubmitting"
                >
                  <span 
                    v-if="isPasswordSubmitting" 
                    class="spinner-border spinner-border-sm me-1" 
                    role="status" 
                    aria-hidden="true"
                  ></span>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div 
      class="modal-backdrop fade" 
      :class="{ show: showPasswordModal }"
      v-if="showPasswordModal"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

// State management
const user = ref(null)
const editedUser = ref({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const isPasswordSubmitting = ref(false)
const error = ref('')
const passwordError = ref(null)
const showPasswordModal = ref(false)
const photoFile = ref(null)
const imagePreview = ref(null)

// Password form state
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Fetch user data
const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      throw new Error('User ID not found')
    }

    // const response = await fetch(`http://localhost:900/users/${userId}`)
    const response = await fetch(`https://moproject.onrender.com/users/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    user.value = userData
    editedUser.value = { ...userData }
    isLoading.value = false
  } catch (err) {
    error.value = err.message
    isLoading.value = false
  }
}

// Lifecycle hook
onMounted(fetchUserData)

// Photo upload handler
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    photoFile.value = file; // Store the file object
    
    // Create a preview of the image using FileReader
    // since you mentioned not wanting to use FileReader for upload
    // but we still need it for preview only
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
    error.value = ''; // Clear any previous error
  } else {
    error.value = 'Please upload a valid image file';
    photoFile.value = null;
    imagePreview.value = null;
  }
}

// Update profile method
const updateProfile = async () => {
  try {
    isSubmitting.value = true;
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    // Create a new FormData instance for the file upload
    const formData = new FormData();
    
    // Add all form fields to FormData
    formData.append('Name', editedUser.value.Name || '');
    formData.append('Phone', editedUser.value.Phone || '');
    formData.append('Telegram', editedUser.value.Telegram || '');
    
    // If there's a new file, append it as 'Photo' which is what your backend expects
    if (photoFile.value) {
      formData.append('Photo', photoFile.value); // Match the field name in your backend
    }
    
    // Include Notify_on_Updates if it exists
    if (editedUser.value.Notify_on_Updates !== undefined) {
      formData.append('Notify_on_Updates', editedUser.value.Notify_on_Updates.toString());
    }

    // Log the formData keys for debugging
    console.log("FormData keys:", [...formData.keys()]);

    // const response = await fetch(`http://localhost:900/users/${userId}/profile`, {
    const response = await fetch(`https://moproject.onrender.com/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${token}`
        // Don't set Content-Type header when using FormData, let the browser set it automatically
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const updatedData = await response.json();
    
    // Update local user data with the response from server
    if (updatedData.user && updatedData.user.length > 0) {
      user.value = { ...user.value, ...updatedData.user[0] };
      
      // Update the edited user data too
      editedUser.value = { ...editedUser.value, ...updatedData.user[0] };
      
      // Clear the image preview
      imagePreview.value = null;
    }
    
    // Reset photo file after successful update
    photoFile.value = null;

    // Show success toast or alert
    showToast('Profile updated successfully!');
  } catch (err) {
    error.value = typeof err === 'string' ? err : err.message || 'An error occurred';
    console.error('Profile update error:', err);
  } finally {
    isSubmitting.value = false;
  }
}

// Change password method
const changePassword = async () => {
  // Reset previous error
  passwordError.value = null

  // Validate password match
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  try {
    isPasswordSubmitting.value = true
    const userId = localStorage.getItem('user_id')
    const token = localStorage.getItem('token')
    
    // const response = await fetch(`http://localhost:900/users/${userId}/password`, {
    const response = await fetch(`https://moproject.onrender.com/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    // Close the modal properly
    closePasswordModal()
    
    // Reset form and show success
    resetPasswordForm()
    showToast('Password changed successfully!')
  } catch (err) {
    passwordError.value = err.message
  } finally {
    isPasswordSubmitting.value = false
  }
}

// Close password modal
const closePasswordModal = () => {
  showPasswordModal.value = false
}

// Reset form to original data
const resetForm = () => {
  editedUser.value = { ...user.value }
  photoFile.value = null
  imagePreview.value = null
  history.back()
}

// Reset password form
const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// Toast notification helper
const showToast = (message) => {
  // Implement toast notification 
  // This is a simple alert, replace with a proper toast library
  alert(message)
}
</script>

<style scoped>
.form-control:read-only {
  background-color: #e9ecef;
  opacity: 1;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
  display: block;
}

.modal-backdrop.show {
  opacity: 0;
}
</style>