<template>
  <main>
    <h1>Settings</h1>
    <div>
      <label
        class="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
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
        Choose Media Path
        <input type="file" @click.prevent="openDialog" />
      </label>
    </div>
    <p class="mt-5 font-bold">Current path</p>
    <p>{{ mediaPath }}</p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      mediaPath: localStorage.getItem('mediaPath')
    }
  },
  methods: {
    openDialog() {
      window.ipcRenderer.send('select-dir');
    },
  },
  mounted() {
    window.ipcRenderer.on('select-dir-reply', (event, data) => {
      this.mediaPath = data[0]
      localStorage.setItem('mediaPath', data[0])
    })
  }
};
</script>

<style scoped>
input[type="file"] {
  @apply hidden;
}
</style>