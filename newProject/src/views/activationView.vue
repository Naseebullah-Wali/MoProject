<template>
    <div class="container mt-5">
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger text-center">
        <h4>Error</h4>
        <p>{{ error }}</p>
      </div>
      <div v-else class="card p-4 shadow-sm">
        <h2 class="text-center">Activate Your Account</h2>
        <form @submit.prevent="activateAccount">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Temporary Password</label>
            <input type="password" id="currentPassword" v-model="formData.currentPassword" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input type="password" id="newPassword" v-model="formData.newPassword" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <input type="password" id="confirmPassword" v-model="formData.confirmPassword" class="form-control" required>
            <div v-if="passwordMismatch" class="text-danger">Passwords do not match</div>
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" id="name" v-model="formData.Name" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input type="tel" id="phone" v-model="formData.Phone" class="form-control">
          </div>
          <div class="mb-3">
            <label for="telegram" class="form-label">Telegram</label>
            <input type="text" id="telegram" v-model="formData.Telegram" class="form-control">
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" id="notifyUpdates" v-model="formData.Notify_on_Updates" class="form-check-input">
            <label for="notifyUpdates" class="form-check-label">Notify me about updates</label>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? 'Activating...' : 'Activate Account' }}
          </button>
        </form>
        <div v-if="success" class="alert alert-success mt-3 text-center">
          <h4>Account Activated!</h4>
          <p>You will be redirected to the login page shortly.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
//   const API_URL = 'http://localhost:900/auth';
  const API_URL = 'https://moproject.onrender.com/auth';
  const token = ref('');
  const loading = ref(true);
  const error = ref(null);
  const success = ref(false);
  const isSubmitting = ref(false);
  const formData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    Name: '',
    Phone: '',
    Telegram: '',
    Notify_on_Updates: false
  });
  
  const passwordMismatch = computed(() => {
    return formData.value.newPassword !== '' && 
           formData.value.confirmPassword !== '' && 
           formData.value.newPassword !== formData.value.confirmPassword;
  });
  
  onMounted(async () => {
    try {
      token.value = route.query.token;
      if (!token.value) {
        error.value = "No activation token provided.";
        loading.value = false;
        return;
      }
      const response = await fetch(`${API_URL}/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.value })
      });
      if (!response.ok) {
        throw new Error((await response.json()).message || 'Invalid token');
      }
      const data = await response.json();
      if (data.userData) {
        formData.value.Name = data.userData.Name || '';
        formData.value.Phone = data.userData.Phone || '';
        formData.value.Telegram = data.userData.Telegram || '';
        formData.value.Notify_on_Updates = data.userData.Notify_on_Updates || false;
      }
      loading.value = false;
    } catch (err) {
      error.value = err.message || "Invalid activation token.";
      loading.value = false;
    }
  });
  
  const activateAccount = async () => {
    if (passwordMismatch.value) return;
    isSubmitting.value = true;
    try {
      const response = await fetch(`${API_URL}/activate-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          currentPassword: formData.value.currentPassword,
          newPassword: formData.value.newPassword,
          profile: {
            Name: formData.value.Name,
            Phone: formData.value.Phone,
            Telegram: formData.value.Telegram,
            Notify_on_Updates: formData.value.Notify_on_Updates
          }
        })
      });
      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to activate account');
      }
      success.value = true;
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      error.value = err.message || "Activation failed.";
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  </style>