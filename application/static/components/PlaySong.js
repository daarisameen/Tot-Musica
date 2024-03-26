export default {
  template: `<div>
    <div class="container-sm d-flex mt-5 p-2 gap-5" style="height: 90vh">
        <div class="col-6 p-3 bg-danger-subtle shadow opacity-90 overflow-auto">
            <h1 class="display-6 mb-4">Lyrics</h1>
                <pre>{{ song.lyrics }}</pre>
        </div>
        <div class="container d-block w-50 h-100 p-3 justify-content-center">
            <div class="container d-flex flex-column align-items-center justify-content-center">
                <img src="static/images/song.png" class="img-thumbnail rounded mb-3 shadow" alt="..." width="200 px"
                height="200 px">
             </div>

            <div class="container mb-4">
                <h3>{{ song.title }}</h3>
                <h3><small class="text-body-secondary">{{ song.artist }}</small></h3>
            </div>

           
                <div class="row">
                    <div class="col-6">
                        <select name="rating" class="form-select-sm mx-3 me-5" v-model="selectedRating" @change="rateSong">
                            <option value="0">Rate</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div class="col-6 d-flex justify-content-end">
                        <input type="checkbox" name="like" class="form-check-input" value="1" v-model="likeCheckbox" @change="likeSong">
                        <label for="like" class="form-label mx-3">Like</label>
                    </div>
                </div>
              

            <div class="container align-items-end mt-5">
                <audio controls :src="'/static/audios/' + song.title + '.mp3'" class="embed-responsive-item mt-5 align-items-end justify-content-end" style="width: 450px"></audio>
            </div>
        </div>
    </div>

    </div>`,

  data() {
    return {
      song: null,
      likeCheckbox: false,
      selectedRating: 0
    };
  },
  mounted() {
    console.log("Route Params:", this.$route.params);
    const songId = this.$route.params.id;
    this.getSongDetails(songId);
  },

  methods: {
    async getSongDetails(songId) {
      console.log("Song ID:", songId);
      try {
        const response = await fetch(
          `/api/song/${songId}`
        );
        if (response.ok) {
          const songDetails = await response.json();
          this.song = songDetails;
        } else {
          console.error("Error fetching song details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    },

    likeSong() {
        const songId = this.song.id; // Replace with the actual property that stores the song ID
        const like = this.likeCheckbox;
        fetch(`/api/like/${songId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({ like })
        })
        .then(response => {
            if (response.ok) {
                console.log('Like updated successfully');
            } else {
                console.error('Failed to update like status');
            }
        })
        .catch(error => {
            console.error('Error updating like status', error);
        });
        },

    rateSong() {
        const songId = this.song.id; // Replace with the actual property that stores the song ID
        const rating = this.selectedRating;

        // Make a request to your backend API to update the rating
        fetch(`/api/rate/${songId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            },
            body: JSON.stringify({ rating })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Rating updated successfully');
                } else {
                    console.error('Failed to update rating');
                }
            })
            .catch(error => {
                console.error('Error updating rating', error);
            });
        }
  }
};
