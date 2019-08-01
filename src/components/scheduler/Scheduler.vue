<template>
  <v-layout align-center justify-center fill-height column max-width="100%">
      <!-- Dialog loading for wait response from API -->
    <v-dialog v-model="loadingApi" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please wait ......
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div>
      <!-- Judul tabel scheduler -->
      <v-toolbar>
        <v-toolbar-title>List Of Scheduler</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <!-- Select category component -->
        <v-layout row align-center justify-center>
          <v-flex xs5>
            <v-subheader>Select Category</v-subheader>
          </v-flex>
          <v-flex xs4>
            <v-select v-model="selectedCategory" :items="listCategory" hide-details single-line></v-select>
          </v-flex>
        </v-layout>
        <v-spacer></v-spacer>

        <!-- Dialog buat baru dan edit scheduler -->
        <v-dialog v-model="dialog" persistent max-width="700px">
          <!-- Tombol buat baru -->
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Create</v-btn>
          </template>

          <!-- Isi Dialog -->
          <v-card>
            <!-- Judul Dialog -->
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <!-- Body dialog berisi form untuk buat dan edit -->
            <v-card-text>
              <!-- Form create new -->
              <v-container grid-list-md v-if="method === 'New'">
                <v-layout align-center justify-center v-if="error">
                  <p class="error--text">{{error}}</p>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Name</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-text-field v-model="editedItem.name"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Customer</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.customer" :items="listCustomer" @change="onChangeCustomer" item-text="name" item-value="id"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.customer">
                    <v-layout>
                      <v-flex xs4 align-self-center>Device</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4 align-self-center>
                        <v-select v-model="editedItem.device" :items="listDevice" @change="onChangeDevice" item-text="name" item-value="id"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.device">
                    <v-layout>
                      <v-flex xs4 align-self-center>Telemetry</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.telemetry" :items="listTelemetry"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.telemetry">
                    <v-layout>
                      <v-flex xs4 align-self-center>Type</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.type" :items="listType"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.type === 'control'">
                    <v-layout>
                      <v-flex xs4 align-self-center>Value</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-text-field v-model="editedItem.value"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-else>
                    <v-layout>
                      <v-flex xs4 align-self-center>Value</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.value" :items="listValue"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Category</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.category" :items="listCategoryForm"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Time</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-menu
                          ref="menuTime"
                          v-model="menuTime"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="editedItem.time"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.time"
                              label="Set time"
                              append-outer-icon="access_time"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuTime"
                            v-model="editedItem.time"
                            full-width
                            format="24hr"
                            @click:minute="$refs.menuTime.save(editedItem.time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.category === 'Weekly'">
                    <v-layout>
                      <v-flex xs4 align-self-center>Day</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs6>
                        <v-layout wrap>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Sunday"
                              value="Sunday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Monday"
                              value="Monday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Tuesday"
                              value="Tuesday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Wednesday"
                              value="Wednesday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Thursday"
                              value="Thursday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Friday"
                              value="Friday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Saturday"
                              value="Saturday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-else-if="editedItem.category === 'Monthly'">
                    <v-layout>
                      <v-flex xs4 align-self-center>Date</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-menu
                          v-model="menuDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.date"
                              label="Set date"
                              append-outer-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.date" @input="menuDate = false"></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                      <v-layout>
                      <v-flex xs4 align-self-center>Activation</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                         <v-switch
                      v-model="editedItem.activation"
                      true-value="1"
                      false-value="0"
                      label="Activation"
                      color="success"
                    ></v-switch>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- Form edit -->
              <v-container grid-list-md v-else-if="method === 'Edit'">
                <v-layout align-center justify-center v-if="error">
                  <p class="error--text">{{error}}</p>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Name</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-text-field v-model="editedItem.name"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Category</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-select v-model="editedItem.category" :items="listCategoryForm"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Time</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-menu
                          ref="menuTime"
                          v-model="menuTime"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="editedItem.time"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.time"
                              label="Set time"
                              append-outer-icon="access_time"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuTime"
                            v-model="editedItem.time"
                            full-width
                            format="24hr"
                            @click:minute="$refs.menuTime.save(editedItem.time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.category === 'Weekly'">
                    <v-layout>
                      <v-flex xs4 align-self-center>Day</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs6>
                        <v-layout wrap>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Sunday"
                              value="Sunday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Monday"
                              value="Monday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Tuesday"
                              value="Tuesday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Wednesday"
                              value="Wednesday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Thursday"
                              value="Thursday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Friday"
                              value="Friday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                          <v-flex xs6>
                            <v-checkbox
                              v-model="editedItem.day"
                              label="Saturday"
                              value="Saturday"
                              color="success"
                            ></v-checkbox>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-else-if="editedItem.category === 'Monthly'">
                    <v-layout>
                      <v-flex xs4 align-self-center>Category</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                        <v-menu
                          v-model="menuDate"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.date"
                              label="Set date"
                              append-outer-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.date" @input="menuDate = false"></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4 align-self-center>Activation</v-flex>
                      <v-flex xs2 align-self-center>:</v-flex>
                      <v-flex xs4>
                         <v-switch
                      v-model="editedItem.activation"
                      true-value="1"
                      false-value="0"
                      label="Activation"
                      color="success"
                    ></v-switch>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- Body untuk detail -->
              <v-container grid-list-md v-else-if="method === 'View'">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>Scheduler Name</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>{{editedItem.name}}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>Device Name</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>{{editedItem.deviceName}}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>Category</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>{{editedItem.category}}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>Time</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>{{editedItem.time}}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="editedItem.category === 'Weekly'">
                    <v-layout>
                      <v-flex xs4>Days</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>
                        <span v-for="(item,index) in editedItem.day" :key="index">{{item}}</span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-else-if="editedItem.category === 'Monthly'">
                    <v-layout>
                      <v-flex xs4>Start Date</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>{{editedItem.date}}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>Activation</v-flex>
                      <v-flex xs2>:</v-flex>
                      <v-flex xs4>
                        <span color="success" v-if="editedItem.activation === '1'">ON</span>
                        <span color="error" v-else-if="editedItem.activation === '0'">OFF</span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <!-- Button action edit, buat, cancel, ok -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                flat
                @click="close"
                v-if="method === 'Edit' || method === 'New'"
              >Cancel</v-btn>
              <v-btn
                color="blue darken-1"
                flat
                @click="save"
                v-if="method === 'Edit' || method === 'New'"
              >Save</v-btn>
              <v-btn color="blue darken-1" flat @click="close1" v-else>OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <!-- Tabel daftar scheduler -->
      <v-data-table
        :headers="headers"
        :items="items"
        :search="selectedCategory"
        :loading="loading"
        class="elevation-1"
        :rows-per-page-items="[15,30,50,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.index + 1}}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.deviceName }}</td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td class="text-xs-left">{{ props.item.value }}</td>
          <td class="text-xs-left">{{ props.item.category }}</td>

          <td class="text-xs-left">
            <v-btn color="success" v-if="props.item.activation === '1'" small>ON</v-btn>
            <v-btn color="error" v-else-if="props.item.activation === '0'" small>OFF</v-btn>
          </td>
          <td class="text-xs-left">
            <v-icon class="mr-2" @click="detailItem(props.item)" color="primary">info</v-icon>
            <v-icon class="mr-2" @click="editItem(props.item)" color="success">edit</v-icon>
            <v-icon @click="deleteItem(props.item)" color="error">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </div>
  </v-layout>
