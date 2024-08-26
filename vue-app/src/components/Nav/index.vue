<script setup>
defineOptions({ name: "Nav" });
import { useRouter } from "vue-router";
import links from "./data/link-list.js";
import NavLink from "./components/NavLink.vue";
import { ref } from "vue";

const router = useRouter();


const toHome = () => {
  router.push("/");
};
</script>

<template>
  <nav class="nav">
    <div class="nav-content">
      <div class="items">
        <NavLink v-for="(link, index) in links" :key="`nav-link-${index}`" :icon-component="link.icon"
          :page-name="link.pageName" :text="link.text" />
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  position: relative;
  height: 93px;
  width: 100%;
  .nav-content {
    border-radius: 15px 15px 0 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 93px;
    background: var(--background-linear);
    padding: 15px 15px;
    color: var(--text-color);
    outline-offset: -1px;
    outline: 1px rgba(var(--text-color-rgb), 0.1) solid;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: fixed;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

   .nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
   }
  }
}
</style>
