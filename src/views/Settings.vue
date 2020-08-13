<template>
  <Layout>
    <main>
      <h1>Settings</h1>
      <choosePath @localStorageUpdate="updateMediaPath" class="z-50"/>
      <p class="mt-5 font-bold">Current path</p>
      <p>{{ mediaPath }}</p>
    </main>
  </Layout>
</template>

<script>
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
  }
}
</script>
