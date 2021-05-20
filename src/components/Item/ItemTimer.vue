<template>
	<div v-if="timerSeconds > 0">Dropping ({{ timerSeconds }})</div>
	<div v-else>Dropping</div> 
</template>

<script>
	import Vue from 'vue'
	var timeouts = {};
	
	export default {
		props: ['item', 'tagId'], // tagId used when the same thumb is on a page multiple times in diff tag groups
		data() {
			return {
				timerSeconds: 0,
            timeoutId: null
			}
		},
		computed: {
			dropDoneDate() { return this.item.dropDoneDate ? this.item.dropDoneDate : 0 },
		},
		methods: {
			setTimerSeconds() {
				// console.log("setTimerSeconds")
				let nowTime = new Date().getTime()
				let dropDoneTime = this.item.dropDoneDate ? this.item.dropDoneDate : 0
				if (dropDoneTime == 0 || dropDoneTime < nowTime) { 
					this.timerSeconds = 0
					return
				}

				this.timerSeconds = Math.floor((dropDoneTime - nowTime)/1000)
			},
		},
		watch: {
			dropDoneDate: { handler(value) { this.setTimerSeconds() }}, // data is twitchy - watch will report blips not in db
			timerSeconds: { handler(value) {
				let timeout = timeouts[this.timeoutId]
				if (timeout != null) { 
               clearTimeout(timeout) 
               Vue.delete(timeouts, timeoutId)
            }
				
				if (value > 0) {
					// set a timeout for 1 sec to update timerSeconds, which will drive this watch notification again
				   let timeout = setTimeout(() => { this.setTimerSeconds() }, 1000) 
               Vue.set(timeouts, timeoutId, timeout) }
			}}
      },
		mounted() { 
         this.timeoutId = this.tagId + (this.item.id ? this.item.id : "")
         this.setTimerSeconds() 
      }
	}
</script>



