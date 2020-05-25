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


export default {
  name: "Monitoring",
    components: {
    LineChart
  },
   data () {
    return {
      isConnected: false,
      socketMessage: [],
      datacollection: null,
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