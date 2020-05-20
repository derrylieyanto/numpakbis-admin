<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Halte Bus Data</h2>
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
                    <b-button class="mx-2 px-2" :disabled="!filter" @click="filter = ''">Clear</b-button>
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
              <b-table striped hover :items="halte_buses" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="edithalte(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletehalte(row.item)">Delete</b-button>
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
          <b-form-input id="name" v-model.trim="halte_bus.name"></b-form-input>
        </b-form-group>
         <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Rute">
          <b-form-input id="rute" v-model.trim="halte_bus.rute"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Latitude">
          <b-form-input id="latitude" v-model.trim="halte_bus.latitude"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Longitude">
          <b-form-input id="longitude" v-model.trim="halte_bus.longitude"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Type">
          <b-form-input id="type" v-model.trim="halte_bus.type"></b-form-input>
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
        { key: 'lat',label: 'Latitude', 'class': 'text-left' },
        { key: 'long',label: 'Longitude', 'class': 'text-left' },
        { key: 'type',label: 'Type', sortable: true, 'class': 'text-left' },
        { key: 'rute',label: 'Rute', 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      filter: null,
      filterOn: [],
      halte_buses: [],
      errors: [],
      ref: firebase.firestore().collection('halte_bus'),
      lastIndex: 0,
      halte_bus: {},
      index: 0
    }
  },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.halte_buses = [];
      querySnapshot.forEach((doc) => {
        this.halte_buses.push({
          key: doc.id,
          name: doc.data().name,
          lat: doc.data().latitude,
          long: doc.data().longitude,
          type: doc.data().type,
          rute: doc.data().rute
        });
        var temp = doc.id.split("_");
        if(parseInt(temp[1])>this.lastIndex){
          this.lastIndex = temp[1];
        }
        
      });
    });
    
  },
  methods: {
    edithalte (id) {
      router.push({
        name: 'EditHalte',
        params: { id: id.key }
      })
    },
    deletehalte (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('halte_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    resetModalAdd() {
      this.halte_bus.name = ''
      this.halte_bus.latitude = ''
      this.halte_bus.longitude = ''
      this.halte_bus.type = ''
      this.halte_bus.rute = ''
      this.index = 0
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      this.handleSubmitAdd(bvModalEvt)
    },
    handleSubmitAdd(evt) {
      evt.preventDefault()
      this.index = parseInt(this.lastIndex) + 1;
      console.log('Index : ' + this.index);
      this.ref.doc('halte_'+this.index).set(this.halte_bus).then(() => {
        console.log("Document successfully added!");
        this.halte_bus.name = ''
        this.halte_bus.latitude = ''
        this.halte_bus.longitude = ''
        this.halte_bus.type = ''
        this.halte_bus.rute = ''
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