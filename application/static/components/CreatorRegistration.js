export default {
    template: `<div>

            <div class="container-sm d-flex justify-content-center align-items-center text-center" style="height: 90vh">
            <div class="mx-auto p-5 align-middle">
            <div class="mb-3">
                <h1 class="display-4">Register as Creator</h1>
            </div>
            <div>
                <p class="lead">
                Register as a creator to upload your own songs, view summary stats and much more!
                </p>
            </div>
            <div class="d-flex justify-content-center gap-5 mt-5">
                <router-link to="/userhome" class="btn btn-primary me-5 p" type="button">Maybe Later</router-link>
                <button @click="registerAsCreator" class="btn btn-success ms-5 p">Yes</button>
            </div>
            </div>
        </div>
    </div>`,

    methods: {
        async registerAsCreator() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/register_creator', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                  },
                  body: JSON.stringify({ response: true }), // Set response to true to upgrade to creator
                });
        
                if (response.ok) {
                  const responseData = await response.json();
                  console.log('User successfully upgraded to creator:', responseData);
                  this.$router.push('/userhome'); 
                } else {
                  const errorData = await response.json();
                  console.error('Error upgrading user to creator:', errorData);
                 
                }
              } catch (error) {
                console.error('Error during upgrade to creator:', error);
               n
              }
            }
          }
          }

