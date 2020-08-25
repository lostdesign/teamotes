<template>
  <div class="flex py-5 pr-5 items-stretch bg-gray-900 justify-between" style="min-width: 200px">
    <template v-for="size in sizes" class="space-x-5 flex items-center justify-between">
      <div
        :key="size"
        class="px-3 py-2 bg-gray-800 rounded-lg text-sm border-4 border-gray-900 focus:border-indigo-700 hover:border-indigo-700 outline-none cursor-pointer"
        :class="{'border-indigo-700': activeSize === size}"
        @click="setSize(size)"
      >{{ size }}</div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sizes: [50, 100, 150],
      activeSize: parseInt(localStorage.getItem('activeSize')) || localStorage.setItem('activeSize', 50)
    }
  },
  methods: {
    setSize(size) {
      if (size > 150 || size < 50) return
      this.activeSize = size
      localStorage.setItem('activeSize', size)
    }
  },
  mounted() {
    this._keyListener = function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.setSize(this.activeSize + 50)
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.setSize(this.activeSize - 50)
      }
    };

    document.addEventListener("keydown", this._keyListener.bind(this));
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
}
</script>