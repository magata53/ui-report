<template>
  <v-app>
    <component :is="layout">
      <router-view></router-view>
    </component>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  },
  computed: {
    layout() {
      return this.$route.meta.layout || "layout";
    }
  }
};
</script>
