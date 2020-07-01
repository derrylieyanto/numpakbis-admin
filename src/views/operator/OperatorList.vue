<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Operator Data</h2>
      <div>
          <b-button class="add-btn mx-3" variant="success" v-b-modal.modal-add-operator>Add Operator</b-button>
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
              <b-table striped hover :items="operators" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="editmember(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletemember(row.item)">Delete</b-button>
                </template>
              </b-table>
          </div>
      </div>
  </div>
  

  <!-- Add Operator modal -->
    <b-modal
      id="modal-add-operator"
      ref="modal"
      title="Add Operator Bus"
      @show="showModalAdd"
      @hidden="resetModalAdd"
      @ok="handleOkAdd"
    >
      <form ref="form" @submit="handleSubmitAdd">
        <div>
          <label class="typo__label">Select with search from member</label>
          <multiselect v-model="selected" :options="options" :custom-label="nameWithLang" placeholder="-- Please select member --" label="email" track-by="email"></multiselect>
        </div>
    
        <!-- <b-form-select v-model="selected" :options="options" class="mb-3">

        <template v-slot:first>
          <b-form-select-option :value="null" disabled>-- Please select member --</b-form-select-option>
        </template>
      </b-form-select> -->
    
      </form>
    </b-modal>
    
  
</b-container>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

export default {
  name: 'MemberList',
  data () {
    return {
      fields: [
        { key: 'name',label: 'Name', sortable: true, 'class': 'text-left' },
        { key: 'email',label: 'Email', 'class': 'text-left' },
        { key: 'noHP',label: 'No.HP', sortable: true, 'class': 'text-left' },
        { key: 'actions',label: 'Action', 'class': 'text-center' }
      ],
      filter: null,
      filterOn: [],
      operators: [],
      errors: [],
      ref: firebase.firestore().collection('member'),
      member: {},
      options: [],
      selected: null,
    }
  },
  created () {
      this.ref.onSnapshot((querySnapshot) => {
      this.operators = [];
      querySnapshot.forEach((doc) => {
          if(doc.data().job == "operator"){
              this.operators.push({
                key: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                noHP: doc.data().noHP,
            });
          }
      });
    });

    
  },
  methods: {
    nameWithLang ({email}) {
      return `${email}`
    },
    editmember (id) {
      router.push({
        name: 'EditOperator',
        params: { id: id.key }
      })
    },
    deletemember (id) {
      if(confirm("Yakin akan menghapus data??")){
        firebase.firestore().collection('member').doc(id.key).delete().then(() => {
          console.log("Data berhasil dihapus.");
        }).catch((error) => {
          alert("Error removing document: ", error);
        });
      }
    },
    resetModalAdd() {
      this.member.name = ''
      this.member.email = ''
      this.member.noHP = ''
    },
    showModalAdd() {
      this.member.name = ''
      this.member.email = ''
      this.member.noHP = ''

      firebase.firestore().collection('member').onSnapshot((querySnapshot) => {
        this.options = [];
        this.member = {};
        querySnapshot.forEach((doc) => {    
            if(doc.data().job == "member"){
                this.member.name = doc.data().name;
                this.member.email = doc.data().email;
                this.member.noHP = doc.data().noHP;
                this.member.job = 'operator';
                this.options.push({
                    key: doc.id,
                    email: doc.data().email,
                    name: doc.data().name,
                    noHP: doc.data().noHP,
                });
            }
          
        });
      });
    },
    handleOkAdd(bvModalEvt) {
      // Trigger submit handler
      this.handleSubmitAdd(bvModalEvt)
    },
    handleSubmitAdd(evt) {
      evt.preventDefault()
      this.ref.doc(this.selected.key).set(
        {
          email: this.selected.email,
          name: this.selected.name,
          noHP: this.selected.noHP,
          job: "operator"
        }
      ).then(() => {
        console.log("Document successfully added!");
        this.member.name = ''
        this.member.email = ''
        this.member.noHP = ''
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-operator')
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