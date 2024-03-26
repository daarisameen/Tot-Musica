export default {
    template: `
    <div>
    <div class="container-sm d-flex justify-content-center align-items-center py-5" style="height: 90vh">

    <form @submit.prevent="updateSong" style="margin-top: 2em; margin-bottom: auto; margin-bottom: auto" class="form-outline w-50" enctype="multipart/form-data">
  
      <h2 class="h2 mb-3 font-weight-normal text-center">Update Song</h2>
  
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" id="title" name="title" class="form-control" v-model="song.title"required>
      </div>
  
      <div class="mb-3">
        <label for="artist" class="form-label">Artist</label>
        <input type="text" id="artist" name="artist" class="form-control" v-model="song.artist" required>
      </div>
  
      <div class="mb-3">
        <label for="lyrics" class="form-label">Lyrics</label>
        <textarea id="lyrics" name="lyrics" class="form-control" v-model="song.lyrics"required>{{ song.lyrics }}</textarea>
      </div> 
  
      <div>
        <button type="submit" class="btn btn-primary my-3">Update</button>
      </div>
    </form>
  </div>
  </div>
  `,

    data() {
        return {
            song: null
        } 
    },

    mounted() {
        console.log('Route Params:', this.$route.params);
        const songId = this.$route.params.id;
        this.getSongDetails(songId);
    },
 
    methods: {
        async getSongDetails(songId) {
            console.log('Song ID:', songId);
            try {
              const response = await fetch(`/api/song/${songId}`);
              if (response.ok) {
                const songDetails = await response.json();
                this.song = songDetails;
              } else {
                console.error('Error fetching song details:', response.statusText);
              }
            } catch (error) {
              console.error('Error fetching song details:', error);
            }
          },

          async updateSong() {
            try {
                console.log('updateSong method called');
                const response = await fetch(`/api/song/${this.$route.params.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: this.song.title,
                  artist: this.song.artist,
                  lyrics: this.song.lyrics
                })
              });
      
              if (response.ok) {
                console.log('Song updated successfully!');
                this.$router.push({path: '/userhome'})
              } else {
                const errorData = await response.json();
                console.error('Error updating song:', errorData);
              }
            } catch (error) {
              console.error('Error updating song:', error);
            }
          }  
        }

        
        }


    
