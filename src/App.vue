<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
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