<template>
  <main>
    <template v-if="finishedLoading">
      <div class="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
        <template v-for="image in images">
          <div class="bg-white p-1 rounded-lg hover:bg-blue-900" :key="image.name">
            <img
              :src="`data:image/png;base64, ${image.base64}`"
              alt
              :key="image"
              class="w-full object-cover object-center rounded-lg cursor-pointer"
              @click="copyImageToClipboard(image.base64)"
            />
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      Loading ...
    </template>
  </main>
</template>

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
    };
  },
  methods: {
    copyImageToClipboard(image) {
      const blob = this.b64ToBlob(image, 'image/png', 512);
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
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
  },
  async mounted() {
    const files = await fs.promises.readdir(this.mediaPath)

    for (const file of files) {
      let image = {}
      image.name = file
      image.path = `${this.mediaPath}/${file}`
      image.base64 = Buffer.from(await fs.promises.readFile(image.path)).toString('base64')
      this.images.push(image)
      this.finishedLoading = true
    }
  }
}
</script>
