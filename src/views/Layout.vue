<template>
  <div class="flex">
    <navBar />
    <div class="pl-5 pb-5 pt-5 text-white w-full">
      <slot />
    </div>
  </div>
</template>

<script>
import navBar from "../components/navBar"

export default {
  components: {
    navBar,
  },
}
</script>