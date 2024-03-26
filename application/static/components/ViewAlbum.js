export default {
    template:  `<div>
    
    <div class="container pt-4 mb-5 my-5 justify-content-between align-items-center">
        <h2>Album: {{ album.name }}</h2>
        <h4 class="text-muted">Artist: {{ album.artist.name }}</h4>
        <div class="container-sm">
            <div v-if="album.songs.length === 0">
                <p class="lead">This album is empty.</p>
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
                <tr v-for="(song, index) in album.songs" :key="song.id">
                <td>{{ index + 1 }}</td>
                <td>{{ song.title }}</td>
                <td>
                    <router-link :to="{ name: 'Play Song', params: { id: song.id } }" class="btn btn-outline-info btn-sm mx-3">
                    Play
                    </router-link>
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
            album: {},
        }
    },
    mounted() {
        const albumId = this.$route.params.id;
        this.getAlbumDetails(albumId);
    },
    methods: {
        async getAlbumDetails(albumId) {
            try {
            //   const albumId = this.$route.params.albumId;
              const response = await fetch(`/api/album/${albumId}`);
              
              if (response.ok) {
                const albumData = await response.json();
                this.album = albumData;
                console.log(albumData);
              } else {
                console.error('Error fetching album details:', response.statusText);
              }
            } catch (error) {
              console.error('Error fetching album details:', error);
            }
          },
    }
}