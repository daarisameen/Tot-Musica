const NewNavbar = Vue.component('NewNavbar', {
    template: `<nav class="navbar navbar-dark bg-dark fixed-top navbar-expand-lg ">
    <div class="container-fluid">
      <router-link to ="/" class="navbar-brand mb-0 mx-5 h1 display-6 fw-bold">
        <img
          src="static/images/musical-note.png"
          alt="Logo"
          width="30"
          height="30"
          class="d-inline-block align-text-top me-2"
        />
        Tot Musica
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-between align-items-center"
        id="navbarSupportedContent"
      >
        <div class="ms-auto d-flex mx-5">

          <router-link v-if="isAuthenticated && (isUser || isCreator)" class="nav-link active" to="/userhome">Home</router-link>

          <router-link v-if="isAuthenticated && isUser && !isCreator" class="nav-link active" to="/creator-registration">Creator Account</router-link>

          <router-link v-if="isAuthenticated && isCreator" class="nav-link active" to="/creator-dashboard">Dashboard</router-link>

          <router-link v-if="isAuthenticated && (isUser || isCreator)" class="nav-link active" to="/your-playlists"
            >Your Playlists</router-link
          >

          <router-link v-if="isAuthenticated && isAdmin" class="nav-link active" to="/admin-dashboard">Admin Dashboard</router-link>

          <button v-if="isAuthenticated" class="nav-link active" @click='logout'>Logout</button>
          
        </div>
      </div>
    </div>
  </nav>`,

  data () {
    return {
      isAuthenticated: false,
      isAdmin: false,
      isCreator: false,
      isUser: false
    }
  },
  beforeMount() {
      const token = localStorage.getItem('access-token');
      
      if (token) {
        this.isAuthenticated = true;
        this.reloadOnce = false;
        // const decodedToken = jwt_decode(token);
        // this.currentUserId = decodedToken.sub;
        // console.log('Decoded User ID:', this.currentUserId);
      }
      else {
        this.isAuthenticated = false;
        this.reloadOnce = false;
        this.$router.push({ path: '/' });
      }

      console.log("auth status", this.isAuthenticated);

      this.getUserRole();

  },
  // watch: {
  //   isAuthenticated: function (oldValue, newValue) {

  //     if (oldValue != newValue) {
  //       console.log("i will reload");
  //       location.reload();
  //     }
  //   },
  // },
  methods: {
    async getUserRole() {
      try {
        const response = await fetch('/api/user_role', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const roles = responseData.roles;
          console.log('User roles:', roles);
          this.isAdmin = roles.includes('admin');
          this.isCreator = roles.includes('creator');
          this.isUser = roles.includes('user');
          this.isAuthenticated = true;
        } else {
          // Handle error response
          console.error('Error fetching user role:', response.status);
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error during fetch:', error);
      }
    },
    logout() {
      try {
        localStorage.removeItem('access-token');
        // Optionally, you can also reset any user-related data in your component or store
        // Route the user to the '/' path
        this.$router.push({ path: '/' });
  
        console.log('User logged out successfully');
      } catch (error) {
        console.error('Error during logout', error);
      }
    },
  }
}
)

export default NewNavbar;