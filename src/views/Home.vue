<template>
  <main>
    <template v-if="finishedLoading">
      <div class="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
        <template v-for="(image, key) in images">
          <div class="bg-white p-1 rounded-lg hover:bg-blue-900" :key="key">
            <img
              :src="image.path"
              alt
              class="w-full object-cover object-center rounded-lg cursor-pointer"
              @click="copyImageToClipboard(image)"
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

    this.finishedLoading = true
  }
}
</script>
