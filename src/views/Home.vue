<template>
  <Layout>
    <main class="flex flex-col">
      <search :count="count" v-model="searchValue" />
      <imageGrid v-model="searchValue" @count="updateSearch" />
    </main>
  </Layout>
</template>

<style scoped>
img[isCopying] + .overlay {
  opacity: 1;
}
</style>

<script>
import Layout from './Layout'
import imageGrid from '@/components/imageGrid'
import search from '@/components/search'

export default {
  name: 'Home',
  data() {
    return {
      count: 0,
      searchValue: null,
    }
  },
  components: {
    Layout,
    imageGrid,
    search
  },
  methods: {
    updateSearch(value) {
      this.count = value
    }
  }
}
</script>
