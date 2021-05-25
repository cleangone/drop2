<template>
  <q-page>
      <div class="q-pt-sm q-px-sm text-h6 heading" :class="blue">{{ category.name }}</div>
		<items-admin :categoryId="categoryId" :items="items" class="full-width full-height" :class="orange"/>
  	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { UI, Colors } from 'src/utils/Constants'
   
	export default {
		data() {
	  		return {
            categoryId: '',
			}
		},
		computed: {
         ...mapGetters('category', ['getCategory']),
         ...mapGetters('item', ['getItemsWithCategory']),
			...mapGetters('color', Colors),
 			category() { return this.getCategory(this.categoryId) },
         items() { return this.getItemsWithCategory(this.categoryId) },
		},
		components: {
         'items-admin' : require('components/Admin/ItemsAdmin.vue').default,
      },
      created() {
			this.categoryId = this.$route.params.id
      },
   }
</script>