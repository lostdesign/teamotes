<template>
  <div class="sticky top-0 z-10 p-5 bg-gray-900">
    <input
      class="bg-gray-800 px-3 py-2 rounded-lg border-4 border-gray-900 focus:border-indigo-700 outline-none block w-full sm:text-sm text-white sm:leading-5"
      id="emoteSearch"
      tabindex="4"
      type="text"
      :placeholder='`Search ${count} emotes (Press "/" to focus)`'
      v-model="inputValue"
    />
  </div>
</template>

<script>
export default {
  props: ['value', 'count'],
  computed: {  
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    this._keyListener = function (e) {
      if (e.key === "/" || (e.key === "f" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        this.$emit('input', null)
        document.getElementById("emoteSearch").focus();
      }
    };

    document.addEventListener("keydown", this._keyListener.bind(this));
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
};
</script>
