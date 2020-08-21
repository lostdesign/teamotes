<template>
  <div>
    <div v-if="finishedLoading"
      class="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4 px-5 mb-5"
    >
      <figure
        v-for="(image, imageKey) in filteredImagesList"
        :tabindex="imageKey+10"
        :key="imageKey"
        class="flex justify-center items-center cursor-pointer relative bg-gray-800 rounded-lg overflow-hidden border-4 border-gray-900 hover:border-indigo-700 focus:border-indigo-700 outline-none"
        @click="copyImageToClipboard(image, imageKey)"
        @keydown.enter="copyImageToClipboard(image, imageKey)"
      >
        <gridItem :image="image" />
      </figure>
    </div>
    <div class="flex justify-center items center p-5" v-else>
      Loading your media, hold on tight ...
    </div>
  </div>
</template>

<style scoped>
img[isCopying] + .overlay {
  opacity: 1;
}
</style>

<script>
const fs = window.require('fs');
const path = window.require('path');
const mime = window.require('mime-types');
const sharp = window.require('sharp');

const icon = () => import('@/components/icon');
const gridItem = () => import('@/components/gridItem');

export default {
  name: 'itemGrid',
  data() {
    return {
      images: [],
      finishedLoading: false,
      mediaPath: localStorage.getItem("mediaPath"),
    };
  },
  components: {
    gridItem,
    icon,
  },
  methods: {
    async copyImageToClipboard(image) {
      image.isCopying = true;

      let copyCount = localStorage.getItem(image.name);
      localStorage.setItem(image.name, ++copyCount);

      const file = await fs.promises.readFile(image.path);
      const buffer = await Buffer.from(file).toString("base64");

      const blob = this.b64ToBlob(buffer, image.fileType, 512);

      setTimeout(() => {
        image.isCopying = false;
      }, 450);

      // TODO get dynamic file type
      // for some reason image/jpg and image/jpeg cause an error "NotAllowedError ..."
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    },
    async loadImages() {
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png)$/.test(file)) {
            this.images.push({
              isCopying: false,
              name: file,
              fileType: mime.contentType(path.extname(`${path.join(this.mediaPath, file)}`)),
              path: `${path.join(this.mediaPath, file)}`,
              count: localStorage.getItem(file) || localStorage.setItem(file, 0)
            })
          }
        })
        this.finishedLoading = true
        this.$emit('count', this.images.length)
      })
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
  mounted() {
    if (this.mediaPath) this.loadImages();
  },
  computed: {
    filteredImagesList() {
      if (!this.$attrs.value) return this.images
      return this.images.filter(image => {
        return image.name.toLowerCase().includes(this.$attrs.value.toLowerCase())
      })
    }
  },
};
</script>
