const LandingPage = Vue.component('LandingPage', {
    template: `
    <div class="container-md text-center align-items-center justify-content">
      <div class="row align-items-center justify-content" style="height: 75vh; margin-top: 17vh;">
        <div class="col">
          <h1 class="display-4">いらっしゃいませ</h1>
             <div class="d-flex align-items-center justify-content-center">
                <img
                  class="mb-2 img-fluid"
                  src="static/images/musical-note.png"
                  alt="Logo"
                  width="90"
                  height="90"
                  style="display: inline; margin-right: 10px;"
                />
                <h1 class="h1 display-2 fw-bold mb-2">Tot Musica</h1> 
             </div>
          </div>
    
          <hr class="my-3 p-1" />
          <p class="lead">Join today to start listening to your favourite music.<button v-on:click="redirectToRegister" class="btn btn-lg btn-outline-primary mx-2">Register</button>
          </p>
          <p class="lead">Already a member of Tot Musica? <button v-on:click="redirectToLogin" class="btn btn-lg btn-outline-danger mx-2"
            >Sign In</button>
          </p>
        </div>
      </div>
    </div>
    
    `,

    methods: { redirectToRegister() {
        this.$router.push('/register')
    },

    redirectToLogin() {
        this.$router.push('/login')
    }
    }

})

export default LandingPage;