<template>
    <footer class="bg-dark text-light text-center py-3 mt-5">
      <div class="container">
        <p class="mb-0">
          © 2025 TRLink - 
          <router-link to="/privacy-policy" class="text-decoration-none text-light">Privacy Policy</router-link> - 
          <router-link to="/disclaimer" class="text-decoration-none text-light">Disclaimer</router-link> - 
          Developed by 
          <a href="https://yourdeveloperwebsite.com" class="text-decoration-none text-light" target="_blank">+++</a>
        </p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
  };
  </script>
  
  <style scoped>
  footer a:hover {
    color: #adb5bd; /* Slight hover effect for links */
  }
  </style>
  