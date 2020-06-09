<template>
    <b-container fluid>
          <div class="intro">
            <div class="row justify-content-center align-items-center">
              <div class="col-md-12">
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
                                  <!-- <template v-slot:cell(actions)="row">
                                  <b-button size="sm" class="mx-1" variant="success" v-b-modal="'mapModal'" @click.stop="trackBus(row.item)">Track</b-button>
                                  </template> -->
                                </b-table>
                            </div>
                        </div>
                    </div>
                 
                </div>
              </div>
          </div>
          </div>

          <!-- <b-modal ref="mapModal" id="mapModal" title="Track Bus" ok-only>
            <div class="MapTrack" id="MapTrack" ref="MapTrack">
              a
            </div>
          </b-modal> -->
     
    </b-container>
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
        //{ key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      buses: [],
      isSame: false,
      data: {},
      filter: null,
      filterOn: [],
      estimasiWaktu: "",
      selectedData: {},
      locations: [],
      polylines: [],

    }
  },
   created() {
    this.getRealtimeData()
  }, 
  mounted(){
    console.log(this.$refs.MapTrack);
  },
  methods: {

    getRealtimeData() {
      socket.on("receive_message",async fetchedData =>{
        console.log(fetchedData);
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
        if(fetchedData.message.status == "active"){
          if(this.buses == null || this.buses.length == 0){
            this.buses.push(this.data);
          }else{
            this.buses.forEach(this.checkSame);
            if (!this.isSame) {
              this.buses.push(this.data);
            }
          }
        }else{
          if(this.buses == null || this.buses.length == 0){
            this.buses.pop();
          }else{
            this.buses.forEach(this.removeSame);
            if (!this.isSame) {
              this.buses.push(this.data);
            }
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
    removeSame(item,index,arr){
      if(item.plat == this.data.plat){
        this.isSame = true;
        arr.splice(index,1);
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
    },
    async trackBus(item){
      this.selectedData = item;
      
       try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$bvModal);
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      geocoder.geocode({ address: 'Yogyakarta' }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }
       
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
         map.setZoom(13);
      });

      // const markerClickHandler = (marker) => {
      //   map.setZoom(16);
      //   map.setCenter(marker.getPosition());
      //   var infoWindow = new google.maps.InfoWindow({
      //       size: new google.maps.Size(150, 50)
      //   });
      //   var contentString = marker.id;
      //   infoWindow.setContent(contentString);
      //   infoWindow.open(map, marker);
      // };
      
      // this.locations.map((location) => {
      //   const marker = new google.maps.Marker({ ...location, map });
      //   marker.addListener('click', () => markerClickHandler(marker));
      //   return marker;
      // });

      this.getDistance();

      directionsRenderer.setMap(map);

      directionsService.route(
      {
        origin: new google.maps.LatLng(-7.783033, 110.402315),
        destination: new google.maps.LatLng(-7.783197,110.411657),
        travelMode: 'DRIVING'
      },
      function(response, status) {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    } catch (error) {
      console.error(error);
    }

      

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
.MapTrack {
  width: 50vw;
  height: 50vh;
}

</style>