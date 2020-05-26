<template>
  <div class="monitor">
      <div class="container">
          <div class="intro">
            <div class="row justify-content-center align-items-center">
              <div class="col-md-12">
                 <h3>Monitor Page</h3>
                 <div>
                    <div class="small">
                        <line-chart :chart-data="datacollection" id="mychart"></line-chart>
                    </div>
                    <br><br><br>
                     <div>
                        <b-form @submit.stop.prevent="onSubmit">
                        <b-form-group id="example-input-group-1" label="Name" label-for="example-input-1">
                            <b-form-input
                            id="example-input-1"
                            name="example-input-1"
                            v-model="$v.form.name.$model"
                            :state="validateState('name')"
                            aria-describedby="input-1-live-feedback"
                            ></b-form-input>

                            <b-form-invalid-feedback
                            id="input-1-live-feedback"
                            >This is a required field and must be at least 3 characters.</b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group id="example-input-group-2" label="Food" label-for="example-input-2">
                            <b-form-select
                            id="example-input-2"
                            name="example-input-2"
                            v-model="$v.form.food.$model"
                            :options="foods"
                            :state="validateState('food')"
                            aria-describedby="input-2-live-feedback"
                            ></b-form-select>

                            <b-form-invalid-feedback id="input-2-live-feedback">This is a required field.</b-form-invalid-feedback>
                        </b-form-group>

                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button class="ml-2" @click="resetForm()">Reset</b-button>
                        </b-form>
                    </div>
                 
                </div>
              </div>
          </div>
          </div>
     
      </div>
  </div>
</template>

<script>

import io from "socket.io-client";
var socket = io.connect("https://numpakbis-server.herokuapp.com/");
import LineChart from "../LineChart.js";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";


export default {
    mixins: [validationMixin],
  name: "Monitoring",
    components: {
    LineChart
  },
   data () {
    return {
      isConnected: false,
      socketMessage: [],
      datacollection: null,
      foods: [
        { value: null, text: "Choose..." },
        { value: "apple", text: "Apple" },
        { value: "orange", text: "Orange" }
      ],
      form: {
        name: null,
        food: null
      }
    }
  },
  validations: {
    form: {
      food: {
        required
      },
      name: {
        required,
        minLength: minLength(3)
      }
    }
  },
   created() {
    this.getRealtimeData()
    this.fillData(10)
  }, 
  methods: {
    fillData(fetchedData) {
      this.datacollection = {
        labels: [this.getRandomChartValues(fetchedData), this.getRandomChartValues(fetchedData)],
        datasets: [
          {
            label: "Google Stock",
            backgroundColor: "#1A73E8",
            data: [this.getRandomChartValues(fetchedData), this.getRandomChartValues(fetchedData)]
          },
          {
            label: "Microsoft Stock",
            backgroundColor: "#2b7518",
            data: [this.getRandomChartValues(fetchedData), this.getRandomChartValues(fetchedData)]
          }
        ]
      };
    },
   getRealtimeData() {
      socket.on("receive_message", fetchedData => {
        //this.socketMessage.push(fetchedData);
        console.log(fetchedData);
      })
    },
    getRandomChartValues(number){
      return Math.floor(Math.random() * number)
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        name: null,
        food: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      alert("Form submitted!"+this.form.name+this.form.food);
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.small {
  max-width: 1000px;
  max-height: 500px;
  margin: 10px auto;
}

</style>