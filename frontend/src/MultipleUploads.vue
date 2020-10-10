<template>
  <form @submit.prevent="sendFile" enctype="multipart/form-data">
    <div v-if="message" :class="`message ${error ? 'is-danger' : 'is-success'}`">
      <div class="message-body">{{message}}</div>
    </div>
    <div class="field">
      <div class="file has-name is-boxed is-warning">
        <label class="file-label">
          <input
            multiple
            class="file-input"
            ref="files"
            @change="selectFile"
            type="file"
            name="resume"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">Choose a file…</span>
          </span>
        </label>
      </div>
    </div>

    <div class="field">
      <div
        v-for="(item, index) in files"
        :key="index"
        :class="`level ${item.invalidMessage && 'has-text-danger'}`"
      >
        <div class="level-left">
          <div class="level-item">
            {{item.name}}
            <span v-if="item.invalidMessage">&nbsp;- {{item.invalidMessage}}</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <a @click.prevent="files.splice(index, 1);uploadFiles.splice(index, 1)" class="delete"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="field">
      <button class="button is-info">Send</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import _ from "lodash";
export default {
  name: "MultipleUpload",
  data() {
    return {
      files: [],
      uploadFiles: [],
      message: "",
      error: false
    };
  },
  methods: {
    selectFile() {
      const newFiles = this.$refs.files.files;
      this.uploadFiles = [...this.uploadFiles, ...newFiles];
      this.files = [
        ...this.files,
        ..._.map(newFiles, file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          invalidMessage: this.validate(file)
        }))
      ];
    },
    validate(file) {
      // 100 KB
      const MAX_SIZE = 100000;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file.size > MAX_SIZE) {
        return `Max size: ${MAX_SIZE / 1000}Kb`;
      }
      if (!allowedTypes.includes(file.type)) {
        return "Not an image";
      }

      return "";
    },
    async sendFile() {
      const formData = new FormData();
      _.forEach(this.uploadFiles, file => {
        if (this.validate(file) === "") {
          formData.append("files", file);
        }
      });

      try {
        await axios.post("/multiple", formData);
        this.message = "Files has been uploaded";
        this.files = [];
        this.uploadFiles = [];
      } catch (error) {
        this.message = error.response.data.error;
        this.error = true;
      }
    }
  }
};
</script>

<style>
</style>