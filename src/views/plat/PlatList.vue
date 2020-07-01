<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Plat Nomor Data</h2>
      <div>
          <b-button class="add-btn mx-3" variant="success" v-b-modal.modal-add>Add Plat Nomor</b-button>
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
                    plat="search"
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
              <b-table striped hover :items="plat_buses" :fields="fields" :filter="filter" 
                :filterIncludedFields="filterOn" :current-page="currentPage"
                :per-page="perPage"
                @filtered="onFiltered"
              >
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="editplat(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deleteplat(row.item)">Delete</b-button>
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
      title="Add Plat Nomor Bus"
      @show="showModalAdd"
      @hidden="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit="handleSubmitAdd">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="No. Plat">
          <b-form-input id="noPlat" v-model.trim="$v.plat_bus.noPlat.$model" :state="validateState('noPlat')" aria-describedby="input-1-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-1-live-feedback"
        >Nomor Plat field is required</b-form-invalid-feedback>
        </b-form-group>

        <div>
            <label class="typo__label">Select Type and City</label>
            <multiselect  v-model="selected" :options="options" :custom-label="nameWithLang" placeholder="-- Please select type --" label="type" track-by="type"></multiselect>
        </div>
      
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
  name: 'PlatList',
  data () {
    return {
      fields: [
        { key: 'noPlat',label: 'No. Plat', sortable: true, 'class': 'text-left' },
        { key: 'city',label: 'City', sortable: true, 'class': 'text-left' },
        { key: 'type',label: 'Type', sortable: true, 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      plat_buses: [],
      errors: [],
      ref: firebase.firestore().collection('plat_bus'),
      lastIndex: 0,
      plat_bus: {
        noPlat: null,
        city: null,
        type: null
      },
      type: {},
      index: 0,
      isSame: false,
      options: [],
      selected: null,
    }
  },
   validations: {
    plat_bus: {
      noPlat: {required,minLength: minLength(3)},
    }
  },
   mounted() {
      // Set the initial number of items
      this.totalRows = this.plat_buses.length
    },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.plat_buses = [];
      querySnapshot.forEach((doc) => {
        this.plat_buses.push({
          key: doc.id,
          noPlat: doc.data().noPlat,
          city: doc.data().city,
          type: doc.data().type
        });
      });
      this.totalRows = this.plat_buses.length;
    });
    
  },
  methods: {
    nameWithLang ({type, city}) {
      return `${type} - ${city}`
    },
     onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
    validateState(name) {
      const { $dirty, $error } = this.$v.plat_bus[name];
      return $dirty ? !$error : null;
    },
    editplat (id) {
      router.push({
        name: 'EditPlat',
        params: { id: id.key }
      })
    },
    deleteplat (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('plat_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    showModalAdd() {
      this.plat_bus.noPlat = ''
      this.plat_bus.city = ''
      this.plat_bus.type = ''

      firebase.firestore().collection('type_bus').onSnapshot((querySnapshot) => {
        this.options = [];
        this.type = {};
        querySnapshot.forEach((doc) => {    
                this.type.type = doc.data().type;
                this.type.city = doc.data().city;
                this.options.push({
                    key: doc.id,
                    type: doc.data().type,
                    city: doc.data().city,
                });
        });
      });
    },
    resetModalAdd() {
      this.plat_bus.noPlat = ''
      this.plat_bus.city = ''
      this.plat_bus.type = ''
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      bvModalEvt.preventDefault()

      this.handleSubmitAdd();
     
    },
    handleSubmitAdd() {
      this.$v.plat_bus.$touch();
      if (this.$v.plat_bus.$anyError) {
        return;
      }
        this.plat_bus.type = this.selected.type;
        this.plat_bus.city = this.selected.city;
        this.ref.doc().set(this.plat_bus).then(() => {
          console.log("Document successfully added!");
          this.plat_bus.plat = ''
          this.plat_bus.city = ''
          this.plat_bus.type = ''
        })
        .catch((error) => {
          alert("Error adding document: ", error);
        });
      
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
          this.plat_bus.plat = ''
          this.plat_bus.city = ''
          this.plat_bus.type = ''
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