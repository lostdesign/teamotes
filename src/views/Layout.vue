<template>
  <div class="flex">
    <navBar />
    <div class="text-white w-full">
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