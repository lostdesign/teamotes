<template>
  <transition name="fade">
    <router-view />
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
  /* Edit this        ^^^ to change fade duration */
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
