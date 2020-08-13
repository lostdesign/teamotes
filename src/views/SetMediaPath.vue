<template>
  <main class="flex flex-col sm:flex-col md:flex-row justify-center items-center h-screen w-full p-16 space-x-0 sm:space-x-0 md:space-x-16 space-y-16 sm:space-y-16 md:space-y-0">
    <undrawEmpty class="w-full sm:w-full md:w-1/2" />
    <div class="w-full sm:w-full md:w-1/2 p-5 bg-gray-80s0 text-white rounded-lg flsex flex-col justify-center items-center">
      <p class="mb-5 font-black text-2xl tesxt-center">Get started by choosing a folder for your images!</p>
      <choosePath @localStorageUpdate="updateMediaPath" />
    </div>
  </main>
</template>

<script>
import choosePath from "../components/choosePath"
import undrawEmpty from "../assets/undraw_empty.svg"

export default {
  components: {
    choosePath,
    undrawEmpty    
  },
  methods: {
    updateMediaPath(value) {
      this.$router.push('/')
    },
  }
}
</script>