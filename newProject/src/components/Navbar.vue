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
          <!-- <li class="nav-item"><router-link class="nav-link" to="/about">Reports</router-link></li> -->
          <li class="nav-item"><router-link class="nav-link" to="/scientific_review">Scientific reviews</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/news">News</router-link></li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown" v-if="isAdmin">
            <button class="btn btn-secondary dropdown-toggle nav-link" type="button" id="adminDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Admin Pages
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
              <li><router-link class="dropdown-item" to="/projects_edit">Manage Projects</router-link></li>
              <li><router-link class="dropdown-item" to="/countries">Manage Countries</router-link></li>
              <li><router-link class="dropdown-item" to="/companiesEdit">Manage Companies</router-link></li>
              <li><router-link class="dropdown-item" to="/statuses">Manage Statuses</router-link></li>
              <li><router-link class="dropdown-item" to="/topic_edit">Manage Topics</router-link></li>
              <!-- <li><router-link class="dropdown-item" to="/user_management">Manage Users</router-link></li> -->
              <!-- <li><router-link class="dropdown-item" to="/projectUpdates_edit">Manage Project Updates</router-link></li> -->
              <li><router-link class="dropdown-item" to="/news_edit">Manage News Edit</router-link></li>
              <li><router-link class="dropdown-item" to="/scientific_reviews_edit">Manage Scientific Reviews Edit</router-link></li>
              <li><router-link class="dropdown-item" to="/project_comments">Manage Project Comments</router-link></li>
              <li><router-link class="dropdown-item" to="/characters">Manage Characters</router-link></li>
              <li><router-link class="dropdown-item" to="/document_edit">Manage documentTypes</router-link></li>
            </ul>
          </li>

          <li class="nav-item dropdown" v-if="isLoggedIn">
            <button class="btn btn-secondary dropdown-toggle nav-link d-flex align-items-center" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="badge bg-danger">{{ notificationCount }}</span>
              <img :src="profilePicture" alt="Profile" class="rounded-circle" style="width: 30px; height: 30px; margin-left: 10px;">
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><router-link class="dropdown-item" to="/edit-profile">Edit Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/bookmarks">Bookmarks</router-link></li>
              <li><router-link class="dropdown-item" to="/logout">Logout</router-link></li>
            </ul>
          </li>

          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/register">Register</router-link>
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
      isAdmin: true, // Set dynamically in real case
      isLoggedIn: true,
      profilePicture: '1.jpg',
      notificationCount: 5,
      isNavbarOpen: false,
    };
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
  },
};
</script>

<style scoped>
.badge {
  font-size: 0.8rem;
  padding: 5px 8px;
  vertical-align: middle;
}

.navbar-toggler {
  border: none;
}
</style>
