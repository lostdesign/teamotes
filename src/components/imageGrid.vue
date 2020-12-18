<template>
  <div>
    <div v-if="finishedLoading"
      class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 px-5 mb-5"
    >
      <template v-for="(image, imageKey) in filteredImagesList">
        <gridItem :key="imageKey" :image="image" :imageKey="0" :imageSize="imageSize"/>
      </template>
    </div>
    <div class="flex justify-center items center p-5" v-else>
      Loading your media, hold on tight ...
    </div>
  </div>
</template>

<script>
const fs = window.require('fs')
const path = window.require('path')
const mime = window.require('mime-types')

const icon = () => import('@/components/icon');
const gridItem = () => import('@/components/gridItem');

export default {
  name: 'itemGrid',
  props: ['imageSize'],
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
    async loadImages() {
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png)$/.test(file)) {
            this.images.push({
              isCopying: false,
              name: file,
              fileType: mime.contentType(path.extname(`${path.join(this.mediaPath, file)}`)),
              fileOrigin: this.mediaPath,
              path: `${path.join(this.mediaPath, file)}`,
              count: localStorage.getItem(file) || localStorage.setItem(file, 0)
            })
          }
        })
        this.finishedLoading = true
        this.$emit('count', this.images.length)
      })
    },
    async renameImage(file, newName) {
      // Find index of image
      const index = this.images.findIndex(image => image.path === file.path)
      if (index === -1) throw new Error('Image not found')
      
      // Change file name
      await fs.promises.rename(file.path,`${file.fileOrigin}/${newName}`)

      // Update image
      this.images[index].name = newName
      this.images[index].path = file.path.replace(file.name, newName)

      // Update localstorage
      const copyCount = localStorage.getItem(file.name)
      localStorage.setItem(newName, copyCount)
      localStorage.removeItem(file.name)

      // Return new image back to parent
      return { ...this.images[index], count: copyCount, isCopying: false }
    }
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
