<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="left">
      <RouterLink to="/">Main page</RouterLink>
      <RouterLink to="/generator">Generator</RouterLink>
      <RouterLink to="/examples">Examples</RouterLink>
    </nav>
    <nav class="right">
      <a href="https://github.com/zbitname/helm-validation-generator"><img src="/src/assets/github.svg" /></a>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  /* width: 100%; */
  font-size: 1rem;
  text-align: left;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
}

nav.left a:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}

nav.left a:first-of-type {
  border: 0;
}

nav.left {
  float: left;
}

nav.right {
  float: right;
}

</style>
