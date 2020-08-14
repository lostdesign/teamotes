<template>
  <Layout>
    <main class="flex flex-col">
      <input type="text" name="" id="" placeholder="search" class="bg-gray-800 border-none focus:outline-none form-input block w-full sm:text-sm text-white sm:leading-5 mb-5" v-model="searchValue" @keyup="filterImages" style="width: calc(100% - 1.25rem)">
      <div class="flex">
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
              class="cursor-pointer h-auto bg-gray-800 hover:bg-gray-600 hover:opacity-25 mb-5 rounded-lg object-cover transition duration-150 ease-in-out active:bg-green-300 transform active:duration-300 active:transform active:scale-95"
              :alt="image.name"
              @click="copyImageToClipboard(image)"
            />
          </div>
        </template>
        <template v-else>
          <div class="flex justify-center items-center w-full flex-col">
            <h1>Loading content...</h1>
          </div>
        </template>
      </div>
    </main>
  </Layout>
</template>

<style scoped>
.column > img {
  width: calc(100% - 1.25rem); 
}
</style>

<script>
const fs = window.require('fs')
const path = window.require('path')

import choosePath from '../components/choosePath'
import Layout from './Layout'

export default {
  name: 'Home',
  data() {
    return {
      finishedLoading: false,
      images: [],
      columns: [],
      columnCount: 0,
      mediaPath: localStorage.getItem("mediaPath"),
      searchValue: null
    }
  },
  components: {
    Layout,
    choosePath
  },
  methods: {
    copyImageToClipboard(image) {
      let copyCount = localStorage.getItem(image.name)
      localStorage.setItem(image.name, ++copyCount)

      const buffer = Buffer.from(fs.readFileSync(image.path)).toString('base64')
      
      // TODO get dynamic file type
      const blob = this.b64ToBlob(buffer, 'image/png', 512)
      const item = new ClipboardItem({ "image/png": blob })
      
      navigator.clipboard.write([item])
      console.log(`Copied ${image.name} to clipboard.`)
    },
    async loadImages() {
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png|gif)$/.test(file)) {
            this.images.push({
              isCopying: false,
              name: file,
              path: `${path.join(this.mediaPath, file)}`,
              count: localStorage.getItem(file) || localStorage.setItem(file, 0)
            })
          }
        })
        this.generateColumns()

        window.addEventListener('resize', this.generateColumns)

        this.finishedLoading = true
      })
    },
    b64ToBlob(b64Data, contentType, sliceSize) {
      const byteCharacters = atob(b64Data)
      const byteArrays = []

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)
        const byteNumbers = new Array(slice.length)
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
    generateColumns () {
      this.columnCount = Math.round(window.innerWidth / 200)
      this.columns = []

      for (let i = 0; i < this.columnCount; i++) {
        this.columns.push([])
      }

      this.filteredImagesList.forEach((image, index) => {
        this.columns[
          Math.floor(index / ( this.filteredImagesList.length / this.columnCount ))
        ].push(image)
      })
    },
    filterImages() {
      this.generateColumns()
    }
  },
  mounted() {
    if(this.mediaPath) this.loadImages()
  },
  computed: {
    filteredImagesList() {
      if (!this.searchValue) return this.images
      return this.images.filter(image => {
        return image.name.toLowerCase().includes(this.searchValue.toLowerCase())
      })
    }
  }
}
</script>
