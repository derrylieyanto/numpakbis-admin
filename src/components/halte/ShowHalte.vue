<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Halte
        <b-link href="#/home">(Halte List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">
          {{halte_bus.name}}
        </template>
        <template slot="lead">
          Name: {{halte_bus.name}}<br>
          Latitude: {{halte_bus.latitude}}<br>
          Longitude: {{halte_bus.longitude}}<br>
          Type: {{halte_bus.type}}<br>
        </template>
        <hr class="my-4">
        <b-btn class="edit-btn" variant="warning" @click.stop="edithalte(key)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deletehalte(key)">Delete</b-btn>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import firebase from '@/Firebase'
import router from '@/router/index.js'

export default {
  name: 'ShowHalte',
  data () {
    return {
      key: '',
      halte_bus: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('halte_bus').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.key = doc.id;
        this.halte_bus = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    edithalte (id) {
      router.push({
        name: 'EditHalte',
        params: { id: id }
      })
    },
    deletehalte (id) {
      firebase.firestore().collection('halte_bus').doc(id).delete().then(() => {
        router.push({
          name: 'HalteList'
        })
      }).catch((error) => {
        alert("Error removing document: ", error);
      });
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
  .edit-btn {
    margin-right: 20px;
    width: 70px;
  }
</style>