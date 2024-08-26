<script setup>

</script>

<template>
  <div class="browse">
    <div class="browse-header">
      <div class="browse-header-left">
        <div class="browse-header-left-title">
          <span class="browse-header-left-title-text">Tickets</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.browse {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-1);
}

.browse-header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.browse-header-left {
  display: flex;
  align-items: center;
}

.browse-header-left-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}
</style>