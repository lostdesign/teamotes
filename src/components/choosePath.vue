<template>
  <div>
    <button
      class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
      @click="openDialog"
    >
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        height="24"
        width="24"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="mr-3"
      >
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      Open
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickEvent: null
    }
  },
  methods: {
    openDialog() {
      window.ipcRenderer.send("select-dir");
      window.ipcRenderer.once("select-dir-reply", (event, data) => {
        console.log(event)
        this.$emit('localStorageUpdate', { path: data[0], index: this.index })
      })
    },
  },
  props: {
    index: {
      type: Number,
      default: null,
      required: false
    }
  }
}
</script>

<style scoped>
input[type="file"] {
  @apply hidden;
}
</style>
