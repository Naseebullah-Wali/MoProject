<template>
    <div id="app">
        <h1>Here are list of projects</h1>
        <ProjectList />
    </div>
 
</template>

<script>
import ProjectList from '../components/ProjectList.vue';

export default {
  components: {
    ProjectList
  }
};
</script>