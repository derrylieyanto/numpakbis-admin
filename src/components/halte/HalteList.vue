<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Halte List
        <b-link href="#/add-halte">(Add Halte)</b-link>
        <b-btn class="add-btn" variant="success" @click.stop="addhalte(lastIndex)">Edit</b-btn>
      </h2>
      <b-table striped hover :items="halte_buses" :fields="fields">
        <template slot="actions" scope="row">
          <b-btn size="sm" @click.stop="details(row.item)">Details</b-btn>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>

import firebase from '.../Firebase'
import router from '.../router'

export default {
  name: 'HalteList',
  data () {
    return {
      fields: {
        name: { label: 'Name', sortable: true, 'class': 'text-left' },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      halte_buses: [],
      errors: [],
      ref: firebase.firestore().collection('halte_bus'),
      lastIndex: 0,
    }
  },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.halte_buses = [];
      querySnapshot.forEach((doc) => {
        this.halte_buses.push({
          key: doc.id,
          name: doc.data().name
        });
        var temp = doc.id.split("_");
        this.lastIndex = temp[1];
      });
    });
    console.log(this.lastIndex);
  },
  methods: {
      addhalte (id) {
      router.push({
        name: 'EditHalte',
        params: { id: id }
      })
    },
    details (halte_bus) {
      router.push({ 
          name: 'ShowHalte', 
          params: { id: halte_bus.key }
        })
    }
  }
}
</script>

<style>
  .table {
    width: 96%;
    margin: 0 auto;
  }
  .add-btn {
    margin-left: 20px;
    width: 70px;
  }
</style>