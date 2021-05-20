<template>
   <div v-if="timerSeconds <= 10" class="absolute-full text-h1 flex flex-center">
       <span v-if="timerSeconds == 0">DROP</span>
       <span v-else>{{ timerSeconds }}</span>
   </div>
   <div v-else class="absolute-bottom text-h6">
      {{ drop.name }} :{{ timerSeconds }}
   </div>
</template>

<script>
	import Vue from 'vue'
	var timeouts = {};
	
	export default {
		props: ['drop'], 
		data() {
			return {
            timerSeconds: 0
         }
		},
		computed: {
         startDate() { return this.drop.startDate ? this.drop.startDate : 0 },
		},
		methods: {
         setTimerSeconds() {
				let nowTime = new Date().getTime()
            let startTime = this.drop.startDate ? this.drop.startDate.seconds * 1000 : 0
            
            if (startTime == 0 || startTime < nowTime) { this.timerSeconds = 0 }
            else { this.timerSeconds = Math.floor((startTime - nowTime)/1000) }
         },
		},
		watch: {
			startDate: { handler(value) { this.setTimerSeconds() }}, // data is twitchy - watch will report blips not in db
			timerSeconds: { handler(value) {
				// console.log("watch timerSeconds", value)
				let timeout = timeouts[this.drop.id]
				if (timeout != null) { 
               clearTimeout(timeout) 
               Vue.delete(timeouts, this.drop.id)
            }
            
            if (value > 0) {
               // console.log("Timer changed " + value)
               let timeout = setTimeout(() => { this.timerSeconds-- }, 1000) 
               Vue.set(timeouts, this.drop.id, timeout) } 
            }
         }
      },
		mounted() { this.setTimerSeconds() }
	}
</script>



