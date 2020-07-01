<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Rute Bus Data</h2>
      <div>
          <b-button class="add-btn mx-3" variant="success" v-b-modal.modal-add>Add Rute Bus</b-button>
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
                    placeholder="Search"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button class="mx-2 px-2 " :disabled="!filter" @click="filter = ''">Clear</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <div class="table-wrapper">

              <!--Table-->
              <b-table hover :items="rute_buses" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                 <b-button size="sm" @click="toggleDetails(row.item)">
                   {{ row.detailsShowing ? 'Hide' : 'Show' }} Halte
                </b-button>
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="editrute(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deleterute(row.item)">Delete</b-button>
                </template>
                <template v-slot:row-details="row">
                    
                    <b-card header-tag="header">
                        
                        <template v-slot:header>
                            <b-row>
                                <b-col><h4 class="mt-2">Halte Bus</h4> </b-col>
                                <b-button size="sm" variant="success" @click="info(row.index, $event.target)" class="mr-1">
                                  Add Halte Bus
                                </b-button>
                                <!-- <b-col><b-button size="sm" class="mx-1" variant="success" v-b-modal.modal-add-halte>Add Halte Bus</b-button></b-col> -->
                            </b-row>
                        </template>
                        <b-card-text>
                          <b-table  :items="halte_buses" :sort-by="sortBy" :fields="field2">
                            <template v-slot:cell(actions)="row2">
                            <b-button size="sm" class="mx-1" variant="danger" @click="deletehalte(row2.item,row.index)"><i class="far fa-trash-alt"></i></b-button>
                            </template>
                          </b-table>
                          <!-- <ol>
                              <li v-for="(value, key) in rute_buses[row.index].halte_bus" :key="key">{{ value.halte_name }} : {{ value.lat}} , {{ value.long }}</li>
                          </ol> -->
                        </b-card-text>
                       
                    </b-card>
                   
                </template>
              </b-table>
          </div>
      </div>
  </div>
  

  <!-- Add Rute modal -->
    <b-modal
      id="modal-add"
      ref="modal"
      title="Add Rute Bus"
      @show="resetModalAdd"
      @hidden="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit="handleSubmitAdd">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Name">
          <b-form-input id="name" v-model.trim="$v.rute_bus.rute_name.$model" :state="validateState('rute_name')"
          aria-describedby="input-1-live-feedback"></b-form-input>
           <b-form-invalid-feedback
          id="input-1-live-feedback"
        >Name field is required</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Type">
          <b-form-input id="type" v-model.trim="$v.rute_bus.rute_type.$model" :state="validateState('rute_type')"
          aria-describedby="input-2-live-feedback"></b-form-input>
           <b-form-invalid-feedback
          id="input-2-live-feedback"
        >Type field is required</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>

    <!-- Add Halte modal -->
    <b-modal
      id="modal-add-halte"
      ref="modal"
      title="Add Halte Bus"
      @show="showModalAddHalte"
      @hidden="resetModalAddHalte"
      @ok="handleOkAddHalte"
    >

      <form ref="form" @submit="handleSubmitAddHalte">

        <div>
          <label class="typo__label">Select with search</label>
          <multiselect v-model="selected" :options="options" :custom-label="nameWithLang" placeholder="-- Please select halte bus --" label="name" track-by="name"></multiselect>
        </div>
    
      </form>
    </b-modal>
    
  
</b-container>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";


