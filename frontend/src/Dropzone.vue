<template>
  <form @submit.prevent="sendFile" enctype="multipart/form-data">
    <div v-if="message" :class="`message ${error ? 'is-danger' : 'is-success'}`">
      <div class="message-body">{{message}}</div>
    </div>
    <div class="dropzone">
      <input ref="file" @change="sendFile" type="file" class="input-file" />
      <p v-if="!uploading" class="call-to-action">Drag your files here...</p>
      <p v-else class="progress-bar">
        <progress class="progress is-primary" :value="progress" max="100"></progress>
      </p>
    </div>
    <div class="content">
      <ul>
        <li v-for="item in uploadedFiles" :key="item.originalname">{{item.originalname}}</li>
      </ul>
    </div>
  </form>
</template>

<script>
import axios from "axios";
export default {
  name: "Dropzone",
  data() {
    return {
      file: "",
      message: "",
      error: false,
      uploading: false,
      uploadedFiles: [],
      progress: 0
    };
  },
  methods: {
    async sendFile() {
      const file = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", file);
      try {
        this.uploading = true;
        const res = await axios.post("/dropzone", formData, {
          onUploadProgress: e =>
            (this.progress = Math.round((e.loaded * 100) / e.total))
        });
        this.uploadedFiles.push(res.data.file);
        this.uploading = false;
      } catch (error) {
        this.message = error.response.data.error;
        this.error = true;
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped>
.dropzone {
  min-height: 200px;
  padding: 10px;
  position: relative;
  cursor: pointer;
  outline: 2px dashed grey;
  outline-offset: -10px;
  background-color: lightcyan;
  color: gray;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropzone:hover {
  background: lightblue;
}

.dropzone .call-to-action {
  font-size: 1.2rem;
  text-align: center;
  padding-top: 70px;
}

.dropzone .progress-bar {
  padding: 70px 20%;
}
</style>