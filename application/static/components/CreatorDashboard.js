export default {
    template: `<div>
    <div class="container pt-4 mb-5 justify-content-between align-items-center">
        <h2>Creator Dashboard</h2>
  
            <!-- Creator Statistics Cards -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3 mt-2 mb-5">
                <div class="card border-primary mx-4 text-center text-primary" style="max-width: 20rem; height: 10rem;">
                    <div class="card-body">
                    <h5 class="card-title">Total Songs Uploaded</h5>
                    <p class="card-text display-3">{{ creatorStats.song_count }}</p>
                    </div>
                </div>
  
                <div class="card border-primary mx-4 text-center text-primary" style="max-width: 20rem; height: 10rem;">
                    <div class="card-body">
                    <h5 class="card-title">Average Rating of Songs</h5>
                    <p class="card-text display-3">{{ creatorStats.average_rating }}</p>
                    </div>
                </div>
  
                <div class="card border-primary mx-4 text-center text-primary" style="max-width: 20rem; height: 10rem;">
                    <div class="card-body">
                    <h5 class="card-title">Total Albums Created</h5>
                    <p class="card-text display-3">{{ creatorStats.album_count }}</p>
                    </div>
                </div>
            </div>

            <div class="justify-content-center mb-3">
            <button @click="downloadResource" class="btn btn-primary">Download Report</button>
            <span v-if='isWaiting'> Waiting... </span>
            </div>

            <!-- User Albums Table -->
            <h3>Your Albums</h3>
            <h2 class="text-end">
            <router-link to="/create-album" class="btn btn-success">+ Add Album</router-link>
            </h2>
        
            <div class="container-sm">
            <div v-if="userAlbums.length === 0">
                <p class="lead">No records found.</p>
            </div>
        
            <div v-else>
                <table class="table table-bordered text-center">
                <thead>
                    <tr>
                    <th scope="col">S. No.</th>
                    <th scope="col">Album</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(album, index) in userAlbums" :key="album.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ album.name }}</td>
                    <td>
                        <router-link :to="{ name: 'View Album', params: { id: album.id }}" class="btn btn-outline-info btn-sm mx-3">View</router-link>
                        <router-link :to="{ name: 'Update Album', params: { id: album.id }}" class="btn btn-outline-primary btn-sm mx-3">Update</router-link>
                        <button @click="buttonDeleteAlbum(album.id)" class="btn btn-outline-danger btn-sm mx-3">Delete</button>
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
        creatorStats: {}, 
        userAlbums: [],
        isWaiting: false
      };
    
    },

mounted() {
    this.getCreatorStats();
    this.getUserAlbums();
    },
    
methods: {
    async downloadResource() {
      this.isWaiting = true
      const res = await fetch('/download-csv')
      const data = await res.json()
      console.log(data)
      if (res.ok) {
        const taskId = data['task_id']
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskId}`)
          if (csv_res.ok) {
            this.isWaiting = false
            clearInterval(intv)
            window.location.href = `/get-csv/${taskId}`
          }
        }, 1000)
      }
    },

    async getCreatorStats() {
        try {
          const response = await fetch('/api/creator_statistics', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
  
          if (response.ok) {
            this.creatorStats = await response.json();
          } else {
            console.error('Failed to fetch creator statistics');
          }
        } catch (error) {
          console.error('Error fetching creator statistics', error);
        }
      },
      async getUserAlbums() {
        try {
          const response = await fetch('/api/albums', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.userAlbums = data.albums;
          } else {
            console.error('Failed to fetch user albums');
          }
        } catch (error) {
          console.error('Error fetching user albums', error);
        }
      },

      async buttonDeleteAlbum(albumId) {
        try {
          const response = await fetch(`/api/album/${albumId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access-token')}`
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const responseData = await response.json();
          console.log(responseData);
          this.getUserAlbums();
          // this.albums = this.albums.filter(album => album.id !== albumId);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      },

      }
    }    