export default {
    template: `<div>
    <div class="container py-5 my-4">
        <h2>All Tracks</h2>
          <div class="container d-flex justify-content-between align-items-center mb-3">
    
          <form @submit.prevent="submitSearchForm" class="d-flex">
            <div class="form-group mb-0 me-2">
              <select v-model="filterType" id="filter_type" name="filter_type">
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div class="form-group mb-0 me-2">
              <input v-model="filterValue" type="text" id="filter_value" name="filter_value">
            </div>
            <div class="form-group mb-0 me-2">
              <div><button type="submit" class="btn btn-outline-success btn-sm">Search</button></div>
            </div>
          </form>
        
        <!-- ------------------------------------------------------------------------------------ -->

        <!-- Add Song button for creator -->
          <h2 class="text-end">
            <button v-if="isCreator" class="btn btn-md btn-primary" @click='buttonAddSong'>Add Song</button>
          </h2>  
        </div>

        <!-- ----------------------------------------------------------------------------------------- -->


        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-3 mb-3">
            <div v-for="song in songs.songs" :key="song.id" class="col">
                <div class="card shadow-sm bg-danger-subtle mb-3">
                <img src="static/images/song.png" class="img-thumbnail rounded mb-0 shadow-sm mx-auto" alt="song" width="200 px" height="200 px"/>
                <div class="card-body px-2">
                <p class="card-text">
                <p class="mb-0">{{ song.title }}</p>
                <p><small>{{ song.artist }}</small></p>
                </p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group margin-right-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click='buttonPlaySong(song.id)'>Play</button>
                        <button v-if="isCreator" type="button" class="btn btn-sm btn-outline-secondary" @click='buttonEditSong(song.id)'>Edit</button>
                        <button v-if="isCreator" type="button" class="btn btn-sm btn-outline-secondary"@click='buttonDeleteSong(song.id)'>Delete</button>
                     </div>
                    <small class="text-body-secondary">{{ song.duration }}</small>
                </div>
                </div>
            </div>    
        </div>  
        </div>    

        <hr class="mt-3">
        <h2 class="mb-3">All Albums</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-3 mb-3">
            <div v-for="album in albums.albums" :key="album.id" class="col">
                <div class="card shadow-sm bg-danger-subtle mb-3">
                <img src="static/images/album.png" class="img-thumbnail rounded mb-0 shadow-sm mx-auto" alt="song" width="200 px" height="200 px"/>
                <div class="card-body padding-top-0">
                <p class="card-text">
                <p class="mb-0">{{ album.name }}</p>
                <p><small>{{ album.artist}}</small></p>
                </p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <router-link :to="{name: 'View Album', params: { id: album.id }}"type="button" class="btn btn-sm btn-outline-secondary">View</router-link>
                     </div>
                </div>
                </div>
            </div>    
        </div>  
        </div>  
       
    </div>
    </div>`,

    data() {
        return {
            songs: [],
            albums: [],
            filterType: 'title', // Default filter type
            filterValue: '',
            isAdmin: false,
            isCreator: false,
            isUser: false
        }   
    },
    mounted() {
        this.getSongs();
        this.getAlbums();
        this.getUserRole();
    },
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
        async getSongs() {
            try {
              const response = await fetch('/api/songs');
              if (response.ok) {
                this.songs = await response.json();
                console.log("List of all Songs: ", this.songs);
              } else {
                const errorData = await response.json();
                console.error('Error fetching songs:', errorData);
              }
            } catch (error) {
              console.error('Error fetching songs:', error);
            }
          },
      
          async getAlbums() {
            try {
              const response = await fetch('/api/albums');
              if (response.ok) {
                this.albums = await response.json();
              } else {
                const errorData = await response.json();
                console.error('Error fetching albums:', errorData);
              }
            } catch (error) {
              console.error('Error fetching albums:', error);
            }
          },

        buttonAddSong(){
            this.$router.push({ path: '/upload-song' })
        },

        buttonPlaySong(song_id){
            this.$router.push({ name: "Play Song", params: {id: song_id}})
        },

        buttonEditSong(song_id){
            console.log(song_id)
            this.$router.push({ name: "Update Song", params: {id: song_id}})
        },

        async buttonDeleteSong(song_id){
            try {
                const response = await fetch(`/api/song/${song_id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                });
        
                if (response.ok) {
                  console.log('Song deleted successfully');
                  this.getSongs();
                } else {
                  const errorData = await response.json();
                  console.error('Error deleting song:', errorData);
                }
              } catch (error) {
                console.error('Error deleting song:', error);
              }
          }, 
          async submitSearchForm() {
            try {
              if(this.filterValue == ""){
                this.getSongs();
              }
              const url = `/api/songs/filter?filter_type=${encodeURIComponent(this.filterType)}&filter_value=${encodeURIComponent(this.filterValue)}`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                },
                
              });
      
              if (response.ok) {
                this.songs = await response.json();
                console.log("Filtered Songs are: ", this.songs);
              } else {
                const errorData = await response.json();
                console.error('Error fetching filtered songs:', errorData);
              }
            } catch (error) {
              console.error('Error fetching filtered songs:', error);
            }
          },
           
    },   
}