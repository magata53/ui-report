<template>
  <div>
    <v-card>
      <!-- Dialog loading for wait response from API -->
      <v-dialog v-model="loading" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please wait ......
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Header Card -->
      <v-toolbar dark color="primary">
        <v-toolbar-title>Report</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="deep-orange" dark class="mb-2" v-if="token != ''" @click="logout">Log out</v-btn>
        <v-dialog v-model="dialogLogin" max-width="500px" v-if="token === ''">
          <template v-slot:activator="{ on }">
            <v-btn color="deep-orange" dark class="mb-2" v-on="on">Login</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Login</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="login.username" label="Username"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="login.password" label="Password" type="password"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="closeLogin">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="loginTb">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <!-- Body Card -->
      <v-card-text>
        <!-- Text error -->
        <v-layout align-center justify-center v-if="error">
          <p class="error--text">{{error}}</p>
        </v-layout>
        <!-- Form report -->
        <v-layout wrap>
          <!-- Input Customer -->
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
          <!-- Input Entity Type -->
          <v-flex xs12 v-if="form.customer">
            <v-layout>
              <v-flex xs4 align-self-center>
                Entity Type
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select v-model="form.entityType" :items="listEntityType"></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Input Device (with check entityType === DEVICE) -->
          <v-flex xs12 v-if="form.entityType === 'DEVICE'">
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
          <!-- Input Device (with check entityType === ASSET) -->
          <v-flex xs12 v-if="form.entityType === 'ASSET'">
            <v-layout>
              <v-flex xs4 align-self-center>
                Asset Name
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select
                  v-model="form.asset"
                  :items="listAsset"
                  item-text="name"
                  item-value="id"
                  @change="onChangeAsset"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Input Device (with check entityType === ENTITY_VIEW) -->
          <v-flex xs12 v-if="form.entityType === 'ENTITY_VIEW'">
            <v-layout>
              <v-flex xs4 align-self-center>
                Entity View Name
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select
                  v-model="form.entityView"
                  :items="listEntityView"
                  item-text="name"
                  item-value="id"
                  @change="onChangeEntityView"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Input Variable (with check not empty device) -->
          <v-flex xs12 v-if="form.device || form.asset || form.entityView">
            <v-layout style="height: 200px; overflow-y: auto;">
              <v-flex xs4 align-self-center>
                Variable
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs6>
                <v-layout column style>
                  <v-flex xs12 v-if="this.listVariables.length === 0">
                    <p class="error--text">No Variables Available</p>
                  </v-flex>
                  <v-flex xs12 v-for="item in listVariables" :key="item">
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
          <!-- Select Start Date and Time -->
          <v-flex xs12>
            <v-layout>
              <!-- Date Picker Start Date -->
              <v-flex xs4 align-self-center>
                Start Date
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs3>
                <v-menu
                  v-model="menuStartdate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="form.startTs" prepend-icon="event" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="form.startTs" @input="menuStartdate = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <!-- Time Picker Start Time -->
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
          <!-- Select End Date and Time -->
          <v-flex xs12>
            <v-layout>
              <!-- Date Picker End Date -->
              <v-flex xs4 align-self-center>
                End Date
                <span class="error--text">*</span>
              </v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs3>
                <v-menu
                  v-model="menuEnddate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="form.endTs" prepend-icon="event" readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="form.endTs" @input="menuEnddate = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <!-- Time Picker End Time -->
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
          <!-- Input Mode / Agg -->
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>Mode</v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-select v-model="form.agg" :items="listMode"></v-select>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Input Limit Data telemetry -->
          <v-flex xs12>
            <v-layout>
              <v-flex xs4 align-self-center>Limit (data)</v-flex>
              <v-flex xs2 align-self-center>:</v-flex>
              <v-flex xs4>
                <v-text-field v-model="form.limit" type="number"></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Input Interval -->
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
        <!-- Text Support -->
        <v-layout column>
          <v-flex>
            <p class="error--text">*Required</p>
          </v-flex>
          <v-flex>
            <p class="primary--text">*Login needed</p>
          </v-flex>
          <v-flex>
            <p class="primary--text">*Default Limit is 100 data</p>
          </v-flex>
        </v-layout>
        <v-spacer></v-spacer>
        <!-- Button Download -->
        <v-btn color="blue darken-1" @click="donwloadReport" class="white--text">Dowload</v-btn>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
const URL = `http://${window.location.host}:5005/api/get/report`;
const MILLISECONDS_TO_MINUTES = 6000;

