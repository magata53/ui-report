<template>
  <!-- Form Login -->
  <v-container fluid fill-height>
    <!-- Dialog loading for wait response from API -->
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please wait ......
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-layout align-center justify-center v-if="error">
              <p class="error--text">{{error}}</p>
            </v-layout>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="login"
                label="Username"
                type="text"
                v-model="form.username"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="form.password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="loginTB">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const URL = `http://${window.location.host}:5005/api/get/report`;
export default {
  name: "login",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: ""
      },
      default: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    loginTB() {
      this.loading = true;
      let body = {
        username: this.form.username,
        password: this.form.password
      };
      this.$http
        .post(`${URL}/token`, body, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          this.$cookies.set("token", res.data);
          this.form = Object.assign({}, this.defaultLogin);
          this.loading = false;
          this.$router.push({ path: "/reports" });
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.loading = false;
            this.error = "Username or password wrong";
          } else {
            this.loading = false;
            this.error = "Can't connect to the server";
          }
        });
    }
  }
};
</script>

<style>
</style>
