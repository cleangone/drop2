<template>
	<form @submit.prevent="submitForm">
		<div class="row q-mb-md">
			<q-input v-model="email" label="Email address" ref="email" type="email"
				:rules="[ val => isValidEmailAddress(val) || 'Please enter a valid email address']"
				lazy-rules outlined stack-label class="col"
			/>
		</div>
		<div class="row q-mb-md">
			<q-input outlined v-model="password" :type="showPassword?'text':'password'" label="Password" ref="password" class="col"    
        		lazy-rules :rules="[ val => val.length >= 6 || 'Minimum 6 characters']">
				<template v-slot:append>
					<q-icon :name="showPassword ? 'visibility' : 'visibility_off'" @click="showPassword = !showPassword" class="cursor-pointer"/>
				</template>
      		</q-input>
		</div>
		<div class="row">
			<q-space />
			<q-btn color="primary" type="submit">
				{{ tab | capitalize }}
			</q-btn>
		</div>
	</form>
</template>

<script>
	import { mapState, mapActions } from 'vuex' 
	export default {
		props: ['tab'],
		data() {
			return {
				email: '', 
				password: '',
				showPassword: false,
			}
		},
		computed: {
			...mapState('tasks', ['sort']),
			...mapState('auth', ['errorMessage'])
    	},
		methods: {
			...mapActions('auth', ['loginUser', 'registerUser', 'resetErrorMessage']),
			isValidEmailAddress(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				    return re.test(String(email).toLowerCase());
			},
			submitForm() {
				this.$refs.email.validate()
				this.$refs.password.validate()
				if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
					if (this.tab == 'login') {
						console.log("logging in")
						this.loginUser(this.createAuthPayload())
					}
					else {
						this.registerUser(this.createAuthPayload())
					}
				}
			},
			createAuthPayload() { return {email: this.email, password: this.password} }
		},
		filters: {
			capitalize(value) {
				return value.charAt(0).toUpperCase() + value.slice(1)
			}
		}
	}
</script>