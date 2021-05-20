<template>
   <q-list bordered class="rounded-borders q-mt-sm" >
      <q-expansion-item :label="title" expand-separator :default-opened="expanded" class="text-bold q-pl-xs q-pb-xs">
         <div class="row q-gutter-sm">
            <item v-for="(item, key) in items" :key="key" :item="item" :tagId="tagId" />
         </div>
      </q-expansion-item>
   </q-list>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
      props: ['title', 'tagId', 'items', 'expanded'],
      computed: {
         ...mapGetters('color', Colors),
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
      },
   }
</script>