</template>

<script>
const URL_REPORT = `http://192.168.0.70:5005/api/get/report`
// const URL_SCHEDULER = ``
export default {
  name: "scheduler",
  data: () => ({
    loadingApi: false,
    selectedCategory: null,
    error: '',
    menuDate: false,
    menuTime: false,
    loading: false,
    method: "New",
    dialog: false,
    headers: [
      {
        text: "No",
        sortable: false
      },
      { text: "Scheduler Name", value: "name", sortable: false },
      { text: "Device Name", value: "deviceName", sortable: false },
      { text: "Type", value: "type", sortable: false },
      { text: "Value", value: "value", sortable: false },
      { text: "Category", value: "category", sortable: false },
      { text: "Activation", value: "activation", sortable: false },
      { text: "Actions", value: "device", sortable: false }
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      customer: null,
      device: null,
      device_name: "",
      telemetry: null,
      type: null,
      value: null,
      category: null,
      time: "",
      day: [],
      date: "",
      activation: "1"
    },
    defaultItem: {
      name: "",
      customer: null,
      device: null,
      device_name: "",
      telemetry: null,
      type: null,
      value: null,
      category: null,
      time: "",
      day: [],
      date: "",
      activation: "1"
    },
    listCustomer:[{name: "Select", id: null},],
    listDevice:[{name: "Select", id: null},],
    listTelemetry:[{text: "Select", value: null},],
    listType:[{text: "Select", value: null}, {text: "control", value: "control"}, {text: "on/off", value: "on/off"}],
    listValue:[{text: "Select", value: null}, {text: "ON", value: 1}, {text: "OFF", value: 0}],
    listCategory: [
      { text: "All", value: null },
      { text: "Daily", value: "Daily" },
      { text: "Weekly", value: "Weekly" },
      { text: "Monthly", value: "Monthly" }
    ],
    listCategoryForm: [
      { text: "Select", value: null },
      { text: "Daily", value: "Daily" },
      { text: "Weekly", value: "Weekly" },
      { text: "Monthly", value: "Monthly" }
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Create New Scheduler "
        : `${this.method} ${this.editedItem.deviceName}`;
    },
    deviceName() {
        let deviceName = ''
        for(let y = 0; y < this.listDevice.length; y++) {
            if(this.editedItem.device === this.listDevice[y].id) {
               deviceName = this.listDevice[y].name
               break
            }
        }
        return deviceName
    },
    customerName() {
        let customerName = ''
        for(let z = 0; z < this.listCustomer.length; z++) {
            if(this.editedItem.customer === this.listCustomer[z].id) {
               customerName = this.listCustomer[z].name
               break
            }
        }
        return customerName
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.loading = true;
    

    setTimeout(() => {
      this.loading = false;
      this.getCustomer();
    }, 300);
  },

  methods: {
     getCustomer() {
      this.$http
        .post(
          `${URL_REPORT}/customerList`,
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
        this.listDevice = [{name: "Select", id: null},]
      this.editedItem.device = null;
      this.loadingApi = true;
      this.$http
        .post(
          `${URL_REPORT}/customerDevices`,
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
          this.loadingApi = false;
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getTelemetry(val) {
        this.listTelemetry = [{text: "Select", value: null},]
      this.editedItem.telemetry = null;
      this.loadingApi = true;
      this.$http
        .post(
          `${URL_REPORT}/attributes`,
          { entityId: val, token: "Bearer " + this.$cookies.get("token"), entityType: "DEVICE" },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let k = 0; k < res.data.length; k++) {
            this.listTelemetry.push(res.data[k]);
          }
          this.loadingApi = false;
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
     onChangeCustomer(val) {
      this.getDevice(val);
    },
    onChangeDevice(val) {
      this.getTelemetry(val)
    },

    editItem(item) {
      this.method = "Edit";
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    detailItem(item) {
      this.method = "View";
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.items.splice(index, 1);
    },

    close() {
      this.dialog = false;
     
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.method = "New";
        this.error = ''
      }, 300);
    },
    close1() {
      this.dialog = false;
      
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.method = "New";
      }, 300);
    },
    save() {
      if(this.editedItem.name === '') {
        this.error = "Scheduler name cannot be empty"
      } else if(this.editedItem.device_name === null) {
        this.error = "Device name cannot be empty"
      } else if(this.editedItem.category === null) {
        this.error = "Must select the category"
      } else if(this.editedItem.time === '' && this.editedItem.date === '' && this.editedItem.day.length === 0) {
        this.error = "Time or day or date cannot be empty"
      } else if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
        this.error = ''
        this.close();
      } else if (this.editedItem.category === "Daily"){
        this.items.push({
          name: this.editedItem.name,
          customer: this.customerName,
          device: this.editedItem.device,
          deviceName: this.deviceName,
          telemetry: this.editedItem.telemetry,
          type: this.editedItem.type,
          value: this.editedItem.value,
          category: this.editedItem.category,
          time: this.editedItem.time,
          activation: this.editedItem.activation
        });
        this.error = ''
        this.close();
      } else if(this.editedItem.category === "Weekly") {
        this.items.push({
          name: this.editedItem.name,
          customer: this.customerName,
          device: this.editedItem.device,
          deviceName: this.deviceName,
          telemetry: this.editedItem.telemetry,
          type: this.editedItem.type,
          value: this.editedItem.value,
          category: this.editedItem.category,
          time: this.editedItem.time,
          day: this.editedItem.day,
          activation: this.editedItem.activation
        });
        this.error = ''
        this.close();
      } else if(this.editedItem.category === "Monthly") {
        this.items.push({
          name: this.editedItem.name,
          customer: this.customerName,
          device: this.editedItem.device,
          deviceName: this.deviceName,
          telemetry: this.editedItem.telemetry,
          type: this.editedItem.type,
          value: this.editedItem.value,
          category: this.editedItem.category,
          time: this.editedItem.time,
          date: this.editedItem.date,
          activation: this.editedItem.activation
        });
        this.error = ''
        this.close();
      } 
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
