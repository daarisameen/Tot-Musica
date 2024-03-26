export default {
    template: `<div>
    
    <div class="container-sm d-flex justify-content-center align-items-center" style="height: 90vh">
        <form @submit.prevent="submitForm" class="form-outline w-50">
            <h2 class="h2 mb-3 font-weight-normal text-center">Update Album</h2>
  
            <div class="mb-3">
                <label for="name" class="form-label">Album Name</label>
                <input v-model="formData.name" type="text" class="form-control" id="name" required>
            </div>
  
            <div class="mb-3">
                <label for="artist" class="form-label">Artist</label>
                <input v-model="formData.artist" type="text" class="form-control" id="artist" required>
            </div>
  
            <div class="mb-3">
                <label for="genre" class="form-label">Genre</label>
                <select v-model="formData.genre" class="form-control" id="genre">
                <option v-for="choice in genreChoices" :value="choice">{{ choice }}</option>
                </select>
            </div>
  
            <div class="form-group">
                <label class="form-control-label">Songs</label>
                <div v-for="song in songs.songs" :key="song.id" class="form-check">
                <input
                    v-model="selectedSongs"
                    :value="song.id"
                    type="checkbox"
                    :id="song.id"
                    class="form-check-input"
                />
                <label :for="song.id" class="form-check-label">{{ song.title }}</label>
                </div>
            </div>
  
            <div>
                <button type="submit" class="btn btn-primary my-3">Update</button>
            </div>
            </form>
    </div>
    </div>`,

    data() {
        return {
            formData: {
              name: '',
              artist: '',
              genre: 'Other',
              songs: [],
            },
            genreChoices: ['Pop', 'Metal', 'Classical', 'Other'],
            songs: [],
            selectedSongs: []
          }
    },
    mounted() {
        const albumId = this.$route.params.id;
        this.getAlbum(albumId);
        this.getSongs();
    },
    methods: {
        async getSongs() {
            try {
                const response = await fetch('/api/songs');
                if (response.ok) {
                  this.songs = await response.json();
                } else {
                  const errorData = await response.json();
                  console.error('Error fetching songs:', errorData);
                }
              } catch (error) {
                console.error('Error fetching songs:', error);
              }
          },

          async getAlbum(albumId) {
            try {
              const response = await fetch(`/api/album/${albumId}`);
              if (response.ok) {
                const albumData = await response.json();
                this.formData = { ...albumData.album }; // Update formData with the fetched album data
              } else {
                console.error('Error fetching album:', response.statusText);
              }
            } catch (error) {
              console.error('Error fetching album:', error);
            }  

        },

        async submitForm() {
            try {
              const albumId = this.$route.params.id;
              const response = await fetch(`/api/album/${albumId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                },
                body: JSON.stringify({ ...this.formData, songs: this.selectedSongs }),
              });
      
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
      
              const responseData = await response.json();
              console.log(responseData); 
              this.$router.push({path: '/creator-dashboard'});
            } catch (error) {
              console.error('There was a problem with the fetch operation:', error);
            }
          },
        },
    }