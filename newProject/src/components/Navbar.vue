<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="Logo" style="width: 30px; height: 30px; margin-right: 8px;">
        TRLink
      </router-link>
      <button class="navbar-toggler" type="button" @click="toggleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div :class="['collapse', 'navbar-collapse', { show: isNavbarOpen }]" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item"><router-link class="nav-link" to="/projects">Projects</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/scientific_review">Scientific reviews</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/news">News</router-link></li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <!-- Editor Pages Dropdown -->
          <li class="nav-item dropdown" v-if="userRole === 'Editor'">
            <button class="btn btn-secondary dropdown-toggle nav-link" type="button" id="editorDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Editor Pages
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="editorDropdown">
              <li><router-link class="dropdown-item" to="/projects_edit">Manage Projects</router-link></li>
              <li><router-link class="dropdown-item" to="/news_edit">Manage News</router-link></li>
              <li><router-link class="dropdown-item" to="/scientific_reviews_edit">Manage Scientific Reviews</router-link></li>
              <li><router-link class="dropdown-item" to="/project_comments">Manage Project Comments</router-link></li>
            </ul>
          </li>

          <li class="nav-item dropdown" v-if="userRole === 'Admin' || userRole === 'Owner'">
            <button class="btn btn-secondary dropdown-toggle nav-link" type="button" id="adminDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Admin Pages
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
              <li><router-link class="dropdown-item" to="/countries">Manage Countries</router-link></li>
              <li><router-link class="dropdown-item" to="/companiesEdit">Manage Companies</router-link></li>
              <li><router-link class="dropdown-item" to="/statuses">Manage Statuses</router-link></li>
              <li><router-link class="dropdown-item" to="/topic_edit">Manage Topics</router-link></li>
              <li><router-link class="dropdown-item" to="/user_management">Manage Users</router-link></li>
              <li><router-link class="dropdown-item" to="/characters">Manage Characters</router-link></li>
              <li><router-link class="dropdown-item" to="/document_edit">Manage documentTypes</router-link></li>
              <li><router-link class="dropdown-item" to="/projects_edit">Manage Projects</router-link></li>
              <li><router-link class="dropdown-item" to="/scientific_reviews_edit">Manage Scientific Reviews</router-link></li>
              <li><router-link class="dropdown-item" to="/news_edit">Manage News</router-link></li>
              <li><router-link class="dropdown-item" to="/project_comments">Manage Project Comments</router-link></li>
            </ul>
          </li>

          <!-- User Profile Dropdown when logged in -->
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <button class="btn btn-secondary dropdown-toggle nav-link d-flex align-items-center" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img :src="userPhoto" alt="Profile" class="rounded-circle" style="width: 30px; height: 30px;">
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><router-link class="dropdown-item" to="/users">Edit Profile</router-link></li>
              <li><a class="dropdown-item" href="#" @click="confirmLogout">Logout</a></li>
            </ul>
          </li>

          <!-- Login option when not logged in -->
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false,
      userRole: '',
      userId: '',
      userPhoto: '1.jpg', // Default avatar
      isNavbarOpen: false,
    };
  },
  
  created() {
    // Initial check
    // this.checkAuthStatus();
    
    // Set up a listener to check authentication when localStorage changes
    window.addEventListener('storage', this.checkAuthStatus);
  },
  
  mounted() {
    // Add a check after component is mounted to ensure login state is properly detected
    setTimeout(() => {
      this.checkAuthStatus();
    }, 500);
  },
  
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('storage', this.checkAuthStatus);
  },
  
  methods: {
    checkAuthStatus() {
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    this.isAuthenticated = Boolean(userId && userRole && token);
    this.userId = userId || '';
    this.userRole = userRole || '';

    const publicPages = ['/login', '/reset-password', '/activate-account'];

    if (!this.isAuthenticated && !publicPages.some(page => this.$route.path.startsWith(page))) {
      this.$router.push('/login');
    }

    if (this.isAuthenticated) {
      this.fetchUserPhoto();
      this.checkPageAccess();
    }
    },

    
    fetchUserPhoto() {
      // Simple fetch request to get user data
      // fetch('http://localhost:900/users')
        fetch('https://moproject.onrender.com/users')
        .then(response => response.json())
        .then(users => {
          const currentUser = users.find(user => user.id.toString() === this.userId);
          if (currentUser && currentUser.Photo) {
            this.userPhoto = currentUser.Photo;
          }
        })
        .catch(error => {
          console.error('Error fetching user photo:', error);
        });
    },
    
    checkPageAccess() {
    // Skip access check for login page
    if (this.$route.path === '/login') return;

    // Define accessible paths based on user role
    let hasAccess = false;
    const currentPath = this.$route.path;

    // Basic paths for all authenticated users
    const basicPaths = ['/projects', '/scientific_review', '/news', '/users'];

    // Additional paths accessible to all roles
    const additionalPaths = ['/news_details/:id', '/reviews/:id'];

    if (this.userRole === 'Employee') {
        hasAccess = basicPaths.includes(currentPath) ||
                    additionalPaths.some(path => currentPath.startsWith(path.replace(':id', ''))) ||
                    currentPath.startsWith('/projects/') ||
                    currentPath.startsWith('/scientific_review/');
    } else if (this.userRole === 'Editor') {
        const editorPaths = [...basicPaths, '/projects_edit', '/news_edit',
                            '/scientific_reviews_edit', '/project_comments'];
        hasAccess = editorPaths.includes(currentPath) ||
                    additionalPaths.some(path => currentPath.startsWith(path.replace(':id', ''))) ||
                    currentPath.startsWith('/projects/') ||
                    currentPath.startsWith('/scientific_review/');
    } else if (this.userRole === 'Admin' || this.userRole === 'Owner') {
        // Admins and owners have access to all pages
        hasAccess = true;
    }

    // Redirect to projects page if no access
    if (!hasAccess) {
        this.$router.push('/projects');
    }
    },

    
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    
    confirmLogout() {
      if (confirm('Are you sure you want to logout?')) {
        // Clear all authentication data
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        localStorage.removeItem('company_id');
        localStorage.removeItem('token');
        
        // Update component state
        this.isAuthenticated = false;
        this.userId = '';
        this.userRole = '';
        
        // Redirect to login page
        this.$router.push('/login');
      }
    }
  },
  
  // Watch for route changes to check access
  watch: {
    '$route'() {
      if (this.isAuthenticated) {
        this.checkPageAccess();
      }
    }
  }
};
</script>

<style scoped>
.navbar-toggler {
  border: none;
}
</style>