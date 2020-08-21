<template>
  <Layout>
    <main class="p-5">
      <h1>Settings</h1>
      <h2>Current Path</h2>
      <p>{{ mediaPath }}</p>
      <choosePath @localStorageUpdate="updateMediaPath" class="mt-5"/>
      <h2 class="mt-5">Reset emote counter</h2>
      <p>By clicking this button, all your click stats will be deleted right away without warning.</p>
      <button
        class="mt-5 inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-700 hover:bg-red-500 focus:outline-none active:bg-red-700 transition ease-in-out duration-150 cursor-pointer" 
        @click.prevent="resetCounter">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash mr-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
        Reset
      </button>
    </main>
  </Layout>
</template>

<script>
const fs = window.require('fs')
const path = window.require('path')

import choosePath from '../components/choosePath'
import Layout from './Layout'

export default {
  data() {
    return {
      mediaPath: localStorage.getItem("mediaPath")
    }
  },
  components: {
    choosePath,
    Layout
  },
  methods: {
    updateMediaPath(value) {
      this.mediaPath = value
    },
    async resetCounter() {
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png|gif)$/.test(file)) {
            localStorage.removeItem(file)
          }
        })
      })
    }
  }
}
</script>
