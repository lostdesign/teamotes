<template>
  <main class="flex">
    <template v-if="finishedLoading">
      <div
        class="column flex flex-col flex-grow"
        v-for="(column, key) in columns" 
        :style="{ width: `${100 / columnCount}%`}" 
        :key="key"
      >
        <img
          v-for="(image, key) in column"
          :key="key"
          :src="'file:///' + image.path"
          class="cursor-pointer h-auto"
          :alt="image.name"
          @click="copyImageToClipboard(image)"
        />
      </div>
    </template>
    <template v-else>
      Loading ...
    </template>
  </main>
</template>

<style scoped>
.column > img {
  margin: 5px;
  width: calc(100% - 10px); 
  /* doing this with margin corrects stretching issue */
}
</style>


<script>
const fs = window.require("fs");
const path = window.require("path");

export default {
  name: "Home",
  data() {
    return {
      mediaPath: localStorage.getItem("mediaPath"),
      finishedLoading: false,
      images: [],
      columns: [],
      columnCount: 0,
    };
  },
  methods: {
    copyImageToClipboard(image) {
      const buffer = Buffer.from(fs.readFileSync(image.path)).toString('base64');
      const blob = this.b64ToBlob(buffer, 'image/png', 512);
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
      console.log(`Copied ${image.name} to clipboard.`);
    },

    b64ToBlob(b64Data, contentType, sliceSize) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },

    generateColumns () {
      this.columnCount = Math.round(window.innerWidth / 200)
      this.columns = []

      for (let i = 0; i < this.columnCount; i++) {
        this.columns.push([])
      }

      this.images.forEach((image, index) => {
        this.columns[
          Math.floor(index / ( this.images.length / this.columnCount ))
        ].push(image)
      })
    },
  },
  async mounted() {
    const files = await fs.promises.readdir(this.mediaPath)

    for (const file of files) {
      if (!/.(jpe?g|png|gif)$/.test(file)) continue;

      this.images.push({
        name: file,
        path: `${path.join(this.mediaPath, file)}`
      });
    }

    this.generateColumns()

    window.addEventListener('resize', this.generateColumns)

    this.finishedLoading = true
  }
}
</script>
