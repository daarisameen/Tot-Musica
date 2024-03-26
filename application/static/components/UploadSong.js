export default {
    template: `<div>
    <div class="container-sm py-5 d-flex justify-content-center" style="height: 90vh">

    <form @submit.prevent="submitForm" style="margin-top: 2em; margin-bottom: auto; margin-bottom: auto" class="w-50" enctype="multipart/form-data">
    
        <h2 class="h2 mb-3 font-weight-normal text-center">Upload a Song</h2>
    
        <div class="mb-3">
            <p class="lead text-center">
            Cannot find your favorite tune in our library? Upload a song from your device and start listening to it today!
        </p>
        </div>

        <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model='formData.title' type="text" id="title" name="title" class="form-control" required>
        </div>

        <div class="mb-3">
        <label for="formFile" class="form-label">Browse File</label><br>
        <input @change='handleFileUpload' ref="fileInput" type="file" name="file" class="form-control-file" id="formFile" 
        accept=".mp3" required>
        </div>

        <div class="mb-3">
        <label for="artist" class="form-label">Artist</label>
        <input v-model='formData.artist' type="text" id="artist" name="artist" class="form-control" required>
        </div>

        <div class="mb-3">
        <label for="lyrics" class="form-label">Lyrics</label>
        <textarea v-model='formData.lyrics' id="lyrics" name="lyrics" class="form-control"></textarea>
        </div>
    
        <div>
        <button type="submit" class="btn btn-primary my-3">Upload</button>
        </div>

    </form>
</div>
</div>`,

data(){
    return {
        formData: {
            title: null,
            artist: null,
            lyrics: null,
            selectedFile: null
        }
    };
},
methods: {
    handleFileUpload(event) {
        this.formData.selectedFile = event.target.files[0];
      },

      async submitForm() {
        try {
          const file = this.formData.selectedFile;
          const fileName = this.formData.title + ".mp3";
          const renamedFile = new File([file], fileName, { type: file.type });
          console.log(renamedFile);
          const formData = new FormData();  
          formData.append('title', this.formData.title);
          formData.append('artist', this.formData.artist);
          formData.append('lyrics', this.formData.lyrics);
          formData.append('file', renamedFile);
          const response = await fetch('/api/songs', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('access-token'),
            },
            body: formData
          })
          console.log(formData)
          if (response.ok) {
            const data = await response.json();
            console.log('Song uploaded successfully:', data);
            this.$router.push({path: '/userhome'})
          } else {
            const errorData = await response.json();
            console.error('Error uploading song:', errorData);
          }
        } catch (error) {
          console.error('Error uploading song:', error);
        }
      },
    },  
}
