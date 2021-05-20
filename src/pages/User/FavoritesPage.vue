<template>
	<q-page class="q-pa-md b-pink">
		<a style="cursor: pointer; text-decoration: underline" v-on:click="navBack()">Back</a>
      <div class="row q-mt-sm text-h6">Favorites</div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in items" :key="key" :item="item" />
      </div>
	</q-page>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionMgr } from 'src/managers/SessionMgr'
	
	export default {
		data() {
			return {
        }
		},
	  	computed: {
			...mapGetters('auth', ['userId']),
			...mapGetters('user', ['getUser']),
			...mapGetters('item', ['getItems']),
			user() { return this.getUser(this.userId) },
         items () { 
            SessionMgr.setFavoriteItemsDesc()             
            const items = this.user.likedItemIds ? this.getItems(this.user.likedItemIds) : []
            return SessionMgr.setDisplayItems(items)
         },
		},
		methods: {
         navBack() { this.$router.go(-1) }
		},
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
	}

</script>

<style>
	.q-img { max-height: 400px; 
	max-width: 500px;
	}
</style>