export default {
    template: `<div>
    <div class="container-sm d-flex justify-content-center align-items-center my-5" style="height: 90vh">
    <form @submit.prevent="updatePlaylist" style="margin-top: 2em; margin-bottom: auto; margin-bottom: auto" class="form-outline w-50">
    <h2 class="h2 mb-3 font-weight-normal text-center">Update Playlist</h2>

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

    <button type="submit" class="btn btn-primary my-3">Update</button>
    </form>
    </div>
    </div>`,

    data() {
        return {
            playlistName: "",
            songs: [],
            selectedSongs: []
        }
    },

    mounted() {
        const playlistId = this.$route.params.id;
        // console.log(this.$route.params)
        // console.log(playlistId)
        this.getPlaylistDetails(playlistId);
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

        async getPlaylistDetails(playlistId) {
            try {
                const response = await fetch(`/api/playlist/${playlistId}`, 
                
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                },
                });
            
                if (response.ok) {
                const playlistDetails = await response.json();
                this.playlistName = playlistDetails.name;
                this.selectedSongs = playlistDetails.songs ? playlistDetails.songs.map(song => song.id) : [];
                } else {
                console.error('Failed to fetch playlist details');
                }
            } catch (error) {
                console.error('Error fetching playlist details', error);
            }
                    
        },

        async updatePlaylist() {
            try {
              const data = {
                name: this.playlistName,
                songs: this.selectedSongs,
              };
              const playlistId = this.$route.params.id;
              console.log(this.$route.params)
              const response = await fetch(`/api/playlist/${playlistId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                },
                body: JSON.stringify(data),
              });
          
              if (response.ok) {
                console.log('Playlist updated successfully');
                this.$router.push({ name: "Your Playlists" });
              } else {
                console.error('Failed to update playlist');
              }
            } catch (error) {
              console.error('Error updating playlist', error);
            }
          },
          

    }
}