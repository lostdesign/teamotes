<template>
  <Layout>
    <main class="flex flex-col">
      <div class="sticky top-0 z-10 p-5 bg-gray-900">
        <input 
          type="text" 
          id="emoteSearch" 
          tabindex="4"
          :placeholder='`Search ${images.length} emotes (Press "/" to focus)`' 
          class="bg-gray-800 px-3 py-2 rounded-lg border-4 border-gray-900 focus:border-indigo-700 outline-none  block w-full sm:text-sm text-white sm:leading-5" v-model="searchValue"
        >
      </div>
      <template v-if="finishedLoading">
        <div class="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4 px-5 mb-5">
          <div 
            v-for="(image, imageKey) in filteredImagesList"
            :tabindex="imageKey+10"
            :key="imageKey"
            class="flex justify-center items-center cursor-pointer relative h-auto bg-gray-800 rounded-lg object-cover overflow-hidden border-4 border-gray-900 hover:border-indigo-700 focus:border-indigo-700 outline-none"
            @click="copyImageToClipboard(image, imageKey)"
            @keydown.enter="copyImageToClipboard(image, imageKey)"
          >
            <img
              :src="'file:///' + image.path"
              :alt="image.name"
              class="w-full cursor-pointer h-auto bg-gray-800 rounded-lg object-cover transition duration-150 ease-in-out active:bg-gresen-300 transform active:duration-300 active:transform active:scale-95"
              :isCopying="image.isCopying"
            />
            <div class="overlay absolute pointer-events-none w-full h-full flex items-center justify-center bg-indigo-700 bg-opacity-75 opacity-0 top-0 left-0 text-xl font-bold transition duration-300">
              <Icon>check</Icon> Copied
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-center items-center w-full px-5 h-screen -mt-32">
          <h1>Loading content...</h1>
        </div>
      </template>
    </main>
  </Layout>
</template>

<style scoped>
img[isCopying] + .overlay {
  opacity: 1;
}
</style>

<script>
const fs = window.require('fs')
const path = window.require('path')
const mime = window.require('mime-types')

import choosePath from '../components/choosePath'
import Layout from './Layout'
import Icon from '@/components/icon'

export default {
  name: 'Home',
  data() {
    return {
      finishedLoading: false,
      images: [],
      columns: [],
      columnCount: 0,
      mediaPath: localStorage.getItem("mediaPath"),
      searchValue: null,
      timeOut: null,
    }
  },
  components: {
    Layout,
    choosePath,
    Icon,
  },
  methods: {
    async copyImageToClipboard(image) {
      image.isCopying = true

      let copyCount = localStorage.getItem(image.name)
      localStorage.setItem(image.name, ++copyCount)

      const file = await fs.promises.readFile(image.path)
      const buffer = await Buffer.from(file).toString('base64')

      const blob = this.b64ToBlob(buffer, image.fileType, 512)

      setTimeout(() => {
        image.isCopying = false
      }, 450)

      // TODO get dynamic file type
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    },
    async loadImages() {
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png)$/.test(file)) {
            this.images.push({
              isCopying: false,
              fileType: mime.contentType(path.extname(`${path.join(this.mediaPath, file)}`)),
              name: file,
              path: `${path.join(this.mediaPath, file)}`,
              count: localStorage.getItem(file) || localStorage.setItem(file, 0)
            })
          }
        })
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
  },
  mounted() {
    if(this.mediaPath) this.loadImages()

    this._keyListener = function(e) {
      if (e.key === "/" || e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.searchValue = null
        document.getElementById("emoteSearch").focus()
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this));
  },
  computed: {
    filteredImagesList() {
      if (!this.searchValue) return this.images
      return this.images.filter(image => {
        return image.name.toLowerCase().includes(this.searchValue.toLowerCase())
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this._keyListener)
    document.removeEventListener('resize', this.generateColumns)
  }
}
</script>
