import VueRouter from 'vue-router'
import HalteList from '@/components/halte/HalteList'
import ShowHalte from '@/components/halte/ShowHalte'
import AddHalte from '@/components/halte/AddHalte'
import EditHalte from '@/components/halte/EditHalte'

export default new VueRouter({
    routes: [
      {
        path: '/',
        name: 'HalteList',
        component: HalteList
      },
      {
        path: '/show-halte/:id',
        name: 'ShowHalte',
        component: ShowHalte
      },
      {
        path: '/add-halte',
        name: 'AddHalte',
        component: AddHalte
      },
      {
        path: '/edit-halte/:id',
        name: 'EditHalte',
        component: EditHalte
      }
    ]
  })