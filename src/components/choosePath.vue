<template>
  <div>
    <label
      class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
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
      <input type="file" @click.prevent="openDialog" />
    </label>
  </div>
</template>

<script>
export default {
  methods: {
    openDialog() {
      window.ipcRenderer.send("select-dir")
    },
  },
  mounted() {
    window.ipcRenderer.on("select-dir-reply", (event, data) => {
      this.mediaPath = data[0]
      localStorage.setItem("mediaPath", data[0])
      this.$emit('localStorageUpdate', data[0])
    })
  }
}
</script>

<style scoped>
input[type="file"] {
  @apply hidden;
}
</style>