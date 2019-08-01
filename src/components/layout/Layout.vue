<template>
<nav>
    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" v-show="hidden"></v-toolbar-side-icon>
      <v-toolbar-title>GSPE</v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat class="ml-5" to="/reports">Report</v-btn>
      <v-btn flat to="/rules">Rules</v-btn>
      <v-btn flat to="/scheduler">Scheduler</v-btn>
      <v-btn flat to="/calendar">Calendar</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn flat @click="logOut">Log Out</v-btn>
    </v-toolbar>

    <v-navigation-drawer class="primary" absolute temporary v-model="drawer">
      <v-list>
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        @click="otherPage(item.link)"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid fill-height>
        <slot></slot>
      </v-container>
    </v-content>
</nav>
</template>

<script>
export default {
name: "layout",
data() {
  return {
    hidden: false,
    drawer: false,
    items: [
      {
        title: "Reports",
        icon: "note",
        link: "/reports"
      },
      {
        title: "Rules",
        icon: "settings_input_component",
        link: "/rules"
      },
      {
        title: "Scheduler",
        icon: "scedule",
        link: "/scheduler"
      },
      {
        title: "Calendar",
        icon: "event",
        link: "/calendar"
      },
    ]
  }
},
methods: {
  logOut() {
    this.$cookies.remove("token");
    this.$router.push({path: "/"})
  },
  otherPage(item) {
    return this.$router.push({path: item})
  }
},
mounted() {
  if(window.innerWidth < 1080) {
    this.hidden = true
  } else {
    this.hidden = false
  }
}
}
</script>

<style>

</style>
