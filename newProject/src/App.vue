<!-- <template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style> -->
<template>
  <section>
    <Navbar></Navbar>
  
  <!-- <div class="container">
    
    <h1>Welcome to Vue 3 + Bootstrap!</h1>
    <button class="btn btn-primary" @click="showAlert">Click Me!</button>
    
    <div v-if="alertVisible" class="alert alert-success mt-3" role="alert">
      This is a success alert from Bootstrap!
    </div> -->

    <!-- Example Bootstrap Card -->
    <!-- <div class="card mt-5" style="width: 18rem;">
      <img src="https://via.placeholder.com/150" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div> -->
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
/* Custom styles (optional) */
</style>
