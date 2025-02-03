<template>
  <section class="vh-100 bg-image">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card shadow-lg rounded-3">
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-4">Login to Your Account</h2>

                <form @submit.prevent="login">
                  <div class="mb-4">
                    <label for="email" class="form-label">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      class="form-control form-control-lg"
                      placeholder="Your Email"
                      v-model="email"
                      required
                    />
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      class="form-control form-control-lg"
                      placeholder="Password"
                      v-model="password"
                      required
                    />
                  </div>

                  <div v-show="error" class="error text-danger">{{ errorMsg }}</div>

                  <div class="d-grid">
                    <button type="submit" class="btn btn-dark btn-lg btn-block gradient-custom-4">Login</button>
                  </div>

                  <p class="text-center mt-4">
                    Don't have an account?
                    <router-link class="fw-bold text-body" :to="{ name: 'register' }">Register Here</router-link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: false,
      errorMsg: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const users = await response.json();

        const user = users.find(
          (u) => u.email === this.email && u.password === this.password
        );

        if (user) {
          this.error = false;
          this.errorMsg = "";

          sessionStorage.setItem("loggedInUser", JSON.stringify(user));

          if (user.role === "admin") {
            this.$router.push({ name: "users" }); // Admin page
          } else {
            this.$router.push({ name: "projects" }); // Default page for regular users
          }
        } else {
          this.error = true;
          this.errorMsg = "Invalid email or password. Please try again.";
        }
      } catch (error) {
        this.error = true;
        this.errorMsg = "Error during login. Please try again later.";
        console.error("Login error:", error);
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
