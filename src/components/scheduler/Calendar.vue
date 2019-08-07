<template>
  <v-layout wrap>
    <v-flex
      sm4
      xs12
      class="text-sm-left text-xs-center"
    >
      <v-btn @click="$refs.calendar.prev()">
        <v-icon
          dark
          left
        >
          keyboard_arrow_left
        </v-icon>
        Prev
      </v-btn>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-xs-center"
    >
      <!-- <v-select
        v-model="type"
        :items="typeOptions"
        label="Type"
      ></v-select> -->
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-sm-right text-xs-center"
    >
      <v-btn @click="$refs.calendar.next()">
        Next
        <v-icon
          right
          dark
        >
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>

    <v-flex
      xs12
      class="mb-3"
    >
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="start"
          :type="type"
          color="primary"
        >

        <template v-slot:day="day">
            <div v-for="item in daily" :key="item.id" >
            <v-sheet
              color="primary"
              class="white--text pa-2 mb-2"
              
              v-if="day.day % 1 === 0"
            >
              <span>{{item.name}}</span>
            </v-sheet>
            </div>

            <div v-for="item in monthly" :key="item.id">
            <v-sheet
              color="success"
              class="white--text pa-2 mb-2"
              v-if="day.day === parseInt(item.repeat.split('-')[2])"
            >
              <span>{{item.name}}</span>
            </v-sheet>
            </div>

            <div v-for="item in weekly" :key="item.id">
              <div v-for="other in item.repeat.split(',')" :key="other">
            <v-sheet
              color="warning"
              class="white--text pa-2 mb-2"
              v-if="day.weekday === parseInt(other)"
            >
              <span>{{item.name}}</span>
            </v-sheet>
              </div>
            </div>
          </template>

        </v-calendar>
      </v-sheet>
    </v-flex>

    
  </v-layout>
</template>

<script>
const URL = `http://${window.location.host}:5006/api`
  export default {
    name: "calendar",
    data: () => ({
      color: 'primary',
      error: "",
      type: 'month',
      start: new Date().toISOString().substr(0, 10),
      end: "2019-12-31",
      typeOptions: [
        { text: 'Day', value: 'day' },
        { text: 'Week', value: 'week' },
        { text: 'Month', value: 'month' },
      ],
      daily: [],
      weekly: [],
      monthly: [],
    }),
    methods: {
      getDataEvent() {
        this.$http.get(`${URL}/get/scheduler`)
      .then(res => {
        if(res.status === 200) {
          for(let i =0; i < res.data.length; i++) {
            if(res.data[i].category === "daily") {
              this.daily.push(res.data[i])
            } else if(res.data[i].category === "weekly") {
              this.weekly.push(res.data[i])
            } else {
              this.monthly.push(res.data[i])
            }
          }
        }
      })
      .catch(err => {
        if(err) {
          this.error = "Can't connect to the server"
        }
      })
      }
    },
    mounted() {
      this.getDataEvent()
    }
  }
</script>

<style>

</style>
