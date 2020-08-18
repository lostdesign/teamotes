<template>
  <Layout>
    <main class="flex flex-col">
      <input 
        type="text" 
        id="emoteSearch" 
        tabindex="4"
        :placeholder='`Search ${images.length} emotes (Press "/" to focus)`' 
        class="bg-gray-800 px-3 py-2 rounded-lg border-4 border-gray-900 border-solid focus:border-indigo-700 outline-none  block w-full sm:text-sm text-white sm:leading-5 mb-5" v-model="searchValue" @keyup="filterImages" style="width: calc(100% - 1.25rem)"
      >
      <div class="flex">
        <template v-if="finishedLoading">
          <div
            class="column flex flex-col flex-grow"
            v-for="(column, columnKey) in columns" 
            :style="{ width: `${100 / columnCount}%`}" 
            :key="columnKey"
          >
            <div 
              v-for="(image, imageKey) in column"
              :tabindex="imageKey+10"
              :key="imageKey"
              class="cursor-pointer relative h-auto bg-gray-800 hover:bg-gray-600 mb-5 rounded-lg object-cover overflow-hidden border-4 border-gray-900 hover:border-solid hover:border-indigo-700 focus:border-indigo-700 outline-none"
              @click="copyImageToClipboard(image, columnKey, imageKey)"
              @keydown.enter="copyImageToClipboard(image, columnKey, imageKey)"
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
          <div class="flex justify-center items-center w-full flex-col">
            <h1>Loading content...</h1>
          </div>
        </template>
      </div>
    </main>
  </Layout>
</template>

<style scoped>
.column > div {
  width: calc(100% - 1.25rem); 
}

img[isCopying] + .overlay {
  opacity: 1;
}
</style>

<script>
const fs = window.require('fs')
const path = window.require('path')

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
    copyImageToClipboard(image) {
      let copyCount = localStorage.getItem(image.name)
      localStorage.setItem(image.name, ++copyCount)

      const buffer = Buffer.from(fs.readFileSync(image.path)).toString('base64')
      
      // TODO get dynamic file type
      const blob = this.b64ToBlob(buffer, 'image/png', 512)
      const item = new ClipboardItem({ "image/png": blob })
      
      image.isCopying = true

      setTimeout(() => {
        image.isCopying = false
      }, 450)

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
      if (this.timeout) {
        window.cancelAnimationFrame(this.timeout)
      }
      this.timeout = window.requestAnimationFrame(() => {

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
	    })
    },
    filterImages() {
      this.generateColumns()
    }
  },
  mounted() {
    if(this.mediaPath) this.loadImages()

    this._keyListener = function(e) {
      console.log(e.key)
      if (e.key === "/" || e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
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
