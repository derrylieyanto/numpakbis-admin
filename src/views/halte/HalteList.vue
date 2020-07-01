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
              <b-table striped hover :items="halte_buses" :fields="fields" :filter="filter" 
                :filterIncludedFields="filterOn" :current-page="currentPage"
                :per-page="perPage"
                @filtered="onFiltered"
              >
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="edithalte(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletehalte(row.item)">Delete</b-button>
                </template>
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
                  label="Name">
          <b-form-input id="name" v-model.trim="$v.halte_bus.name.$model" :state="validateState('name')" aria-describedby="input-1-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-1-live-feedback"
        >Name field is required</b-form-invalid-feedback>
         <span style="color:red;font-size:11px" v-if="isSame">Halte telah tersedia.</span>
        </b-form-group>

         <b-form-group id="fieldsetHorizontal"

                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Rute">
          <b-form-input id="rute" v-model.trim="$v.halte_bus.rute.$model" :state="validateState('rute')" aria-describedby="input-2-live-feedback" ></b-form-input>
          <b-form-invalid-feedback
          id="input-2-live-feedback"
        >Rute field is required</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Latitude">
          <b-form-input id="latitude" v-model.trim="$v.halte_bus.latitude.$model" :state="validateState('latitude')" aria-describedby="input-3-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-3-live-feedback"
        >Latitude field is required</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Longitude">
          <b-form-input id="longitude" v-model.trim="$v.halte_bus.longitude.$model" :state="validateState('longitude')" aria-describedby="input-4-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-4-live-feedback"
        >Longitude field is required</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Type">
          <b-form-input id="type" v-model.trim="$v.halte_bus.type.$model" :state="validateState('type')" aria-describedby="input-5-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-5-live-feedback"
        >Type field is required</b-form-invalid-feedback>
       
        </b-form-group>
      </form>
    </b-modal>
    
  
</b-container>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";


export default {
  mixins: [validationMixin],
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
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      halte_buses: [],
      errors: [],
      ref: firebase.firestore().collection('halte_bus'),
      lastIndex: 0,
      halte_bus: {
        name: null,
        rute: null,
        latitude: null,
        longitude: null,
        type: null
      },
      index: 0,
      isSame: false,
    }
  },
   validations: {
    halte_bus: {
      name: {required,minLength: minLength(3)},
      rute: {required},
      latitude: {required},
      longitude: {required},
      type: {required},
  
    }
  },
   mounted() {
      // Set the initial number of items
      this.totalRows = this.halte_buses.length
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
      this.totalRows = this.halte_buses.length;
    });
    
  },
  methods: {
     onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
    validateState(name) {
      const { $dirty, $error } = this.$v.halte_bus[name];
      return $dirty ? !$error : null;
    },
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
      this.isSame = false
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      bvModalEvt.preventDefault()
       this.isSame = false;
      this.halte_buses.forEach(this.checkName);
      // if(!this.isNotSame){
         
      // }else{
      //   console.log("SAMA BOS");
      // }
      this.handleSubmitAdd();
     
    },
    checkName(item) {
        if(item.name.trim().toLowerCase() == this.halte_bus.name.trim().toLowerCase())
          this.isSame = true;
    },
    handleSubmitAdd() {
      this.$v.halte_bus.$touch();
      if (this.$v.halte_bus.$anyError) {
        return;
      }
      if(this.isSame){
        return
      }
 
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
          this.isSame = false
        })
        .catch((error) => {
          alert("Error adding document: ", error);
        });
      
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
        this.halte_bus.name = ''
          this.halte_bus.latitude = ''
          this.halte_bus.longitude = ''
          this.halte_bus.type = ''
          this.halte_bus.rute = ''
          this.index = 0
          this.isSame = false
      })
    }
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