export default {
  name: "hello-world",
  data: () => ({
    token: "",
    dialogLogin: false,
    error: "",
    loading: false,
    menuStartdate: false,
    menuStartTime: false,
    menuEnddate: false,
    menuEndTime: false,
    listVariables: [],
    listCustomer: [{ id: null, name: "select" }],
    listDevice: [{ id: null, name: "select" }],
    listAsset: [{ id: null, name: "select" }],
    listEntityView: [{ id: null, name: "select" }],
    listMode: [],
    listEntityType: [],
    form: {
      customer: null,
      entityType: null,
      asset: null,
      entityView: null,
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
      entityType: null,
      asset: null,
      entityView: null,
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
    login: {
      username: "",
      password: ""
    },
    defaultLogin: {
      username: "",
      password: ""
    }
  }),
  methods: {
    logout() {
      this.token = "";
      this.$cookies.remove("token");
      window.open = `http://${window.location.host}:8080`;
    },
    closeLogin() {
      this.dialogLogin = false;
    },
    loginTb() {
      this.loading = true;
      let body = {
        username: this.login.username,
        password: this.login.password
      };
      this.$http
        .post(`${URL}/token`, body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          this.$cookies.set("token", res.data);
          this.getCustomer();
          this.token = "login";
          this.dialogLogin = false;
          this.login = Object.assign({}, this.defaultLogin);
          this.loading = false;
        });
    },
    getCustomer() {
      this.$http
        .post(
          `${URL}/customerList`,
          { token: "Bearer " + this.$cookies.get("token") },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            this.listCustomer.push(res.data[i]);
          }
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getDevice(val) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/customerDevices`,
          { customer: val, token: "Bearer " + this.$cookies.get("token") },
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
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getAsset(val) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/customerAssets`,
          { customer: val, token: "Bearer " + this.$cookies.get("token") },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let j = 0; j < res.data.length; j++) {
            this.listAsset.push(res.data[j]);
          }
          this.loading = false;
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getEntityView(val) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/customerEntityView`,
          { customer: val, token: "Bearer " + this.$cookies.get("token") },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let j = 0; j < res.data.length; j++) {
            this.listEntityView.push(res.data[j]);
          }
          this.loading = false;
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getVariable(val, entityType) {
      this.loading = true;
      this.$http
        .post(
          `${URL}/attributes`,
          {
            entityType: entityType,
            entityId: val,
            token: "Bearer " + this.$cookies.get("token")
          },
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
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
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
    getEntityType() {
      const entityType = [
        { text: "Select", value: null },
        { text: "Asset", value: "ASSET" },
        { text: "Device", value: "DEVICE" },
        { text: "Entity View", value: "ENTITY_VIEW" }
      ];
      this.listEntityType = entityType;
    },
    onChangeCustomer(val) {
      this.getDevice(val);
      this.getAsset(val);
      this.getEntityView(val);
    },
    onChangeDevice(val) {
      let entityType = this.form.entityType;
      this.getVariable(val, entityType);
    },
    onChangeAsset(val) {
      let entityType = this.form.entityType;
      this.getVariable(val, entityType);
    },
    onChangeEntityView(val) {
      let entityType = this.form.entityType;
      this.getVariable(val, entityType);
    },
    donwloadReport() {
      if (this.form.customer === null) {
        this.error = "Customer cannot be empty";
      } else if (this.form.entityType === null) {
        this.error = "Enity Type cannot be empty";
      } else if (
        this.form.device === null &&
        this.form.asset === null &&
        this.form.entityView === null
      ) {
        this.error = "Asset or Device or Entity View cannot be empty";
      } else if (this.form.telemetries.length === 0) {
        this.error = "Must select one or more variable";
      } else if (this.form.startTs === "" || this.form.startTime === "") {
        this.error = "Start date and time cannot be empty";
      } else if (this.form.endTs === "" || this.form.endTime === "") {
        this.error = "End date and time cannot be empty";
      } else {
        this.loading = true;
        let entityId = "";
        if (this.form.entityType === "ASSET") {
          entityId = this.form.asset;
        } else if (this.form.entityType === "DEVICE") {
          entityId = this.form.device;
        } else {
          entityId = this.form.entityView;
        }
        let body = {
          entityType: this.form.entityType,
          entityId: entityId,
          telemetries: this.form.telemetries.join(),
          startTs: new Date(
            this.form.startTs + " " + this.form.startTime
          ).getTime(),
          endTs: new Date(this.form.endTs + " " + this.form.endTime).getTime(),
          agg: this.form.agg,
          limit: this.form.limit,
          interval: parseInt(this.form.interval) * MILLISECONDS_TO_MINUTES,
          token: "Bearer " + this.$cookies.get("token")
        };
        this.$http
          .post(`${URL}`, body, {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            if (res.status === 200) {
              if (this.form.entityType === "ASSET") {
                for (let x = 0; x < this.listAsset.length; x++) {
                  if (this.form.asset === this.listAsset[x].id) {
                    fileDownload(
                      res.data,
                      `${
                        this.listAsset[x].name
                      }-${new Date().toLocaleString()}.xlsx`
                    );
                  }
                }
              } else if (this.form.entityType === "DEVICE") {
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
              } else {
                for (let x = 0; x < this.listEntityView.length; x++) {
                  if (this.form.entityView === this.listEntityView[x].id) {
                    fileDownload(
                      res.data,
                      `${
                        this.listEntityView[x].name
                      }-${new Date().toLocaleString()}.xlsx`
                    );
                  }
                }
              }

              this.loading = false;
              this.form = Object.assign({}, this.default);
              this.error = "";
            }
          })
          .catch(err => {
            if (err) {
              this.error = "Can't connect to the server";
            }
          });
      }
    }
  },
  mounted() {
    this.getMode();
    this.getEntityType();
  },
  beforeDestroy() {
    if (this.$cookies.isKey("token")) {
      this.$cookies.remove("token");
    }
  }
};
</script>

<style>
</style>
