<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">TRLink</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Left side items -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/projects">Projects</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">Reports</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/companies">Scientific reviews</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/topics">News</router-link>
          </li>
          
        </ul>

        <!-- Right side items -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/users">Users</router-link>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" to="/reviews">Reviews</router-link>
          </li>
          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              id="profileDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
            <span class="badge bg-danger">{{ notificationCount }}</span>
              <img 
                :src="profilePicture" 
                alt="Profile" 
                class="rounded-circle" 
                style="width: 30px; height: 30px; margin-left: 10px;"
              >
              
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><router-link class="dropdown-item" to="/edit-profile">Edit Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/logout">Bookmarks</router-link></li>
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
      // Simulating role-based access (admin check)
      isAdmin: false, 
      isLoggedIn: true, 
      profilePicture: '1.jpg', 
      notificationCount: 5, 
    };
  },
};
</script>

<style scoped>
.badge {
  font-size: 0.8rem;
  padding: 5px 8px;
  vertical-align: middle;
}
</style>
