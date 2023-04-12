<template>
  <h1 class="title">hello app</h1>
  <el-button type="primary">123</el-button>
  <ul>
    <li>
      <router-link to="/home">home</router-link>
    </li>
    <li>
      <router-link to="/about">about</router-link>
    </li>
  </ul>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="less" scoped>
.title {
  color: pink;
}
</style>
