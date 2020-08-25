<template>
  <figure
    class="flex justify-center itesms-center cursor-pointer flex-1 items-stretch relative rounded-lg overflow-hidden border-4 border-gray-800 hover:border-indigo-700 focus:border-indigo-700 outline-none select-none"
    :tabindex="0" 
    @click="copyImageToClipboard(image)"
    @keydown.enter="copyImageToClipboard(image)"
  >
    <img
      :src="'file:///' + image.path"
      :alt="image.name"
      class="w-full h-full cursor-pointer h-auto bg-gray-800 object-cover transition duration-150 ease-in-out active:bg-gresen-300 transform active:duration-300 active:transform active:scale-95"
      :isCopying="image.isCopying"
    />
    <transition name="fade">
      <template v-if="image.isCopying">
        <div class="absolute bottom-0 left-0 h-full flex flex-col bg-opacity-75 justify-between w-full bg-indigo-700 font-bold items-stretch text-center p-2 transition duration-100 ease-in z-40">
          <div class="z-50 overlay absolute pointer-events-none w-full h-full flex items-center justify-center top-0 left-0 text-lg font-bold select-none">
            <icon>check</icon>Copied
          </div>
        </div>
      </template>
    </transition>
  </figure>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<script>
const icon = () => import('@/components/icon')
const { clipboard, nativeImage } = window.require('electron')

export default {
  name: 'gridItem',
  props: ['image', 'imageKey'],
  components: {
    icon
  },
  methods: {
    async copyImageToClipboard(image) {
      image.isCopying = true;

      let copyCount = localStorage.getItem(image.name)
      localStorage.setItem(image.name, ++copyCount)

      window.dispatchEvent(new CustomEvent('lastCopiedImage-localstorage-changed', {
        detail: {
          ...image,
          'count': copyCount,
          'isCopying': false
        }
      }))

      const blob = nativeImage
        .createFromPath(image.path)
        .resize({
          width: parseInt(
            localStorage.getItem('activeSize')
          )
        })

      setTimeout(() => {
        image.isCopying = false;
      }, 450);

      clipboard.writeImage(blob)
    },
  },
  computed: {
    activeSize: () => localStorage.getItem('activeSize')
  }
}
</script>