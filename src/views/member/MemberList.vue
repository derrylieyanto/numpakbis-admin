<template>
<b-container fluid>

  <div class="card cascade narrower">
    <div class="view cascade gradient-card-header blue-gradient narrower mx-3 py-2  mb-3 d-flex justify-content-between align-items-center">
      <h2 class="white-text mx-auto">Member Data</h2>
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
              <b-table striped hover :items="members" :fields="fields" :filter="filter" :filterIncludedFields="filterOn">
                <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" class="mx-1" @click.stop="details(row.item)">Details</b-button> -->
                <b-button size="sm" class="mx-1" variant="warning" @click.stop="editmember(row.item)">Edit</b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click.stop="deletemember(row.item)">Delete</b-button>
                </template>
              </b-table>
          </div>
      </div>
  </div>
  
  
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
      members: [],
      errors: [],
      ref: firebase.firestore().collection('member'),
      member: {},
    }
  },
  created () {
      this.ref.onSnapshot((querySnapshot) => {
      this.members = [];
      querySnapshot.forEach((doc) => {
          if(doc.data().job == "member"){
              this.members.push({
                key: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                noHP: doc.data().noHP,
            });
          }
      });
    });

    // this.ref.where("job", "==", "member")
    // .get()
    // .then(function(querySnapshot) {
    //     this.members = [];
    //     querySnapshot.forEach(function(doc) {
    //         console.log(doc.data().name);
    //         this.members.push({
    //             key: doc.id,
    //             name: doc.data().name,
    //             email: doc.data().email,
    //             noHP: doc.data().noHP,
    //         });
    //     });
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // });
    
  },
  methods: {
    editmember (id) {
      router.push({
        name: 'EditMember',
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
    // resetModalAdd() {
    //   this.member.name = ''
    //   this.member.email = ''
    //   this.member.longitude = ''
    //   this.member.type = ''
    //   this.index = 0
    // },
    // handleOkAdd(bvModalEvt) {
    //   // Trigger submit handler
    //   this.handleSubmitAdd(bvModalEvt)
    // },
    // handleSubmitAdd(evt) {
    //   evt.preventDefault()
    //   this.index = parseInt(this.lastIndex) + 1;
    //   this.ref.doc('halte_'+this.index).set(this.member).then(() => {
    //     console.log("Document successfully added!");
    //     this.member.name = ''
    //     this.member.latitude = ''
    //     this.member.longitude = ''
    //     this.member.type = ''
    //     this.index = 0
    //   })
    //   .catch((error) => {
    //     alert("Error adding document: ", error);
    //   });
    //   // Hide the modal manually
    //   this.$nextTick(() => {
    //     this.$bvModal.hide('modal-add')
    //   })
    // }
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