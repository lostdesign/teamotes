<template>
  <Layout>
    <main class="flex">
      <div class="flex flex-col w-full">
        <div class="flex w-full sticky top-0 z-50">
          <search :count="count" v-model="searchValue" />
          <sizeSelector />
        </div>
        <imageGrid v-model="searchValue" :imgSize="activeSize" @count="updateSearch" />
      </div>
      <template v-if="lastImage.name">
        <div class="emotes h-screen p-5 sticky top-0 right-0 border-l border-solid border-gray-800 overflow-hidden" style="min-width:40s0px">
          <h1>{{lastImage.name}}</h1>
          <div class="flex space-x-5 mb-5">
            <template v-for="size in sizes">
              <div :key="size+'_wrapper'" :style="`height: ${size}px; width:${size}px`">
                <gridItem :image="lastImage" :key="size"/>
              </div>
            </template>
          </div>
          <p class="border-4 border-gray-900 text-sm font-bold text-gray-500">Usage</p>
          <p class="border-4 border-gray-900 mb-5">{{lastImage.count}} times</p>
          <p class="border-4 border-gray-900 text-sm font-bold text-gray-500">Change file name</p>
          <p class="border-4 border-gray-900 text-xs text-gray-500">🚧  WIP, currently disabled.</p>
          <input
            class="bg-gray-800 px-3 py-2 rounded-lg border-4 border-gray-900 focus:border-indigo-700 outline-none block w-full sm:text-sm text-white sm:leading-5 mb-2"
            id="emoteName"
            tabindex="0"
            type="text"
            v-model="lastImage.name"
          />
          <div class="bg-indigo-700 rounded-lg px-3 py-2 border-4 border-gray-900 cursor-not-allowed">Save</div>
        </div>
      </template>
      <template v-else>
        <div class="preview h-screen flex justify-center items-center p-5 sticky top-0 right-0 border-l border-solid border-gray-800 " style="min-width:350px">
          <p class="text-gray-500">Click an Image to see more details</p>
        </div>
      </template>
    </main>
  </Layout>
</template>

<style scoped>
img[isCopying] + .overlay {
  opacity: 1;
}
.emotes {
  display: none;
}
.preview {
  display: none;
}
@media (min-width: 740px) {
  .emotes {
    display: block;
  }
  .preview {
    display: flex;
  }
}
</style>

<script>
const fs = window.require('fs')
const path = window.require('path')

import Layout from './Layout'
import imageGrid from '@/components/imageGrid'
import search from '@/components/search'
import sizeSelector from '@/components/sizeSelector'
import gridItem from '@/components/gridItem'

export default {
  name: 'Home',
  data() {
    return {
      count: 0,
      searchValue: null,
      sizes: [50, 100, 150],
      activeSize: localStorage.getItem('currentSize'),
      lastImage: {}
    }
  },
  components: {
    Layout,
    imageGrid,
    search,
    sizeSelector,
    gridItem
  },
  methods: {
    updateSearch(value) {
      this.count = value
    },
    renameImage() {
      console.log(this.lastImage.path, `${this.lastImage.fileOrigin}/${this.lastImage.name}`)
      return
      // TODO update the image also inside the grid without reload
      // e.g. pass the image back as reference
      fs.rename(
        this.lastImage.path,
        `${this.lastImage.fileOrigin}/${this.lastImage.name}`,
        (err) => {
          if (err) throw err
          console.log('RENAMED')
      })
    }
  },
  mounted() {
    window.addEventListener('lastCopiedImage-localstorage-changed', (event) => {
      this.lastImage = event.detail
    });
  },
  computed: {
    getLastImage: {
      get() {
        return this.lastImage
      },
      set(value) {
        let image = JSON.parse(localStorage.getItem('lastCopiedImage')) || {}
        image.isCopying = false
        return image
      },
    }
  }
}
</script>
