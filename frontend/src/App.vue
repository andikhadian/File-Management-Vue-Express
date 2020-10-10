<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <SimpleUpload />
        </div>
        <div class="column">
          <MultipleUploads />
        </div>
      </div>
      <Dropzone />
    </div>
  </div>
</template>

<script>
import SimpleUpload from "./SimpleUpload";
import MultipleUploads from "./MultipleUploads";
import Dropzone from "./Dropzone";
export default {
  name: "App",
  components: {
    SimpleUpload,
    MultipleUploads,
    Dropzone
  }
};
</script>

<style>
</style> 