<template>
<div>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>REPORT TB</v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat class="ml-5" to="/reports" active-class>Report</v-btn>
      <v-btn flat to="/rules">Rules</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn flat @click="logOut">Log Out</v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <slot></slot>
      </v-container>
    </v-content>
</div>
</template>

<script>
export default {
name: "layout",
methods: {
  logOut() {
    this.$cookies.remove("token");
    this.$router.push({path: "/"})
  }
}
}
</script>

<style>

</style>
