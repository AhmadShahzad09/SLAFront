<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: mapState({
    alert: (state) => state.settings.alert
  }),
  watch: {
    alert (value) {  
      if (value && value.msg) {
        if (value.type === 'error') {
          this.$notify.error({
            title: 'Error',
            dangerouslyUseHTMLString: true,
            message: value.msg === 'apiError' ? this.$t(value.msg) : value.msg
          })
        } else {
          this.$notify.success({
            title: 'Success',
            message: value.msg
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
html,
body {
  font-family: "Soho", Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-kerning: none;
  scrollbar-width: none;

  .ods-scrollbar--main-content {
    height: calc(100vh - 64px);
    -ms-overflow-style: -ms-autohiding-scrollbar;
    box-sizing: border-box;
    padding: 24px;
    background: $--color-neutral-4;
  }

  .ods-scrollbar__wrap {
    scrollbar-width: none;
  }

  .fade-enter-active {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: slidein;
  }

  .fade-leave-active {
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-name: zoom;
  }
  .fade-leave-active {
    animation-direction: reverse;
  }
  @keyframes zoom {
    from {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes slidein {
    from {
      margin-left: 100%;
      width: 300%;
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }
}
</style>
