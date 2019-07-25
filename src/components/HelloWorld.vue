<template>
  <div>
    <v-card>
      <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please wait ......
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-toolbar dark color="primary">
        <v-toolbar-title>Report</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-layout align-center justify-center v-if="error">
          <p class="error--text">{{error}}</p>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>
                Customer
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select
                  v-model="form.customer"
                  :items="listCustomer"
                  item-text="name"
                  item-value="id"
                  @change="onChangeCustomer"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 v-if="form.customer">
            <v-layout>
              <v-flex xs4 align-self-center>
                Device Name
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select
                  v-model="form.device"
                  :items="listDevice"
                  item-text="name"
                  item-value="id"
                  @change="onChangeDevice"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 v-if="form.device">
            <v-layout>
              <v-flex xs4 align-self-center>
                Variable
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs6>
                <v-layout wrap>
                  <v-flex xs4 v-if="this.listVariables.length === 0">
                    <p class="error--text">No Variables Available</p>
                  </v-flex>
                  <v-flex xs4 v-for="item in listVariables" :key="item">
                    <v-checkbox
                      v-model="form.telemetries"
                      :label="item"
                      :value="item"
                      color="success"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>
                Start Date
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs3>
                <v-menu
                  ref="menuStartdate"
                  v-model="menuStartdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.startTs"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="form.startTs" prepend-icon="event" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="form.startTs" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuStartdate = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuStartdate.save(form.startTs )">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs3 v-if="form.startTs">
                <v-menu
                  ref="menuStartTime"
                  v-model="menuStartTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.startTime"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.startTime"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuStartTime"
                    v-model="form.startTime"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menuStartTime.save(form.startTime)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>
                End Date
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs3>
                <v-menu
                  ref="menuEnddate"
                  v-model="menuEnddate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.endTs"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="form.endTs" prepend-icon="event" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="form.endTs" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuEnddate = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuEnddate.save(form.endTs)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs3 v-if="form.endTs">
                <v-menu
                  ref="menuEndTime"
                  v-model="menuEndTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.endTime"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.endTime"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuEndTime"
                    v-model="form.endTime"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menuEndTime.save(form.endTime)"
                  ></v-time-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>Mode</v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select v-model="form.agg" :items="listMode"></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>Limit (data)</v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-text-field v-model="form.limit" type="number"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>Interval (minutes)</v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-text-field v-model="form.interval" type="number"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <p class="error--text">*Required</p>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="donwloadReport" class="white--text">Find</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
const URL = `http://192.168.0.27:5005/api/get/report`;

export default {
  name: "hello-world",
  data: () => ({
    error: "",
    loading: false,
    menuStartdate: false,
    menuStartTime: false,
    menuEnddate: false,
    menuEndTime: false,
    listVariables: [],
    listCustomer: [{ id: null, name: "select" }],
    listDevice: [{ id: null, name: "select" }],
    listMode: [],
    form: {
      customer: null,
      device: null,
      telemetries: [],
      startTs: "",
      startTime: "",
      endTs: "",
      endTime: "",
      agg: "NONE",
      limit: "",
      interval: ""
    },
    default: {
      customer: null,
      device: null,
      telemetries: [],
      startTs: "",
      startTime: "",
      endTs: "",
      endTime: "",
      agg: "NONE",
      limit: "",
      interval: ""
    }
  }),
  methods: {
    getCustomer() {
      this.$http
        .get(`${URL}/customerList`)
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            this.listCustomer.push(res.data[i]);
          }
        })
        .catch(err => {});
    },
    getDevice(val) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/customerDevices`,
          { customer: val },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let j = 0; j < res.data.length; j++) {
            this.listDevice.push(res.data[j]);
          }
          this.loading = false;
        })
        .catch(err => {});
    },
    getVariable(val) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/attributes`,
          { device: val },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          this.listVariables = res.data;
          this.loading = false;
        })
        .catch(err => {});
    },
    getMode() {
      const mode = [
        { text: "NONE", value: "NONE" },
        { text: "SUM", value: "SUM" },
        { text: "AVARAGE", value: "AVG" },
        { text: "COUNT", value: "COUNT" },
        { text: "MAX", value: "MAX" },
        { text: "MIN", value: "MIN" }
      ];
      this.listMode = mode;
    },
    onChangeCustomer(val) {
      this.getDevice(val);
    },
    onChangeDevice(val) {
      this.getVariable(val);
    },
    donwloadReport() {
      if (this.form.customer === null) {
        this.error = "Customer cannot be empty";
      } else if (this.form.device === null) {
        this.error = "Device cannot be empty";
      } else if (this.form.telemetries.length === 0) {
        this.error = "Must select one or more variable";
      } else if (this.form.startTs === "" || this.form.startTime === "") {
        this.error = "Start date and time cannot be empty";
      } else if (this.form.endTs === "" || this.form.endTime === "") {
        this.error = "End date and time cannot be empty";
      } else {
        this.loading = true;
        let body = {
          device: this.form.device,
          telemetries: this.form.telemetries.join(),
          startTs: new Date(
            this.form.startTs + " " + this.form.startTime
          ).getTime(),
          endTs: new Date(this.form.endTs + " " + this.form.endTime).getTime(),
          agg: this.form.agg,
          limit: this.form.limit,
          interval: this.form.interval
        };
        console.log(JSON.stringify(body));
        this.$http
          .post(`${URL}`, body, {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            console.log(res);
            if (res.status === 200) {
              for (let x = 0; x < this.listDevice.length; x++) {
                if (this.form.device === this.listDevice[x].id) {
                  fileDownload(
                    res.data,
                    `${
                      this.listDevice[x].name
                    }-${new Date().toLocaleString()}.xlsx`
                  );
                }
              }
              this.loading = false;
              this.form = Object.assign({}, this.default);
            }
          })
          .catch(err => {});
      }
    }
  },
  mounted() {
    this.getCustomer();
    this.getMode();
  }
};
</script>

<style>
</style>
