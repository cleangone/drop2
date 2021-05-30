<template>
   <div>
      <q-table title="Email Errors" :data="emailErrors" row-key="name" :columns="columns" :visible-columns="visibleColumns" 
         :pagination.sync="pagination" @row-click="rowClicked" :dense="$q.screen.lt.md" flat />
      <q-dialog v-model="showModal">
			<email-error-display :error="errorToShow" @close="showModal=false" />
		</q-dialog>
  </div>     
</template>

<script>
   import { mapGetters } from 'vuex'    
   import { UserMgr } from 'src/managers/UserMgr'   
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'

   export default {
      data() {
	  		return {
            visibleColumns: [ 'name', 'currEmail', 'acceptsEmail', 'failedEmail', 'subject', 'date'],
 				columns: [
        			{ name: 'name',        label: 'Name',         align: 'left',   field: 'userFullName', sortable: true },
				 	{ name: 'currEmail',   label: 'Curr. Email',  align: 'left',   field: 'userCurrEmail' },
					{ name: 'acceptsEmail',label: 'Accepts Email',align: 'center', field: 'userAcceptsEmail' },
					{ name: 'failedEmail', label: 'Failed Email', align: 'left',   field: 'emailTo' },
					{ name: 'subject',     label: 'Subject',      align: 'left',   field: 'emailSubject' },
					{ name: 'date',        label: 'Date ' + localTimezone(), 
                                                             align: 'center', field: 'createdDate', sortable: true, format: val => formatDateTimeOptYear(val) },
				],
            pagination: { rowsPerPage: 20 },
            showModal: false,
            errorToShow: null
			}
		},
		computed: {
         ...mapGetters('error', ['getVisibleEmailErrors']),
         ...mapGetters('user', ['getUserLookup']),
         userLookup() { return this.getUserLookup },
         emailErrors() {
            const dispErrors = []
            for (var error of this.getVisibleEmailErrors) {
               const dispError = Object.assign({}, error)
               dispError.userFullName = UserMgr.lookupFullName(this.userLookup, error.userId)
               dispError.userCurrEmail = UserMgr.lookupEmail(this.userLookup, error.userId)
               dispError.userAcceptsEmail = UserMgr.lookupAcceptsEmail(this.userLookup, error.userId)
               dispErrors.push(dispError)
            }
            
             dispErrors.sort((a, b) => (a.createdDate < b.createdDate) ? -1 : 1)
             return dispErrors
         },
      },
		methods: {
         rowClicked (evt, row) {
            this.errorToShow = row
            this.showModal = true
         },  
      },
      components: {
			'email-error-display' : require('components/General/EmailErrorDisplay.vue').default,
      }
   }
</script>