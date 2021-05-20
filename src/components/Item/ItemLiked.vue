<template >
	<span class="absolute-bottom-right">
      <q-btn v-if="isLiked"    icon="favorite"        color="blue-9" @click.stop="unlike" :size="size" flat dense/>
		<q-btn v-if="isNotLiked" icon="favorite_border" color="blue-9" @click.stop="like"   :size="size" flat dense/>
	</span>
</template>  

<script>
   import { mapGetters, mapActions } from 'vuex'
	
	export default {
		props: ['item', 'size'], 
		computed: {
         ...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
         iconSize() { return this.size ? this.size : "md" },
         user() { return this.getUser(this.userId)},
			isLiked() { return this.loggedIn && this.user.likedItemIds && this.user.likedItemIds.includes(this.item.id) },		
		   isNotLiked() { return this.loggedIn && (!this.user.likedItemIds || !this.user.likedItemIds.includes(this.item.id)) },		
		},
      methods: {
         ...mapActions('user', ['setLikes']),
			like() { 
            let likedItemIds = this.user.likedItemIds ? [...this.user.likedItemIds] : []
            likedItemIds.push(this.item.id) 
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
			unlike() { 
            let likedItemIds = []
            this.user.likedItemIds.forEach(likedItemId => { if (likedItemId != this.item.id) { likedItemIds.push(likedItemId)} })
            this.setLikes({ id: this.user.id, likedItemIds: likedItemIds }) 
         },
      }
	}
</script>




