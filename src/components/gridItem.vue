<template>
  <div class="h-full w-full">
    <img
      :src="'file:///' + image.path"
      :alt="image.name"
      class="w-full h-full cursor-pointer h-auto bg-gray-800 rounded-lg object-scale-down transition duration-150 ease-in-out active:bg-gresen-300 transform active:duration-300 active:transform active:scale-95"
      :isCopying="image.isCopying"
    />
    <div
      class="overlay absolute pointer-events-none w-full h-full flex items-center justify-center bg-indigo-700 bg-opacity-75 opacity-0 top-0 left-0 text-xl font-bold transition duration-300"
    >
      <icon>check</icon>Copied
    </div>
  </div>
</template>

<style scoped>
img[isCopying] + .overlay {
  opacity: 1;
}
</style>

<script>
const icon = () => import('@/components/icon');

export default {
  name: 'gridItem',
  props: ['image'],
  components: {
    icon
  },
}
</script>