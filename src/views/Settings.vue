<template>
  <Layout>
    <main class="p-5">
      <div>
        <h1>Settings</h1>
        <h2 class="mb-1">Emotes  paths</h2>
        <div v-for="(media, index) in mediaPaths" :key="index">
          <div class="flex items-center mb-3">
            <p class="mr-3">
              <code class="text-sm bg-black bg-opacity-50 p-1 rounded text-opacity-50">
                <template v-if="media.path">{{ media.path }}</template>
                <template v-else><i>none</i></template>
              </code>
            </p>
            <choosePath class="mr-3" :index="index" @localStorageUpdate="updateMediaPath($event)" />
            <button
              class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-700 hover:bg-red-500 focus:outline-none active:bg-red-700 transition ease-in-out duration-150 cursor-pointer" 
              @click="removeMediaPath(index)"
            >
              <svg
                class="icon icon-tabler icon-tabler-trash mr-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z"/>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
              Remove
            </button>
          </div>
        </div>
        <button
          class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
          @click="addMediaPath"
        >
          <svg
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="mr-3"
          >
            <path stroke="none" d="M0 0h24v24H0z"/>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add a folder
        </button>
        <button
          class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
          @click="reloadPage"
        >
          <svg
            class="icon icon-tabler icon-tabler-refresh mr-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
          </svg>
          Reload
        </button>
      </div>
      <div>
        <h2 class="mt-5">Reset emote counter</h2>
        <p>By clicking this button, all your click stats will be deleted right away without warning.</p>
        <button
          class="mt-5 inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-700 hover:bg-red-500 focus:outline-none active:bg-red-700 transition ease-in-out duration-150 cursor-pointer"
          @click.prevent="resetCounter"
        >
          <svg
            class="icon icon-tabler icon-tabler-rotate mr-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" />
          </svg>
          Reset
        </button>
      </div>
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
      mediaPaths: localStorage.getItem("mediaPaths") === null ? [] : JSON.parse(localStorage.getItem("mediaPaths"))
    }
  },
  components: {
    choosePath,
    Layout
  },
  methods: {
    addMediaPath() {
      this.mediaPaths.push({ path: null });
      this.saveEdits(this.mediaPaths);
    },
    updateMediaPath(event) {
      if(event.path !== undefined) {
        this.$set(this.mediaPaths, event.index, { path: event.path });
        this.saveEdits(this.mediaPaths);
      }
    },
    removeMediaPath(index) {
      this.mediaPaths.splice(index, 1);
      this.saveEdits(this.mediaPaths);
    },
    saveEdits(paths) {
      localStorage.setItem("mediaPaths", JSON.stringify(paths));
    },
    async resetCounter() {
      this.mediaPaths.map(async (media) => {
        await fs.promises.readdir(media.path, (err, files) => {
          const filteredFiles = files.filter(file => {
            if (/.(jpe?g|png|gif)$/.test(file)) {
              localStorage.removeItem(file)
            }
          })
        })
      })
    },
    reloadPage() {
      window.location.reload(true);
    }
  }
}
</script>
