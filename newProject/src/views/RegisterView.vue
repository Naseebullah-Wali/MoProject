<template>
  <section class="vh-100 bg-image">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card shadow-lg rounded-3">
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-4">Create an Account</h2>

                <form @submit.prevent="register">
                  <div class="mb-4">
                    <label for="name" class="form-label">Your Name</label>
                    <input type="text" id="name" class="form-control form-control-lg" placeholder="Your Name" v-model="name" required />
                  </div>

                  <div class="mb-4">
                    <label for="nickname" class="form-label">Nickname (optional)</label>
                    <input type="text" id="nickname" class="form-control form-control-lg" placeholder="Nickname" v-model="nickname" />
                  </div>

                  <div class="mb-4">
                    <label for="email" class="form-label">Your Email</label>
                    <input type="email" id="email" class="form-control form-control-lg" placeholder="Email" v-model="email" required />
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-control form-control-lg" placeholder="Password" v-model="password" required />
                  </div>

                  <div class="mb-4">
                    <label for="phone" class="form-label">Phone (optional)</label>
                    <input type="tel" id="phone" class="form-control form-control-lg" placeholder="Phone" v-model="phone" />
                  </div>

                  <div class="mb-4">
                    <label for="telegram" class="form-label">Telegram (optional)</label>
                    <input type="text" id="telegram" class="form-control form-control-lg" placeholder="Telegram" v-model="telegram" />
                  </div>

                  <div class="mb-4">
                    <label for="company" class="form-label">Company</label>
                    <select id="company" class="form-control form-control-lg" v-model="company">
                      <option disabled value="">Select Company</option>
                      <option v-for="company in companies" :key="company.id" :value="company.id">
                        {{ company.name }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4 form-check">
                    <input type="checkbox" id="notifyProjects" class="form-check-input" v-model="notifyOnProjects" />
                    <label for="notifyProjects" class="form-check-label">Notify on Projects</label>
                  </div>

                  <div class="mb-4 form-check">
                    <input type="checkbox" id="notifyUpdates" class="form-check-input" v-model="notifyOnUpdates" />
                    <label for="notifyUpdates" class="form-check-label">Notify on Updates</label>
                  </div>

                  <div v-show="error" class="error text-danger">{{ errorMsg }}</div>

                  <div class="d-grid">
                    <button type="submit" class="btn btn-dark btn-lg btn-block gradient-custom-4">Register</button>
                  </div>

                  <p class="text-center mt-4">
                    Already have an account?
                    <router-link class="fw-bold text-body" :to="{ name: 'login' }">Login Here</router-link>
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
  name: "Register",
  data() {
    return {
      name: "",
      nickname: "",
      email: "",
      password: "",
      phone: "",
      telegram: "",
      company: "",
      notifyOnProjects: false,
      notifyOnUpdates: false,
      error: false,
      errorMsg: "",
      companies: [], 
    };
  },
  methods: {
    async fetchCompanies() {
      try {
        // const response = await fetch("http://localhost:3000/companies");
        const response = await fetch("http://localhost:3000/companies");
        const data = await response.json();
        this.companies = data;
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    },
    async register() {
      try {
        if (
          this.name &&
          this.email &&
          this.password &&
          this.company
        ) {
          this.error = false;
          this.errorMsg = "";

          const newUser = {
            name: this.name,
            nickname: this.nickname || null,
            email: this.email,
            password: this.password,
            phone: this.phone || null,
            telegram: this.telegram || null,
            company: this.company,
            notifyOnProjects: this.notifyOnProjects,
            notifyOnUpdates: this.notifyOnUpdates,
            role: "employee", // Default role for new users
          };

          const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });

          if (response.ok) {
            this.$router.push({ name: "Login" });
          } else {
            this.error = true;
            this.errorMsg = "Failed to register. Please try again.";
          }
        } else {
          this.error = true;
          this.errorMsg = "Please fill out all the required fields!";
        }
      } catch (error) {
        this.error = true;
        this.errorMsg = error.message;
      }
    },
  },
  created() {
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
