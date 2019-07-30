<template>
  <v-layout align-center justify-center fill-height column>
    <div>
    <!-- Judul table Rules -->
    <v-toolbar>
      <v-toolbar-title>List Of Rules</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <!-- Dialog buat baru dan edit scheduler -->
      <v-dialog v-model="dialog" persistent max-width="500px">
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
            <v-container grid-list-md v-if="method === 'Edit' || method === 'New'">
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
                      <v-select v-model="editedItem.status" :items="listStatus"></v-select>
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
                    <v-flex xs4>Customer</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>{{editedItem.customer}}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs4>Device</v-flex>
                    <v-flex xs2>:</v-flex>
                    <v-flex xs4>{{editedItem.device}}</v-flex>
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
                    <v-flex xs4>{{editedItem.status}}</v-flex>
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
          <span class="green--text" v-if="props.item.status === 'normal'">{{ props.item.status }}</span>
          <span
            class="yellow--text"
            v-else-if="props.item.status === 'minor'"
          >{{ props.item.status }}</span>
          <span class="red--text" v-else>{{ props.item.status }}</span>
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
export default {
  name: "rules",
  data: () => ({
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
    listVariable: [],
    listCustomer: [],
    listDevice: [],
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
    listDeviceDummy: [
      { text: "Select", value: null },
      { text: "Device 1", value: "Device 1" }
    ],
    listCustomerDummy: [
      { text: "Select", value: null },
      { text: "Customer 1", value: "C1" }
    ],
    listVariableDummy: [
      { text: "Select", value: null },
      { text: "humidity", value: "humidity" }
    ],
    listStatus: [
      { text: "Select", value: null },
      { text: "normal", value: "normal" },
      { text: "minor", value: "minor" },
      { text: "major", value: "major" }
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Create New Scheduler "
        : `${this.method} ${this.editedItem.variable}`;
    }
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
      this.initialize();
      this.listCustomer = this.listCustomerDummy;
    }, 3000);
  },

  methods: {
    initialize() {
      this.items = [
        {
          customer: "customer 1",
          device: "device 1",
          variable: "temperature",
          max: 27,
          min: 25,
          status: "normal"
        },
        {
          customer: "customer 1",
          device: "device 1",
          variable: "temperature",
          max: 25,
          min: 16,
          status: "minor"
        },
        {
          customer: "customer 1",
          device: "device 1",
          variable: "temperature",
          max: 32,
          min: 27,
          status: "major"
        }
      ];
    },
    onChangeCustomer() {
      this.listDevice = this.listDeviceDummy;
    },
    onChangeDevice() {
      this.listVariable = this.listVariableDummy;
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
        this.error = "";
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
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push({
          customer: this.editedItem.customer,
          device: this.editedItem.device,
          variable: this.editedItem.variable,
          max: this.editedItem.max,
          min: this.editedItem.min,
          status: this.editedItem.status
        });
        this.error = "";
        this.close();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
