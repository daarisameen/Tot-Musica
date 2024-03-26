export default {
    template: ` <div
    class="container-sm d-flex justify-content-center align-items-center"
    style="height: 90vh"
  >
    <div
      style="margin-top: 5em; margin-bottom: auto; margin-bottom: auto"
      class="form-outline w-50"
    >
      <img
        class="mb-4"
        src="static/images/musical-note.png"
        alt="Logo"
        width="90"
        height="90"
        style="display: block; margin-left: auto; margin-right: auto"
      />
      <h1 class="h3 mb-3 font-weight-normal">Join Tot Musica!</h1>
  
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" id="name" name="name" class="form-control" required v-model="name" />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" id="email" name="email" class="form-control" required v-model="email" />
      </div>
  
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          class="form-control"
          required
          v-model="username"
        />
      </div>
  
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          class="form-control"
          required
          v-model="password"
        />
      </div>
  
      <div class="mb-3">
        <label for="confirm_password" class="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          class="form-control"
          required
          v-model="confirm_password"
        />
      </div>
      <div>
        <button @click="registerUser" type="submit" class="btn btn-primary my-3">Register</button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
    </div>
  </div>
  `,

  data() {
    return {
      name: null,
      email: null,
      username: null,
      password: null,
      confirm_password: null,
      errorMessage: null,
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirm_password) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            username: this.username,
            password: this.password,
            confirm_password: this.confirm_password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('User registered successfully', data);
          this.$router.push('/login')
        } else {
          console.error('Registration failed', data);
          this.errorMessage = data.message || 'Registration failed. Please try again.';
        }
      } catch (error) {
        console.error('Error during registration', error);
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    },
}
}