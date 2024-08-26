<script>
export default {
  name: 'SeeAll',
  props: {
    title: {
      type: String,
      default: 'Now playing'
    }
  }
}
</script>

<template>
    <div class="see-all">
      <h2>{{ title }}</h2>
      <p>See all</p>
    </div>
  </template>
  
<style scoped>
  .see-all {
    color: var(--text-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  h2 {
    margin: 0;
    font-family: var(--font-inter);
    font-weight: 700;
    font-size: 18px;
  }

  p {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    font-family: var(--font-inter);
    cursor: pointer;
    color: var(--primary-color);
  }

</style>