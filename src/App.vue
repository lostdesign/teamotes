<template>
  <router-view />
</template>

<script>
export default {
  methods: {
    openUrl(url) {
      window.ipcRenderer.send('open-url', url)
    }
  }
}
</script>
