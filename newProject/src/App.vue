<template>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
  <section>
    <Navbar></Navbar>
  <br>
  <br>
  <br>
    <router-view/>
    <Footer></Footer>

  </section>
  
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
export default defineComponent({
  data() {
    return {
      alertVisible: false,
    };
  },
  components: {
    Navbar,
    Footer
  },
  methods: {
    showAlert() {
      this.alertVisible = !this.alertVisible;
    },
  },
});
</script>

<style>

</style>
