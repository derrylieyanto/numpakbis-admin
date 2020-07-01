<template>
<b-container fluid>
     <b-alert
      :show="dismissCountDown"
      dismissible
      variant="danger"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>Data Report pada tanggal {{ date }} tidak ditemukan !!!</p>
      <b-progress
        variant="warning"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Report Data</h2>
    </div>
    <!--/Card image-->
      <div class="px-4">
          <b-row class="my-1">
            <b-col>
                 <b-form-group
                label="Date"
                label-cols-sm="1"
                label-align-sm="left"
                label-size="sm"
                label-for="dateInput"
                class="mb-10"
              >
                <b-input-group size="sm">
                  <b-form-input
                    v-model="date"
                    type="date"
                    id="dateInput"
                    @change="generateReport"
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
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
                    placeholder="Search"
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
              <b-table striped hover :items="reports" :fields="fields" :filter="filter" 
                :filterIncludedFields="filterOn" :current-page="currentPage"
                :per-page="perPage"
                @filtered="onFiltered"
              >
              </b-table>
          </div>
          <hr>

          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="center"
              size="lg"
              class="my-0"
              
          ></b-pagination>
         <br><br>

      </div>
      
  </div>


    
  
</b-container>
</template>

<script>

import firebase from '@/Firebase'
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";


export default {
  mixins: [validationMixin],
  name: 'Report',
  data () {
    return {
      fields: [
        { key: 'name',label: 'Name', sortable: true, 'class': 'text-left' },
        { key: 'bus',label: 'Bus', sortable: true, 'class': 'text-left' },
        { key: 'type',label: 'Type', sortable: true, 'class': 'text-left' },
        { key: 'rute',label: 'Rute', sortable: true, 'class': 'text-left' },
        { key: 'startTime',label: 'Start Time', sortable: true, 'class': 'text-left', formatter: value => {
              return ("0" + value.getDate()).slice(-2) + "-" + ("0"+(value.getMonth()+1)).slice(-2) + "-" + value.getFullYear() + " " + ("0" + value.getHours()).slice(-2) + ":" + ("0" + value.getMinutes()).slice(-2) + ":" + ("0" + value.getSeconds()).slice(-2);
            } },
        { key: 'stopTime',label: 'Stop Time', sortable: true, 'class': 'text-left', formatter: value => {
              return ("0" + value.getDate()).slice(-2) + "-" + ("0"+(value.getMonth()+1)).slice(-2) + "-" + value.getFullYear() + " " + ("0" + value.getHours()).slice(-2) + ":" + ("0" + value.getMinutes()).slice(-2) + ":" + ("0" + value.getSeconds()).slice(-2);
            }},
        { key: 'totalTime',label: 'Total Time', sortable: true, 'class': 'text-left', formatter: value => {
              return this.msToTime(value);
            } },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      reports: [],
      errors: [],
      ref: firebase.firestore().collection('report'),
      lastIndex: 0,
      dateString: "",
      report: {
        type: null,
        city: null
      },
      index: 0,
      isSame: false,
      date: null,
      dismissSecs: 5,
      dismissCountDown: 0,
    }
  },
   validations: {
    report: {
      city: {required,minLength: minLength(3)},
      type: {required},
  
    }
  },
   mounted() {
      // Set the initial number of items
      this.totalRows = this.reports.length
    },
  created () {
    var currentDate = new Date();
    if((currentDate.getMonth()+1) < 10){
        this.dateString = currentDate.getFullYear()+"0"+(currentDate.getMonth()+1)+"0"+currentDate.getDate();
        this.date = currentDate.getFullYear()+"-0"+(currentDate.getMonth()+1)+"-0"+currentDate.getDate();
    }else{
        this.dateString = currentDate.getFullYear()+""+(currentDate.getMonth()+1)+""+currentDate.getDate();
        this.date = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate();
    }
    console.log(this.dateString);
    this.ref.doc(this.dateString).collection("operator").onSnapshot((querySnapshot) => {
      this.reports = [];
      querySnapshot.forEach((doc) => {
        this.reports.push({
          key: doc.id,
          uid: doc.data().uid,
          name: doc.data().name,
          bus: doc.data().bus,
          rute: doc.data().rute,
          type: doc.data().type,
          startTime: doc.data().startTime.toDate(),
          stopTime: doc.data().stopTime.toDate(),
          totalTime: doc.data().totalTime,
        });
        
      });
      this.totalRows = this.reports.length;
    });
    
  },
  methods: {
     onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      msToTime(duration) {
        var seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
     },
     generateReport(){
         var tempDate = this.date.toString().replace(/-/g,'');
         this.ref.doc(tempDate).collection("operator").onSnapshot((querySnapshot) => {
            this.reports = [];
            querySnapshot.forEach((doc) => {
                this.reports.push({
                key: doc.id,
                uid: doc.data().uid,
                name: doc.data().name,
                bus: doc.data().bus,
                rute: doc.data().rute,
                type: doc.data().type,
                startTime: doc.data().startTime.toDate(),
                stopTime: doc.data().stopTime.toDate(),
                totalTime: doc.data().totalTime,
                });
                
            });
            this.totalRows = this.reports.length;
            console.log(this.totalRows);
            if (this.reports.length<1) {
                this.showAlert();
            }
            });
            

     },
     countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    },
    showAlert() {
        this.dismissCountDown = this.dismissSecs
    },
   
  }
}
</script>

<style>
.pagination .page-item.active .page-link:focus{
    box-shadow: 0 0 0 3px rgba(0,123,255,.5);
    z-index: 2;
    color: #0275d8;
}

  /* .dataTitle{
    text-align: left;
    margin-bottom: 20px;
  }
  .table {
    width: 70%;
    margin: 20 auto;
  }
  .add-btn {
    margin-left: 20px;
    margin-right: 40px;
    float: right;
  } */
</style>