export default {

    template: `<div>
        <div class="container-sm d-flex justify-content-center align-items-center my-5" style="height: 90vh">
        <form @submit.prevent="createPlaylist" style="margin-top: 2em; margin-bottom: auto; margin-bottom: auto" class="form-outline w-50">
        <h2 class="h2 mb-3 font-weight-normal text-center">Create a Playlist</h2>


        <div class="mb-3">
        <p class="lead text-center">
            Club your favourite songs together in a playlist.
        </p>
        </div>

        <div class="mb-3">
        <label for="playlistName" class="form-label">Playlist Name</label>
        <input v-model="playlistName" type="text" id="playlistName" name="playlistName" class="form-control" required>
        </div>

        <div class="form-group">
        <label class="form-control-label">Select Songs</label>
        <div v-for="song in songs.songs" :key="'song-' + song.id" class="form-check">
            <input
            type="checkbox"
            :id="'song-' + song.id"
            name="selectedSongs"
            :value="song.id"
            class="form-check-input"
            />
            <label :for="'song-' + song.id" class="form-check-label">{{ song.title }}</label>
        </div>
        </div>

        <button type="submit" class="btn btn-primary my-3">Create Playlist</button>
    </form>
    </div>
    </div>`,

    data() {
        return {
            playlistName: "",
            songs: []
        }
    },
    mounted() {
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

          createPlaylist() {
            const selectedSongs = Array.from(document.querySelectorAll('input[name="selectedSongs"]:checked')).map(input => input.value);
      
            if (selectedSongs.length === 0) {
                console.log('Please select at least one song for the playlist.');
                return;
            }

            const data = {
              name: this.playlistName,
              songs: selectedSongs,
            };
      
            fetch('/api/playlists', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
              },
              body: JSON.stringify(data),
            })
            .then(response => {
              if (response.ok) {
                console.log('Playlist created successfully');
                this.$router.push({path: '/your-playlists'})
              } else {
                console.error('Failed to create playlist');
              }
            })
            .catch(error => {
              console.error('Error creating playlist', error);
            });
          },
        },  

    }
