<template>
  <div class="monitor">
      <div class="container">
          <div class="intro">
            <div class="row justify-content-center align-items-center">
              <div class="col-md-12">
                 <h3>Monitor Page</h3>
                 <div>
                    
                    <div class="card cascade narrower">
                      <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
                        <h2 class="white-text mx-auto">Real-time Bus Data</h2>
                      </div>
                      <!--/Card image-->
                        <div class="px-4">
                            <b-row class="my-1">
                              <b-col>
                              </b-col>
                              <b-col  >
                              <b-form-group
                                  label="Filter"
                                  label-cols-sm="1"
                                  label-align-sm="right"
                                  label-size="sm"
                                  label-for="filterInput"
                                  class="mb-10"
                                >
                                  <b-input-group size="sm">
                                    <b-form-input
                                      v-model="filter"
                                      type="search"
                                      id="filterInput"
                                      placeholder="Type to Search"
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-button class="mx-2 px-2" :disabled="!filter" @click="filter = ''">Clear</b-button>
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-form-group>
                              </b-col>
                            </b-row>

                            <div class="table-wrapper">

                                <!--Table-->
                                <b-table striped hover :items="buses" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                                  <template v-slot:cell(actions)="row">
                                  <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                                  <b-button size="sm" class="mx-1" variant="success" @click.stop="trackBus(row.item)">Track</b-button>
                                  </template>
                                </b-table>
                            </div>
                        </div>
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
import gmapsInit from '@/utils/gmaps';

export default {
  name: "Monitoring",
   data () {
    return {
      isConnected: false,
      socketMessage: [],
      datacollection: null,
      fields: [
        { key: 'operator',label: 'Operator', sortable: true, 'class': 'text-left' },
        { key: 'plat',label: 'Plat Nomor', 'class': 'text-left' },
        { key: 'rute',label: 'Rute', 'class': 'text-left' },
        { key: 'halte',label: 'Tujuan', sortable: true, 'class': 'text-left' },
        { key: 'estimasi',label: 'Estimasi', 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      buses: [],
      isSame: false,
      data: {},
      filter: null,
      filterOn: [],
      estimasiWaktu: "",

    }
  },
   created() {
    this.getRealtimeData()
  }, 
  methods: {

    getRealtimeData() {
      socket.on("receive_message",async fetchedData =>{
        
        var waktu = await this.getDistance(parseFloat(fetchedData.message.latitude),
          parseFloat(fetchedData.message.longitude),
          parseFloat(fetchedData.message.halteLat),
          parseFloat(fetchedData.message.halteLong),
          );
      
        this.data = {
          operator: fetchedData.sender,
          plat: fetchedData.message.nameBus,
          rute: fetchedData.message.ruteName,
          halte: fetchedData.message.halteName,
          halteLat: fetchedData.message.halteLat,
          halteLong: fetchedData.message.halteLong,
          latitude: fetchedData.message.latitude,
          longitude: fetchedData.message.longitude,
          estimasi: waktu,
        };
        this.isSame = false;
        if(this.buses == null || this.buses.length == 0){
          this.buses.push(this.data);
        }else{
          this.buses.forEach(this.checkSame);
          if (!this.isSame) {
            this.buses.push(this.data);
          }
        }
    
      })
    },
    checkSame(item,index,arr){
      if(item.plat == this.data.plat){
        this.isSame = true;
        arr[index] = this.data;
      }
    },
    async getDistance(lat1,lon1,lat2,lon2){
      const google = await gmapsInit();
      //Find the distance
      var origin = new google.maps.LatLng(lat1, lon1);
      var destination = new google.maps.LatLng(lat2, lon2);
      var distanceService = new google.maps.DistanceMatrixService();
      var estimasi = "";
      return new Promise((resolve) => {
          distanceService.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          durationInTraffic: true,
          avoidHighways: false,
          avoidTolls: false
        },
        function (response, status) {
          if (status !== google.maps.DistanceMatrixStatus.OK) {
              console.log('Error:', status);
          } else {

              estimasi = response.rows[0].elements[0].duration.text+" ( "+ response.rows[0].elements[0].distance.text + " )";
              resolve(estimasi);
            
          }
        });
      });
     
       
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