<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">BRT Data</h2>
      <div>
          <b-button class="add-btn mx-3" variant="success" v-b-modal.modal-add>Add BRT</b-button>
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
              <b-table striped hover :items="type_buses" :fields="fields" :filter="filter" 
                :filterIncludedFields="filterOn" :current-page="currentPage"
                :per-page="perPage"
                @filtered="onFiltered"
              >
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="edittype(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletetype(row.item)">Delete</b-button>
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
      title="Add Type Bus"
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
          <b-form-input id="type" v-model.trim="$v.type_bus.type.$model" :state="validateState('type')" aria-describedby="input-1-live-feedback"></b-form-input>
          <b-form-invalid-feedback
          id="input-1-live-feedback"
        >Name field is required</b-form-invalid-feedback>
        </b-form-group>

         <b-form-group id="fieldsetHorizontal"

                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="City">
          <b-form-input id="city" v-model.trim="$v.type_bus.city.$model" :state="validateState('city')" aria-describedby="input-2-live-feedback" ></b-form-input>
          <b-form-invalid-feedback
          id="input-2-live-feedback"
        >City field is required</b-form-invalid-feedback>
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
  name: 'BRTList',
  data () {
    return {
      fields: [
        { key: 'type',label: 'Name', sortable: true, 'class': 'text-left' },
        { key: 'city',label: 'City', sortable: true, 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      type_buses: [],
      errors: [],
      ref: firebase.firestore().collection('type_bus'),
      lastIndex: 0,
      type_bus: {
        type: null,
        city: null
      },
      index: 0,
      isSame: false,
    }
  },
   validations: {
    type_bus: {
      city: {required,minLength: minLength(3)},
      type: {required},
  
    }
  },
   mounted() {
      // Set the initial number of items
      this.totalRows = this.type_buses.length
    },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.type_buses = [];
      querySnapshot.forEach((doc) => {
        this.type_buses.push({
          key: doc.id,
          type: doc.data().type,
          city: doc.data().city
        });
        
      });
      this.totalRows = this.type_buses.length;
    });
    
  },
  methods: {
     onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
    validateState(name) {
      const { $dirty, $error } = this.$v.type_bus[name];
      return $dirty ? !$error : null;
    },
    edittype (id) {
      router.push({
        name: 'EditBRT',
        params: { id: id.key }
      })
    },
    deletetype (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('type_bus').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    resetModalAdd() {
      this.type_bus.type = ''
      this.type_bus.city = ''
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      bvModalEvt.preventDefault()

      this.handleSubmitAdd();
     
    },
    handleSubmitAdd() {
      this.$v.type_bus.$touch();
      if (this.$v.type_bus.$anyError) {
        return;
      }

        this.ref.doc().set(this.type_bus).then(() => {
          console.log("Document successfully added!");
          this.type_bus.type = ''
          this.type_bus.city = ''
        })
        .catch((error) => {
          alert("Error adding document: ", error);
        });
      
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
          this.type_bus.type = ''
          this.type_bus.city = ''
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