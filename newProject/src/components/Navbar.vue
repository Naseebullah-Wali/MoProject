<template>
     <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Project Management</router-link>
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
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/topics">Topics</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/companies">Companies</router-link>
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
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
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
        isAdmin: false, // You can later update this based on user role (e.g., from auth store or state)
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add custom styles here if needed */
  </style>
  