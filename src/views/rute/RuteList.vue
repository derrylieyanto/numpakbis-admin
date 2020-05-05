<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Rute Bus Data</h2>
      <div>
          <b-button class="add-btn mx-3" variant="success" v-b-modal.modal-add>Add Halte Bus</b-button>
      </div>
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
                    <b-button class="mx-2 px-2 " :disabled="!filter" @click="filter = ''">Clear</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>

            <!-- <b-col lg="6" class="my-1">
              <b-form-group
                label="Filter On"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                description="Leave all unchecked to filter on all data"
                class="mb-10">
                <b-form-checkbox-group v-model="filterOn" class="mt-1">
                  <b-form-checkbox value="name">Name</b-form-checkbox>
                  <b-form-checkbox value="type">Type</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-col> -->
          </b-row>

          <div class="table-wrapper">

              <!--Table-->
              <b-table striped hover :items="rute_buses" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                 <b-button size="sm" @click="row.toggleDetails">
                   {{ row.detailsShowing ? 'Hide' : 'Show' }} Halte
                </b-button>
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="edithalte(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletehalte(row.item)">Delete</b-button>
                </template>
                <template v-slot:row-details="row">
                    <!-- <b-table  :items="rute_buses[row.index].halte_bus" :fields="field2">
                    </b-table> -->
                    <b-card header-tag="header">
                        
                        <template v-slot:header>
                            <b-row>
                                <b-col><h4 class="mt-2">Halte Bus</h4> </b-col>
                                <b-col><b-button size="sm" class=" add-halte" variant="success" @click.stop="addhalte(row.item)">Add Halte</b-button> </b-col>
                            </b-row>
                        </template>
                        <b-card-text>
                            <ol>
                                <li v-for="(value, key) in rute_buses[row.index].halte_bus" :key="key">{{ value.halte_name }} : {{ value.lat}} , {{ value.long }}</li>
                            </ol>
                        </b-card-text>
                       
                        
                    
                    </b-card>
                   
                </template>
              </b-table>
          </div>
      </div>
  </div>
  

  <!-- Add modal -->
    <b-modal
      id="modal-add"
      ref="modal"
      title="Add Halte Bus"
      @show="resetModalAdd"
      @hidden="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit="handleSubmitAdd">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Name">
          <b-form-input id="name" v-model.trim="rute_bus.name"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Latitude">
          <b-form-input id="latitude" v-model.trim="rute_bus.latitude"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Longitude">
          <b-form-input id="longitude" v-model.trim="rute_bus.longitude"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Type">
          <b-form-input id="type" v-model.trim="rute_bus.type"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    
  
</b-container>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

export default {
  name: 'HalteList',
  data () {
    return {
      fields: [
        { key: 'name',label: 'Name', sortable: true, 'class': 'text-left' },
        { key: 'type',label: 'Type', sortable: true, 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      field2: [
        { key: 'key',label: 'No.', sortable: true, 'class': 'text-left' },
        { key: 'halte_name',label: 'Name', 'class': 'text-left' },
        { key: 'lat',label: 'Latitude', 'class': 'text-left' },
        { key: 'long',label: 'Longitude', 'class': 'text-left' },
      ],
      filter: null,
      filterOn: [],
      rute_buses: [],
      errors: [],
      ref: firebase.firestore().collection('rute_bus'),
      lastIndex: 0,
      rute_bus: {},
      index: 0,
      i: 0
    }
  },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.rute_buses = [];
      querySnapshot.forEach((doc) => {
        this.rute_buses.push({
          key: doc.id,
          name: doc.data().rute_name,
          type: doc.data().rute_type,
          halte_bus: []
        });
        var temp = doc.id.split("_");
        this.lastIndex = temp[1];
        this.ref.doc(doc.id).collection("halte_bus").get()
        .then(querySnapshot => {
            console.log("subcollection jalan");
            querySnapshot.forEach(doc2 => {
                console.log("lastindex = " + this.lastIndex);
                console.log("i = " + this.i);
                var tempObj = {
                    key: doc2.id,
                    halte_name: doc2.data().name,
                    lat: doc2.data().latitude,
                    long: doc2.data().longitude
                };
                console.log(tempObj);
                this.rute_buses[this.i].halte_bus.push(tempObj);
                
                // console.log("Subcoolection"+JSON.stringify(tempObj));
               // console.log("Halte bus: "+JSON.stringify(this.rute_buses[parseInt(this.lastIndex)-1].halte_bus));
            //     this.rute_buses[this.lastIndex].halte_bus.push({
            //       key: doc2.id,
            //       halte_name: doc2.data().name,
            //       latitude: doc2.data().latitude,
            //       longitude: doc2.data().longitude,
            //   });
            });
            this.i=this.i+1;
        }).catch(err => {
          console.log("Error getting sub-collection documents", err);
        });
        console.log(JSON.stringify(this.rute_buses));
        console.log(this.lastIndex);
        
      });

    });
    // this.ref.onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     this.ref.doc(doc.id).collection("halte_bus").get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach(doc2 => {
    //             this.rute_buses[this.lastIndex].halte_bus.push({
    //               key: doc2.id,
    //               halte_name: doc2.data().name,
    //               latitude: doc2.data().latitude,
    //               longitude: doc2.data().longitude,
    //           });
    //         });
    //     }).catch(err => {
    //       console.log("Error getting sub-collection documents", err);
    //     });
    //   });
    // });
  },
   mounted() {
      console.log(this.lastIndex);
    },
  methods: {
    // addhalte (id) {
    //   console.log(this.lastIndex);
    //   router.push({
    //     name: 'AddHalte',
    //     params: { id: id }
    //   })
    // },
    // details (rute_bus) {
    //     router.push({ 
    //       name: 'ShowHalte', 
    //       params: { id: rute_bus.key }
    //     })
    // }, 
    edithalte (id) {
      router.push({
        name: 'EditHalte',
        params: { id: id.key }
      })
    },
    deletehalte (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('rute_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    resetModalAdd() {
      this.rute_bus.name = ''
      this.rute_bus.latitude = ''
      this.rute_bus.longitude = ''
      this.rute_bus.type = ''
      this.index = 0
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      this.handleSubmitAdd(bvModalEvt)
    },
    handleSubmitAdd(evt) {
      evt.preventDefault()
      this.index = parseInt(this.lastIndex) + 1;
      this.ref.doc('halte_'+this.index).set(this.rute_bus).then(() => {
        console.log("Document successfully added!");
        this.rute_bus.name = ''
        this.rute_bus.latitude = ''
        this.rute_bus.longitude = ''
        this.rute_bus.type = ''
        this.index = 0
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
      })
    }

  }
}
</script>

<style>
  .add-halte {
    float: right;
  }
</style>