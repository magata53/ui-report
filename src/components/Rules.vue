<template>
  <v-layout align-center justify-center fill-height column max-widtg="100%">
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
    <!-- Judul table Rules -->
    <v-toolbar>
      <v-toolbar-title>List Of Rules</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <!-- Dialog buat baru dan edit scheduler -->
      <v-dialog v-model="dialog" persistent max-width="700">
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

          <!-- Body dialog berisi form untuk create -->
          <v-card-text>
            <v-container grid-list-md v-if="method === 'New'">
              <v-layout align-center justify-center v-if="error">
                <p class="error--text">{{error}}</p>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Customer</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-select
                        v-model="editedItem.customer"
                        :items="listCustomer"
                        item-text="name"
                        item-value="id"
                        @change="onChangeCustomer"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Device</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-select
                        v-model="editedItem.device"
                        :items="listDevice"
                        item-text="name"
                        item-value="id"
                        @change="onChangeDevice"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Variable</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-select v-model="editedItem.variable" :items="listVariable"></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Min</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-text-field v-model="editedItem.min" type="number"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Max</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-text-field v-model="editedItem.max" type="number"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Status</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-select v-model="editedItem.status" :items="listStatus" item-text="name" item-value="id"></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>

          <!-- Body dialog berisi form untuk edit -->
            <v-container grid-list-md v-else-if="method === 'Edit'">
              <v-layout align-center justify-center v-if="error">
                <p class="error--text">{{error}}</p>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Min</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-text-field v-model="editedItem.min" type="number"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Max</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-text-field v-model="editedItem.max" type="number"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4 align-self-center>Status</v-flex>
                    <v-flex xs2 align-self-center>:</v-flex>
                    <v-flex xs4>
                      <v-select v-model="editedItem.status" :items="listStatus" item-text="name" item-value="id"></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>

            <!-- Body untuk detail -->
            <v-container grid-list-md v-else>
              <v-layout wrap>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Device</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs6>{{editedItem.device}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Variable</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>{{editedItem.variable}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Min</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>{{editedItem.min}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Max</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>{{editedItem.max}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Status</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>
                      <span class="green--text" v-if="editedItem.status === 3">normal</span>
                      <span class="yellow--text" v-else-if="editedItem.status === 2">minor</span>
                      <span class="red--text" v-else>major</span>
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
      :loading="loading"
      class="elevation-1"
      :rows-per-page-items="[15,30,50,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.index + 1}}</td>
        <td class="text-xs-left">{{ props.item.variable }}</td>
        <td class="text-xs-left">{{ props.item.min }}</td>
        <td class="text-xs-left">{{ props.item.max }}</td>
        <td class="text-xs-left">
          <span class="green--text" v-if="props.item.status === 3">normal</span>
          <span class="yellow--text" v-else-if="props.item.status === 2">minor</span>
          <span class="red--text" v-else>major</span>
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
const URL = `http://${window.location.host}:5005/api`;
export default {
  name: "rules",
  data: () => ({
    loadingApi: false,
    error: "",
    loading: false,
    method: "New",
    dialog: false,
    headers: [
      {
        text: "No",
        sortable: false
      },
      { text: "Variable", value: "variable", sortable: false },
      { text: "Max", value: "max", sortable: false },
      { text: "Min", value: "min", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Actions", value: "variable", sortable: false }
    ],
    items: [],
    listVariable: [{ text: "Select", value: null },],
    listCustomer: [{ name: "Select", id: null },],
    listDevice: [{ name: "Select", id: null },],
    editedIndex: -1,
    editedItem: {
      customer: null,
      device: null,
      variable: null,
      max: 0,
      min: 0,
      status: null
    },
    defaultItem: {
      customer: null,
      device: null,
      variable: null,
      max: 0,
      min: 0,
      status: null
    },
    listStatus: [{ name: "Select", id: null },]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Create New Scheduler "
        : `${this.method} ${this.editedItem.variable}`;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.loading = true;

    this.getStatus();
    this.getCustomer();
    setTimeout(() => {
      this.loading = false;
      this.getRules();
    }, 300);
  },

  methods: {
    getCustomer() {
      this.$http
        .post(
          `${URL}/get/report/customerList`,
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
      this.loadingApi = true;
      this.$http
        .post(
          `${URL}/get/report/customerDevices`,
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
    getVariable(val) {
      this.loadingApi = true;
      this.$http
        .post(
          `${URL}/get/report/attributes`,
          { entityId: val, token: "Bearer " + this.$cookies.get("token"), entityType: "DEVICE" },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          for (let k = 0; k < res.data.length; k++) {
            this.listVariable.push(res.data[k]);
          }
          this.loadingApi = false;
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getStatus() {
      this.$http.get(`${URL}/get/rule/status`)
        .then(res => {
          for (let l = 0; l < res.data.length; l++) {
            this.listStatus.push(res.data[l]);
          }
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        });
    },
    getRules() {
      this.items = []
      this.$http.get(`${URL}/get/rule`)
      .then(res => {
        for(let y = 0; y < res.data.length; y++) {
          this.items.push({
            id: res.data[y].id,
            device: res.data[y].device_id,
            variable: res.data[y].variable,
            max: res.data[y].max,
            min: res.data[y].min,
            status: res.data[y].relations[0].status_id
          })
        }
      })
      .catch(err => {
        if (err) {
            this.error = "Can't connect to the server";
          }
      })
    },
    onChangeCustomer(val) {
      this.getDevice(val);
    },
    onChangeDevice(val) {
      this.getVariable(val)
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
        this.$http.delete(`${URL}/delete/rule/${item.id}`)
        .then(res => {
          if(res.status === 200) {
            this.items.splice(index, 1);
          }
        })
        .catch(err => {
          if(err) {
            this.error = "Can't connect to the server"
          }
        })
    },
    close() {
      this.dialog = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.method = "New";
        this.error = "";
      }, 300);
    },
    close1() {
      this.dialog = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.method = "New";
        this.error = "";
      }, 300);
    },
    save() {
      if (this.editedItem.customer === null) {
        this.error = "Must select the customer";
      } else if (this.editedItem.device === null) {
        this.error = "Must select the device";
      } else if (this.editedItem.variable === null) {
        this.error = "Must select the variable";
      } else if (this.editedItem.max === 0) {
        this.error = "Max value cannot be empty";
      } else if (this.editedItem.min === 0) {
        this.error = "Min value cannot be empty";
      } else if (this.editedItem.status === null) {
        this.error = "Must select the status";
      } else if (this.editedIndex > -1) {
        this.$http.patch(`${URL}/patch/rule/${this.editedItem.id}`, {
          device_id: this.editedItem.device,
          variable: this.editedItem.variable,
          max: this.editedItem.max,
          min: this.editedItem.min,
          status: this.editedItem.status
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          if(res.status === 200) {
            Object.assign(this.items[this.editedIndex], this.editedItem);
            this.error = ""
            this.close();
          }
        })
        .catch(err => {
          if(err) {
            this.error = "Can't connect to the server"
          }
        })
        
      } else {
        this.loadingApi = true
        this.$http.post(`${URL}/post/rule`, {
          device_id: this.editedItem.device,
          variable: this.editedItem.variable,
          max: this.editedItem.max,
          min: this.editedItem.min,
          status: this.editedItem.status
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          if(res.status === 200) {
            this.getRules();
            this.loadingApi = false
            this.error = "";
            this.close();
          }
        })
        .catch(err => {
          if (err) {
            this.error = "Can't connect to the server";
          }
        })
        
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
