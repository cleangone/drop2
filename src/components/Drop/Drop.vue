<template>
	<q-card class="card">
      <q-img :src="drop.imageUrl ? drop.imageUrl : 'image-placeholder.png'" 
         v-on:click="navToDropPage" class="cursor-pointer" basic contain>
         <drop-timer v-if="isCountdown" :drop="drop"/>
         <div v-else class="absolute-bottom text-h6">{{ drop.name }}</div>
      </q-img>
		<div class="q-px-xs q-py-md text-bold" :class="dateClass">{{ dateText }}</div>	
      <div class="q-pa-sm" v-html="drop.description" />
  	</q-card> 
</template>

<script>
   import { mapGetters } from 'vuex'
	import { DropMgr } from 'src/managers/DropMgr'
   import { Route, Colors } from 'src/utils/Constants'
   import { formatTodayOr_ddd_MMM_D_h_mm } from 'src/utils/DateUtils'
   
	export default {
		props: ['drop'],
		computed: {
         ...mapGetters('color', Colors),
         isCountdown() { return DropMgr.isCountdown(this.drop) },
			dateClass() { return DropMgr.isLive(this.drop) ? "bg-green" : "" },
         dateText() { 
            if (DropMgr.isLive(this.drop)) { return "Drop is LIVE" }
            else if (DropMgr.isDropped(this.drop)) { return "Dropped " + formatTodayOr_ddd_MMM_D_h_mm(this.drop.startDate) }
            else if (this.drop.startDate) { return "Drops " + formatTodayOr_ddd_MMM_D_h_mm(this.drop.startDate) }
            else { return "Drops soon" }
         }
      },
      methods: {
         navToDropPage() { this.$router.push("/drop/" + this.drop.id) },
      },
      components: {
         'drop-timer' : require('components/Drop/DropTimer.vue').default
      }
	}
</script>

<style>
	.card {
		width: 400px;
		min-height: 250px;
		max-width: 500px;
		min-width: 200px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
	.card .q-img { max-height: 180px; }
	.card .q-img__image { background-size: cover !important; }
	
</style>