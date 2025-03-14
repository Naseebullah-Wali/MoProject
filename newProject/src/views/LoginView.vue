<template>
  <div class="login-container min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-header text-center py-3 bg-white">
              <h3 class="mb-0 fw-bold">Login</h3>
            </div>
            <div class="card-body p-4">
              <!-- Login Form -->
              <form v-if="!forgotPasswordMode" @submit.prevent="login" novalidate>
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    class="form-control" 
                    :class="{'is-invalid': emailError}"
                    v-model="email" 
                    placeholder="Enter your email" 
                    required
                  />
                  <div v-if="emailError" class="invalid-feedback">
                    {{ emailError }}
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      class="form-control" 
                      :class="{'is-invalid': passwordError}"
                      v-model="password" 
                      placeholder="Enter your password" 
                      required
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="togglePasswordVisibility"
                    >
                      <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                    <div v-if="passwordError" class="invalid-feedback">
                      {{ passwordError }}
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end mb-3">
                  <button 
                    type="button" 
                    class="btn btn-link text-dark p-0" 
                    @click="forgotPasswordMode = true"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div v-if="loginError" class="alert alert-danger" role="alert">
                  {{ loginErrorMessage }}
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-dark btn-block w-100" 
                  :disabled="isLoading"
                >
                  <span 
                    v-if="isLoading" 
                    class="spinner-border spinner-border-sm mr-1"
                  ></span>
                  Login
                </button>
              </form>
              
              <!-- Forgot Password Form -->
              <form v-else @submit.prevent="sendPasswordResetEmail" novalidate>
                <div class="mb-3">
                  <label for="resetEmail" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="resetEmail" 
                    class="form-control" 
                    :class="{'is-invalid': resetEmailError}"
                    v-model="resetEmail" 
                    placeholder="Enter your email" 
                    required
                  />
                  <div v-if="resetEmailError" class="invalid-feedback">
                    {{ resetEmailError }}
                  </div>
                </div>
                
                <div v-if="resetEmailSent" class="alert alert-success" role="alert">
                  Please check your email inbox. We've sent a password reset link.
                </div>
                
                <div class="d-flex justify-content-between">
                  <button 
                    type="submit" 
                    class="btn btn-dark" 
                    :disabled="isResetLoading"
                  >
                    <span 
                      v-if="isResetLoading" 
                      class="spinner-border spinner-border-sm mr-1"
                    ></span>
                    Send Reset Link
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-dark" 
                    @click="forgotPasswordMode = false"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      // Login form data
      email: '',
      password: '',
      showPassword: false,
      forgotPasswordMode: false,
      resetEmail: '',
      emailError: '',
      passwordError: '',
      loginError: false,
      loginErrorMessage: '',
      resetEmailError: '',
      resetEmailSent: false,
      isLoading: false,
      isResetLoading: false
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    async login() {
      this.emailError = '';
      this.passwordError = '';
      this.loginError = false;
      if (!this.email) {
        this.emailError = 'Email is required';
        return;
      }
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Invalid email format';
        return;
      }
      
      // Validate password
      if (!this.password) {
        this.passwordError = 'Password is required';
        return;
      }
      this.isLoading = true;
      
      try {
        // console.log(this.email,"email")
        // console.log(this.password,"password")
        // const response = await fetch('http://localhost:900/auth/login', {
        const response = await fetch('https://moproject.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const { user_id, company_id, role, token } = await response.json();
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('company_id', company_id);
        localStorage.setItem('role', role)
        localStorage.setItem('token', token)
        
      
      this.$router.push({ name: 'projects' }).then(()=>{location.reload();})
      
      } catch (error) {
        this.loginError = true;
        this.loginErrorMessage = 'Login failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async sendPasswordResetEmail() {
      // Reset previous errors
      this.resetEmailError = '';
      this.resetEmailSent = false;
      
      // Validate email
      if (!this.resetEmail) {
        this.resetEmailError = 'Email is required';
        return;
      }
      if (!this.validateEmail(this.resetEmail)) {
        this.resetEmailError = 'Invalid email format';
        return;
      }
      
      // Set loading state
      this.isResetLoading = true;
      
      try {
        // Make API call to password reset endpoint
        // const response = await fetch('http://localhost:900/auth/forgot-password', {
        const response = await fetch('https://moproject.onrender.com/forgot-password', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.resetEmail
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send reset link');
        }
        
        // Show success message
        this.resetEmailSent = true;
      } catch (error) {
        this.resetEmailError = 'Failed to send reset link. Please try again.';
      } finally {
        this.isResetLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #f8f9fa;
}

.card {
  border: 1px solid #dee2e6;
}

.card-header {
  border-bottom: 1px solid #dee2e6;
}

.btn-dark {
  transition: all 0.3s ease;
}

.btn-dark:hover {
  opacity: 0.9;
}
</style>