export default {
  mixins: [validationMixin],
  name: 'HalteList',
  data () {
    return {
      value: [],
      sortBy: 'key',
      fields: [
        { key: 'name',label: 'Name', sortable: true, 'class': 'text-left' },
        { key: 'type',label: 'Type', sortable: true, 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      field2: [
        { key: 'key',label: 'No.', sortable: true, 'class': 'text-left' },
        { key: 'name',label: 'Name', 'class': 'text-left' },
        { key: 'lat',label: 'Latitude', 'class': 'text-left' },
        { key: 'long',label: 'Longitude', 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      selected: null,
      options: [],
      filter: null,
      filterOn: [],
      rute_buses: [],
      errors: [],
      ref: firebase.firestore().collection('rute_bus'),
      lastIndex: 0,
      rute_bus: {
        rute_name: null,
        rute_type: null
      },
      halte_buses: [],
      halte_bus: {},
      index: 0,
      indexRute: 0,
      indexHalte: 0,
      lastIndexHalte: 0,
      i: 0,
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
            // console.log("subcollection jalan");
            querySnapshot.forEach(doc2 => {
                var tempObj = {
                    key: doc2.id,
                    halte_name: doc2.data().name,
                    lat: doc2.data().latitude,
                    long: doc2.data().longitude
                };
                this.rute_buses[this.i].halte_bus.push(tempObj);
                if(parseInt(doc2.id)>this.lastIndexHalte){
                  this.lastIndexHalte = doc2.id;
                }
                
            });
            this.i=this.i+1;
        }).catch(err => {
          console.log("Error getting sub-collection documents", err);
        });
      });

    });
  },
   validations: {
    rute_bus: {
      rute_name: {
        required
      },
      rute_type: {
        required
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.rute_bus[name];
      return $dirty ? !$error : null;
    },
    nameWithLang ({name}) {
      return `${name}`
    },
    toggleDetails(row){
       if(row._showDetails){
          this.$set(row, '_showDetails', false)
          this.ref.doc(row.key).collection('halte_bus').onSnapshot((querySnapshot) => {
            this.lastIndexHalte = 0;
            this.halte_buses = [];
            querySnapshot.forEach((doc) => {
              this.halte_buses.push({
                key: doc.id,
                name: doc.data().name,
                lat: doc.data().latitude,
                long: doc.data().longitude,
              });
              if(parseInt(doc.id)>this.lastIndexHalte){
                this.lastIndexHalte = doc.id;
              }
            });
          });
          //console.log("last index :" + this.lastIndexHalte);
        }else{
          this.ref.doc(row.key).collection('halte_bus').onSnapshot((querySnapshot) => {
            this.lastIndexHalte = 0;
            this.halte_buses = [];
            querySnapshot.forEach((doc) => {
              this.halte_buses.push({
                key: doc.id,
                name: doc.data().name,
                lat: doc.data().latitude,
                long: doc.data().longitude,
              });
              if(parseInt(doc.id)>this.lastIndexHalte){
                this.lastIndexHalte = doc.id;
              }
            });
          });
          //console.log("last index :" + this.lastIndexHalte);
        this.$nextTick(() => {
          this.$set(row, '_showDetails', true)
        })
        }
    },
    editrute (id) {
      router.push({
        name: 'EditRute',
        params: { id: id.key }
      })
    },
    deleterute (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('rute_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    deletehalte (id,key) {
      if(confirm("Yakin akan menghapus data??")){
        var temp = parseInt(key) + 1;
        firebase.firestore().collection('rute_bus').doc('rute_'+temp).collection('halte_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    resetModalAdd() {
      this.rute_bus.rute_name = ''
      this.rute_bus.rute_type = ''
      this.index = 0
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      bvModalEvt.preventDefault();
      this.handleSubmitAdd()
    },
    handleSubmitAdd() {
      this.$v.rute_bus.$touch();
      if (this.$v.rute_bus.$anyError) {
        return;
      }
      this.index = parseInt(this.lastIndex) + 1;
      this.ref.doc('rute_'+this.index).set(this.rute_bus).then(() => {
        console.log("Document successfully added!");
        this.rute_bus.rute_name = ''
        this.rute_bus.rute_type = ''
        this.index = 0
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
      })
    },
    info(index, button) {
      this.indexRute = index + 1
      this.$root.$emit('bv::show::modal', 'modal-add-halte', button)
    },
    resetModalAddHalte() {
      this.halte_bus.name = ''
      this.halte_bus.latitude = ''
      this.halte_bus.longitude = ''
      this.halte_bus.type = ''
      this.indexHalte = 0
    },
    showModalAddHalte() {
      this.halte_bus.name = ''
      this.halte_bus.latitude = ''
      this.halte_bus.longitude = ''
      this.halte_bus.type = ''
      this.indexHalte = 0

      firebase.firestore().collection('halte_bus').onSnapshot((querySnapshot) => {
        this.options = [];
        this.halte_bus = {};
        querySnapshot.forEach((doc) => {
          this.halte_bus.name = doc.data().name;
          this.halte_bus.latitude = doc.data().latitude;
          this.halte_bus.longitude = doc.data().longitude;
          this.halte_bus.type = doc.data().type;
          this.options.push({
      
              name: doc.data().name,
              latitude: doc.data().latitude,
              longitude: doc.data().longitude,
              type: doc.data().type,
         
        
          });
        });
      });
    },
    handleOkAddHalte(bvModalEvt) {
      this.handleSubmitAddHalte(bvModalEvt)
    },
    handleSubmitAddHalte(evt) {
      evt.preventDefault()
      this.indexHalte = parseInt(this.halte_buses.length) + 1;
      this.halte_bus.key = this.indexHalte;
      this.halte_bus.name = this.selected.name;
      this.halte_bus.latitude = this.selected.latitude;
      this.halte_bus.longitude = this.selected.longitude;
       this.halte_bus.type = this.selected.type;
      this.ref.doc('rute_'+this.indexRute).collection('halte_bus').doc(this.indexHalte.toString()).set(this.halte_bus).then(() => {
        console.log("Document successfully added!");
        this.halte_bus.name = ''
        this.halte_bus.latitude = ''
        this.halte_bus.longitude = ''
        this.halte_bus.type = ''
        this.indexHalte = 0
        this.halte_bus.key = 0
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-halte')
      })
    },

  },
  mounted(){
 
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .add-halte {
    float: right;
  }
</style>