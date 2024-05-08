<template>
  <div class="dashboard-container">
    <div class="dashboard-text">此页面开发中...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // }

  data() {
    return {
      //text: '<meting-js server="netease" type="song" id="1437285525"></meting-js>'
      text: '<span>开发中...</span>'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
