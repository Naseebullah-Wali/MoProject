<template>
    <div class="container mt-5 pt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-dark text-white">
              <h4 class="mb-0">Reset Password</h4>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div v-if="loading" class="text-center my-4">
                <div class="spinner-border text-dark" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Verifying your reset token...</p>
              </div>
              
              <!-- Success Alert -->
              <div v-if="resetSuccess" class="alert alert-success">
                Password has been successfully reset. Redirecting to login page...
              </div>
              
              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <!-- Reset Password Form -->
              <form @submit.prevent="resetPassword" v-if="!loading && !resetSuccess && !error">
                <div class="mb-3">
                  <label for="newPassword" class="form-label">New Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="newPassword" 
                    v-model="newPassword"
                    :class="{'is-invalid': formErrors.newPassword}"
                    required
                  >
                  <div class="invalid-feedback" v-if="formErrors.newPassword">
                    {{ formErrors.newPassword }}
                  </div>
                  <small class="form-text text-muted">
                    Password must be at least 8 characters long and contain a mix of letters and numbers.
                  </small>
                </div>
                
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="confirmPassword"
                    :class="{'is-invalid': formErrors.confirmPassword}"
                    required
                  >
                  <div class="invalid-feedback" v-if="formErrors.confirmPassword">
                    {{ formErrors.confirmPassword }}
                  </div>
                </div>
                
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-dark" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  // Constants
  // const API_URL = 'http://localhost:900';
  const API_URL = 'https://moproject.onrender.com';
  
  // Router
  const route = useRoute();
  const router = useRouter();
  
  // State
  const token = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const loading = ref(true);
  const error = ref('');
  const resetSuccess = ref(false);
  const isSubmitting = ref(false);
  const formErrors = ref({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Lifecycle hooks
  onMounted(async () => {
    try {
      token.value = route.query.token;
            if (!token.value) {
        error.value = "No reset token provided.";
        loading.value = false;
        return;
      }
      loading.value = false;
      try {
        // Verify token with API
        const response = await fetch(`${API_URL}/auth/verify-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.value })
        });
        console.log(response)
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid token');
        }
        
        // Token is valid
        loading.value = false;
      } catch (err) {
        console.error('Token verification error:', err);
        error.value = "Unable to verify token. Please request a new password reset link.";
        loading.value = false;
        
        // Redirect to login after delay
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
      
      
    } catch (err) {
      console.error('Setup error:', err);
      error.value = "An error occurred. Please try again.";
      loading.value = false;
    }
  });
  
  // Methods
  const validateForm = () => {
    let isValid = true;
    formErrors.value = {
      newPassword: '',
      confirmPassword: ''
    };
    
    // Validate password length and complexity
    if (newPassword.value.length < 8) {
      formErrors.value.newPassword = 'Password must be at least 8 characters long';
      isValid = false;
    }
    
    // Validate password match
    if (newPassword.value !== confirmPassword.value) {
      formErrors.value.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    return isValid;
  };
  
  const resetPassword = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    isSubmitting.value = true;
    
    try {
      // Send password reset request
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          newPassword: newPassword.value
        })
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // If not JSON, just use the status text
        if (!response.ok) {
          throw new Error('Server error. Please try again later.');
        }
      }
      
      if (!response.ok) {
        throw new Error(responseData?.message || 'Password reset failed');
      }
      
      // Handle successful reset
      resetSuccess.value = true;
      
      // Redirect to login page after delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      error.value = err.message || 'An error occurred while resetting your password. Please try again.';
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  .card {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .card-header {
    font-weight: 500;
  }
  </style>