<template>
  <div class="w-full">
    <div v-if="finishedLoading"
      class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 px-5 mb-5"
    >
      <template v-for="(image, imageKey) in filteredImagesList">
        <gridItem :key="imageKey" :image="image" :imageKey="0" :imageSize="imageSize"/>
      </template>
    </div>
    <div class="flex justify-center items center p-5" v-else>
      Loading your media, hold on tight ...
    </div>
  </div>
</template>

<script>
const fs = window.require('fs')
const path = window.require('path')
const mime = window.require('mime-types')

const icon = () => import('@/components/icon');
const gridItem = () => import('@/components/gridItem');

export default {
  name: 'itemGrid',
  props: ['imageSize'],
  data() {
    return {
      images: [],
      finishedLoading: false,
      mediaPath: this.$route.query.path,
      mediaPaths: localStorage.getItem("mediaPaths") === null ? [] : JSON.parse(localStorage.getItem("mediaPaths"))
    };
  },
  mounted() {
    // // fallback to first media path
    // if (this.$route.query.path === undefined) {
    //   if(this.mediaPaths[0]) {
    //     this.mediaPath = this.mediaPaths[0].path
    //   }
    // }

    if (this.mediaPath) this.loadImages();
  },
  components: {
    gridItem,
    icon,
  },
  watch: {
    '$route.query.path': function (newVal, old) {
      this.mediaPath = newVal;
      this.loadImages();
    }
  },
  methods: {
    async loadImages() {
      this.images = [];
      let self = this;
      await fs.promises.readdir(this.mediaPath, (err, files) => {
        const filteredFiles = files.filter(file => {
          if (/.(jpe?g|png)$/.test(file)) {
            self.images.push({
              isCopying: false,
              name: file,
              fileType: mime.contentType(path.extname(`${path.join(self.mediaPath, file)}`)),
              fileOrigin: self.mediaPath,
              path: `${path.join(self.mediaPath, file)}`,
              count: localStorage.getItem(file) || localStorage.setItem(file, 0)
            })
          }
        })
        self.finishedLoading = true;
        self.$emit('count', self.images.length);
      })
    },
  },
  computed: {
    filteredImagesList() {
      if (!this.$attrs.value) return this.images
      return this.images.filter(image => {
        return image.name.toLowerCase().includes(this.$attrs.value.toLowerCase())
      })
    }
  },
};
</script>
