export default {
    template: `<div>
    
    <div class="container pt-4 mb-5 my-5 justify-content-between align-items-center">
        <h2>Your Playlists</h2>
        <h2 class="text-end">
        <button class="btn btn-success mb-3" @click="buttonAddPlaylist">+ Add Playlist</button>
        </h2>
        <div class="container-sm">
            <div v-if="!playlists.playlists || playlists.playlists.length === 0">
                <p class="lead">You have not created any playlist yet.</p>
            </div>
            <div v-else>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Playlist</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(playlist, index) in playlists.playlists" :key="playlist.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ playlist.name }}</td>
                            <td>
                                <button class="btn btn-outline-info btn-sm mx-3"
                                @click="buttonViewPlaylist(playlist.id)">View</button>
                                <button class="btn btn-outline-primary btn-sm mx-3"
                                @click="buttonUpdatePlaylist(playlist.id)">Update</button>
                                <button class="btn btn-outline-danger btn-sm mx-3"
                                @click="buttonDeletePlaylist(playlist.id)">Delete</button>
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
            playlists: []
        }
    },
    mounted() {
        this.getPlaylists();
    },
    methods: {
        getPlaylists() {
            fetch('/api/playlists', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`
              },
            })
            .then(response => response.json())
            .then(data => {
              this.playlists = data;
            })
            .catch(error => {
              console.error('Error fetching playlists:', error);
            });
        },
        buttonAddPlaylist(){
            this.$router.push({ path: '/create-playlist' })
        },
        buttonViewPlaylist(playlist_id) {
            this.$router.push({ name: "View Playlist", params: {id: playlist_id}})

        },
        buttonUpdatePlaylist(playlist_id) {
            this.$router.push({ name: "Update Playlist", params: {id: playlist_id}})
        },

        async buttonDeletePlaylist(playlist_id) {
            try {
                const response = await fetch(`/api/playlist/${playlist_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                    },
                });

                if (response.ok) {
                    console.log('Playlist deleted successfully');
                    this.getPlaylists();
    
                } else {
                    console.error('Failed to delete playlist');
                }
            } catch (error) {
                console.error('Error deleting playlist', error);
            }
        },
    },



    }