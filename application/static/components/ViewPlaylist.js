export default {
    template: `<div>
    <div class="container pt-4 mb-5 my-5 justify-content-between align-items-center">
        <h2>Playlist: {{ playlist.name }}</h2>
        <div class="container-sm">
            <div v-if="playlist && playlist.songs.length === 0">
                <p class="lead">This playlist is empty.</p>
            </div>
            <div v-else>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Song</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(song, index) in playlist.songs" :key="song.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ song.title }}</td>
                            <td>
                                <button @click="buttonPlaySong(song.id)" class="btn btn-outline-info btn-sm">Play</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </div>`,
    data() {
        return {
           playlist: null
        };
    },
    mounted() {
        const playlistId = this.$route.params.id;
        console.log(playlistId);
        this.getPlaylistDetails(playlistId);

    },
    methods: {

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
                this.playlist = playlistDetails;    
                this.selectedSongs = playlistDetails.songs ? playlistDetails.songs.map(song => song.id) : [];

                } else {
                console.error('Failed to fetch playlist details');
                }
            } catch (error) {
                console.error('Error fetching playlist details', error);
            }
            
              
        },
        buttonPlaySong(song_id){
            this.$router.push({ name: "Play Song", params: {id: song_id}})
        }
    }
}