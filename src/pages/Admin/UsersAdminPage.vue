<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h5">Users</div>
      <div class="q-pl-md q-mt-none">
         <q-checkbox v-model="showRegUsers"  label="Registered Users"  class="text-grey-10" color="grey-10" dense/>
         <q-checkbox v-model="showAnonUsers" label="Anon Users"  class="text-grey-10 q-pl-md" color="grey-10" dense/>
      </div>
		<div class="q-px-sm absolute full-width full-height">
			<q-table :columns="columns" :visible-columns="visibleColumns" :data="users" 
            row-key="name" :filter="tableDataFilter" :pagination.sync="pagination" flat>
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-phone" slot-scope="props" :props="props">
               {{ formatPhone(props.row.phone) }}
    				<q-btn v-if="acceptTexts(props.row)" icon="textsms" @click="promptForText(props.row)" size="sm" flat dense/>
  				</q-td>
				<q-td slot="body-cell-edit" slot-scope="props" :props="props">
    				<q-btn icon="edit" @click="edit(props.row)" size="sm" flat dense/>
  				</q-td>
			</q-table>
         <div style="height: 75px"/>
		</div>
		<q-dialog v-model="showEditModal">
			<user-edit :user="userToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showTextModal">
         <q-card style="min-width: 350px">
         <q-card-section><div class="text-h6">Send Text</div></q-card-section>
         <q-card-section class="q-pt-none"><q-input v-model="textMsg" autofocus dense /></q-card-section>
         <q-card-actions align="right" class="text-primary">
            <q-btn label="Cancel" v-close-popup     flat />
            <q-btn label="Send" @click="sendText()" flat />
         </q-card-actions>
         </q-card>
      </q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { SmsMgr } from 'src/managers/SmsMgr'
   import { formatTightPhone } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
            showRegUsers:  true,
				showAnonUsers: false,
				showEditModal: false,
				showTextModal: false,
				textUser: null,
            textMsg: '',
            userText: '',
				tableDataFilter: '',
				columns: [
        			{ name: 'email',      label: 'Email',       align: 'left',   field: 'tempEmail',  sortable: true },
				 	{ name: 'firstName',  label: 'First Name',  align: 'left',   field: 'firstName',  sortable: true },
				 	{ name: 'lastName',   label: 'Last Name',   align: 'left',   field: 'lastName',   sortable: true },
					{ name: 'nickname',   label: 'Nickname',    align: 'left',   field: 'nickname',   sortable: true },
					{ name: 'sendEmail',  label: 'Email',       align: 'center', field: 'email',      format: val => val ? 'Yes' : '' }, 
					{ name: 'phone',      label: 'Phone',       align: 'center', field: 'phone' },     
					{ name: 'admin',      label: 'Permissions', align: 'center', field: 'isAdmin',    sortable: true, sort: (a, b) => a - b, format: val => val ? 'Admin' : '' }, 
					{ name: 'errorEmail', label: 'Error Email', align: 'center', field: 'errorEmail', format: val => val ? 'Yes' : '' }, 
					{ name: 'edit' },
				],
            pagination: { rowsPerPage: 25 },
 			   userToEdit: null,
			}
		},
		computed: {
			...mapGetters('user', ['getUsers', 'getUser']),
			visibleColumns() { 
            let cols = ['email', 'firstName', 'lastName', 'nickname', 'sendEmail']
            if (this.showRegUsers) { cols = cols.concat(['phone', 'admin', 'errorEmail']) }
            return cols.concat(['edit'])
         },
         users() { 
            let dispUsers = []
            for (var user of this.getUsers) {
               const dispUser = Object.assign({}, user)
               dispUser.tempEmail = user.authEmailCopy ? user.authEmailCopy : user.anonUserEmail
               if ((this.showRegUsers && user.authEmailCopy) || (this.showAnonUsers && user.anonUserEmail)) { 
                  dispUsers.push(dispUser) 
               }  
            }
            dispUsers.sort((a, b) => (a.tempEmail > b.tempEmail) ? 1 : -1)
            return dispUsers
         },
 		},
		methods: {
         ...mapActions('sms', ['createOutboundSms']),
         edit(user) {
				this.userToEdit = user
				this.showEditModal = true
         },
         formatPhone(phone) { return formatTightPhone(phone) }, 
         acceptTexts(user) { return user.phone && user.acceptTexts }, 
         promptForText(user) { 
            this.textUser = user
            this.textMsg = ""
            this.showTextModal = true
         },
         sendText() { 
            this.createOutboundSms(SmsMgr.createOutboundSms(this.textMsg, this.textUser))
            this.showTextModal = false
         }
		},
		components: {
			'user-edit' : require('components/Admin/UserEdit.vue').default
		},
	}

</script>