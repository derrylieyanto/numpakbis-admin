<template>
  <div class="App"/>
</template>

<script>
import gmapsInit from '@/utils/gmaps';


export default {
  name: 'Overview',
   data () {
    return {
      locations : [
      {
        position: {
          lat: -7.783033,
          lng: 110.402315,
        },
      },
      {
        position: {
          lat: -7.783197,
          lng: 110.411657,
        },
      },
    ],


    }
  },
  async mounted() {
    try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);

      geocoder.geocode({ address: 'Yogyakarta' }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }
       
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
         map.setZoom(16);
      });
      
    this.locations.map(x => new google.maps.Marker({ ...x, map }));
    this.getDistance();

    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async getDistance(){
      const google = await gmapsInit();
      //Find the distance
      var origin = new google.maps.LatLng(-7.783033, 110.402315);
      var destination = new google.maps.LatLng(-7.783197,110.411657);
      var distanceService = new google.maps.DistanceMatrixService();
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
              console.log(response);
              console.log(response.rows[0].elements[0].distance.text);
              console.log(response.rows[0].elements[0].duration.text);
          }
      });
    }
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.App {
  width: 100vw;
  height: 100vh;
}
</style>