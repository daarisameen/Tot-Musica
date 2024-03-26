export default {
  template: `<div>
    <div class="container-md py-3">
        <div class="row justify-content-between">
            <div class="col-8">
                <h2 class="h2 mb-4">Admin Dashboard</h2>

                <!-- All Tracks Table -->
                <div class="container w-100 mb-5 rounded">
                    <h4 class="text-muted">All Tracks</h4>

                    <div v-if="songs.length === 0">
                    <p class="lead">No records found.</p>
                    </div>

                    <div v-else>
                    <table class="table table-bordered text-center">
                        <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Songs</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(song, index) in songs.songs" :key="song.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ song.title }}</td>
                            <td class="d-flex justify-content-center">
                            <router-link
                                :to="{ name: 'Play Song', params: { id: song.id }}"
                                class="btn btn-outline-info btn-sm mx-3"
                            >
                                Details
                            </router-link>

                            <button @click="toggleSongFlag(song)" :class="{'btn btn-outline-danger': song.is_flagged, 'btn btn-outline-secondary': !song.is_flagged, 'btn-sm': true, 'mx-3': true}">
                                {{ song.is_flagged ? 'Whitelist' : 'Blacklist' }}
                            </button>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>

                <!-- All Creators Table -->
                <div class="container w-100 mb-3 rounded">
                    <h4 class="text-muted">All Creators</h4>

                    <div v-if="creators.length === 0">
                    <p class="lead">No records found.</p>
                    </div>

                    <div v-else>
                    <table class="table table-bordered text-center">
                        <thead>
                        <tr>
                            <th scope="col">S. No.</th>
                            <th scope="col">Creator</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(creator, index) in creators" :key="creator.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ creator.name }}</td>
                            <td class="d-flex justify-content-center">

                            <button @click="toggleCreatorFlag(creator)" :class="{'btn btn-outline-danger': creator.is_flagged, 'btn btn-outline-secondary': !creator.is_flagged, 'btn-sm': true, 'mx-3': true}">
                                {{ creator.is_flagged ? 'Whitelist' : 'Blacklist' }}
                            </button>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>

                <!-- Summary Bulletin -->
                <div class="col-3 mt-5 py-3">
                <h4 class="text-muted text-center">Summary Bulletin</h4>
                <table class="table table-primary table-borderless">
                    <tbody>
                    <tr>
                        <td>Number of Users</td>
                        <td>{{ summary.user_count }}</td>
                    </tr>
                    <tr>
                        <td>Number of Creators</td>
                        <td>{{ summary.creator_count }}</td>
                    </tr>
                    <tr>
                        <td>Number of Albums</td>
                        <td>{{ summary.album_count }}</td>
                    </tr>
                    <tr>
                        <td>Number of Artists</td>
                        <td>{{ summary.artist_count }}</td>
                    </tr>
                    <tr>
                        <td>Number of Songs</td>
                        <td>{{ summary.song_count }}</td>
                    </tr>
                    <tr>
                        <td>Average Song Ratings</td>
                        <td>{{ summary.average_rating }}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>`,

        data() {
            return {
                songs: [],
                creators: [],
                summary: {},
              };
        },

        mounted() {
            this.getSongs();
            this.getCreators();
            this.getSummary();
        },
        methods: {
            async getSongs() {
                try {
                  const response = await fetch('/api/admin_songs');
                  if (response.ok) {
                    this.songs = await response.json();
                  } else {
                    console.error('Failed to fetch songs');
                  }
                } catch (error) {
                  console.error('Error fetching songs', error);
                }
              },
              async getCreators() {
                try {
                  const response = await fetch('/api/all_creators');
                  if (response.ok) {
                    this.creators = await response.json();
                  } else {
                    console.error('Failed to fetch creators');
                  }
                } catch (error) {
                  console.error('Error fetching creators', error);
                }
              },
              async getSummary() {
                try {
                  const response = await fetch('/api/admin_statistics');
                  if (response.ok) {
                    this.summary = await response.json();
                  } else {
                    console.error('Failed to fetch summary');
                  }
                } catch (error) {
                  console.error('Error fetching summary', error);
                }
              },
            //   async flagSong(songId, response) {
            //     try {
            //       await fetch(`/api/flag_song/${songId}`, {
            //         method: 'PUT',
            //         headers: {
            //           'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ response }),
            //       });
            //       this.getSongs();
            //     } catch (error) {
            //       console.error('Error flagging song', error);
            //     }
            //   },
            //   async flagCreator(creatorId, response) {
            //     try {
            //       await fetch(`/api/flag_creator/${creatorId}`, {
            //         method: 'PUT',
            //         headers: {
            //           'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ response }),
            //       });
            //       this.getCreators();
            //     } catch (error) {
            //       console.error('Error flagging creator', error);
            //     }
            //   },

            async toggleSongFlag(song) {
                try {
                  song.is_flagged = !song.is_flagged;
        
                  await fetch(`/api/flag_song/${song.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ response: song.is_flagged }),
                  });
                    this.getSongs();
                } catch (error) {
                  console.error('Error toggling flag for song', error);
                }
              },

              async toggleCreatorFlag(creator) {
                try {
                  creator.is_flagged = !creator.is_flagged;
        
                  await fetch(`/api/flag_creator/${creator.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ response: creator.is_flagged }),
                  });
                    this.getCreators();
                } catch (error) {
                  console.error('Error toggling flag for song', error);
                }
              },  
            },

            }

