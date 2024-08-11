<script setup>
defineOptions({ name: "Nav" });
import { useAppStore } from "@stores/app";
import { useRouter } from "vue-router";
import IconInfo from "@icons/nav/IconInfo.vue";
import IconLogo from "@icons/others/IconLogo.vue";
import links from "./data/link-list.js";
import NavLink from "./components/NavLink.vue";
import DialogBlur from "@layouts/DialogBlur.vue";
import InfoModal from "./components/InfoModal.vue";
import { ref } from "vue";

const appStore = useAppStore();
const router = useRouter();

const showInfoModal = ref(false);

const openInfoModal = () => {
  showInfoModal.value = true;
};
const closeInfoModal = () => {
  showInfoModal.value = false;
};
const toHome = () => {
  router.push("/");
};
</script>

<template>
  <nav class="nav">
    <div class="nav-content">
      <div class="logo" type="button">
        <div class="icon-logo">
          <IconLogo />
        </div>
        <span class="version">{{ appStore.version }}</span>
      </div>
      <div class="items">
        <NavLink
          v-for="(link, index) in links"
          :key="`nav-link-${index}`"
          :icon-component="link.icon"
          :page-name="link.pageName"
          :text="link.text"
        />
      </div>
      <button class="button-info" type="button" @click="openInfoModal">
        <div class="icon-info">
          <IconInfo />
        </div>
      </button>
    </div>
    <DialogBlur
      :button-close="true"
      :show="showInfoModal"
      @close="closeInfoModal"
    >
      <InfoModal />
    </DialogBlur>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  height: 100%;
  width: 61px;
  position: relative;
  // &:before {
  //   content: "";
  //   height: 70px;
  //   width: 70px;
  //   background: var(--background-color2);
  // }
  .nav-content {
    background: var(--background-color2);
    width: 61px;
    padding: 15px 0;
    height: 100%;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    left: 0px;
  }
  .logo {
    .icon-logo {
      height: 20px;
    }
    .version {
      font-size: 10px;
    }
    &:after {
      content: "";
      height: 1px;
      width: 100%;
      background: rgb(255 255 255 / 10%);
      margin: 15px 0 0px 0;
      display: block;
    }
  }
  .button-info {
    background: none;
    border: none;
    margin-top: auto;
    .icon-info {
      height: 20px;
      color: var(--text-color);
      transition: 0.3s ease color;
      &:hover {
        color: var(--secondary-color);
      }
    }
  }
  .items {
    width: 100%;
  }
}
</style>
