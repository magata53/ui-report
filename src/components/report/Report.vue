<template>
  <v-layout align-center justify-center fill-height>
    <v-tabs centered color="cyan" dark icons-and-text v-model="tab">
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab>
        Report
        <v-icon>phone</v-icon>
      </v-tab>

      <v-tab>
        Log
        <v-icon>favorite</v-icon>
      </v-tab>

      <v-tabs-items v-model="tab" align-center justify-center>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <report-pdf></report-pdf>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <report-log></report-log>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-layout>
</template>

<script>
const jwt = require("jsonwebtoken");
import ReportPdf from "./ReportPdf.vue";
import ReportLog from "./ReportLog.vue";
export default {
  name: "report",
  components: {
    ReportPdf,
    ReportLog
  },
  data() {
    return {
      tab: null,
      error: ""
    };
  },
  mounted() {
    let userTB = jwt.decode(this.$cookies.get("token").token);
    this.$http
      .get(
        `http://${window.location.host}:8080/api/user/${userTB.userId}/token`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": `Bearer ${this.$cookies.get("token").token}`
          }
        }
      )
      .then(res => {
        this.$cookies.set("token", res.data);
      })
      .catch(err => {
        if (err) {
          this.error = "Error";
        }
      });
  }
};
</script>

<style>
</style>
