import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import action   from './action-store'
import auth     from './auth-store'
import cart     from './cart-store'
import category from './category-store'
import color    from './color-store'
import current  from './current-store'
import drop     from './drop-store'
import error    from './error-store'
import install  from './install-store'
import invoice  from './invoice-store'
import item     from './item-store'
import search   from './search-store'
import setting  from './setting-store'
import sms      from './sms-store'
import tag      from './tag-store'
import user     from './user-store'

Vue.use(Vuex)

export default function () {
   const Store = new Vuex.Store({
      modules: {
         action,
         auth,
         cart,
         category,
         color,
         current,
         drop,
         error,
         install,
         invoice,
         item,
         search,
         setting,
         sms,
         tag,
         user
      },
      mutations: {
         ...vuexfireMutations
      },
      // enable strict mode - dev mode only, adds overhead
      // note - disabling in dev because of vuex unhappy with vuexfire collection updates not in mutations
      // strict: process.env.DEV
   })

   return Store
}
