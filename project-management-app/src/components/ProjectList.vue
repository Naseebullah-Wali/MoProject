<template>
    <div>
      <h1>Projects</h1>
      <ul>
        <li v-for="project in projects" :key="project.id">{{ project.title }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import { fetchProjects } from '../services/projectService';
  
  export default {
    data() {
      return {
        projects: []
      };
    },
    async created() {
      try {
        const response = await fetchProjects();
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  };
  </script>
  