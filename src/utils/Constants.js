
export const ItemDisplayType = {
   MINI:  'MiniThumbnail',
   THUMB: 'Thumbnail',
   BID:   'BidThumbnail',
   CART:  'CartThumbnail',
   FULL:  'Full'
}

export const Route = {
   HOME:      'Home',
   DROP:      'Drop',
   ITEM:      'Item',
   CART:      'Cart',
   CATEGORY:  'Category',
   RECENT:    'Recent Updates',
   CURRENT:   'Current Activity',
   ACTIVITY:  'Activity',
   FAVORITE:  'Favorites',
   SEARCH:    'Search',
   LOGIN:     'Login',
   REGISTER:  'Register',
   FORGOT:    'Forgot Password',
   TODO:      'ToDo',
}

export const RequestProcessing = {
   AUTOMATIC: 'Automatic',
   MANUAL:    'Manual',
}

export const UI = {
   CLOSE:     'close',
   EDIT:      'edit',
   NONE:      '(none)',
}

export const Versions = [
   "v2.3.1  - 6/6/21",   // Store, display paypal shipping info on invoice; verify email
   "v2.3.0  - 6/3/21",   // Initial paypal Integration for invoice payment - paypal sandbox only
   "v2.2.3  - 6/1/21",   // Add ToDo for sending created invoices.  Add sent/resent to invoice status  
   "v2.2.2  - 5/31/21",  // Fix vuexfire push update issue.  Roll drop items to buy after bid period, but not bid items  
   "v2.2.1  - 5/30/21",  // Vuexfire bind cart to a single doc, hold dropIds in cart for quicker item lookup   
   "v2.2.0  - 5/29/21",  // Remove Drop.saleType, SaleType.DROP takes place of BID, BID becomes manually controlled auction 
                         // Bind active bid and primary drops items to reduce item iteration
                         // Use bound drop items for ItemPage lookup
   "v2.1.3  - 5/25/21",  // Streamline Drop editing. Update toggles, popup image for small screens.  
   "v2.1.2  - 5/23/21",  // Sort search results by name/date/price, refactor ToggleComtainer
   "v2.1.1  - 5/22/21",  // Redeploy icons - sep set for browsers and apple home screens
   "v2.1.0  - 5/21/21",  // Initial search - Algolia integration, search header and page
   "v2.0.0  - 5/19/21",  // Created new drop2 app (quasar 1.15.15, quasar/app 2.2.6) and ported codebase
                         // Created new drop2 git repo so old /dropzone could still be deployed as fallback
                         // icon genie now creates icons in top level /public folder
                         // Implement image caching in custom-service-worker.js
   "v1.5.8  - 5/18/21",  // Initial service worker attempt (failed - need quasar/app v2.x), updated icon 
   "v1.5.7  - 5/17/21",  // Updated icons
   "v1.5.6  - 5/17/21",  // Initial handling of failed emails
   "v1.5.5  - 5/15/21",  // Update InvoicesAdminPage status, display of Shipped and userAcceptsEmail, make invoice.id a dateUid
   "v1.5.4  - 5/13/21",  // Make ToDo rows clickable, mark accepted request Accepting when in process
   "v1.5.3  - 5/12/21",  // Replace Portfolio with Activity, which uses same core as Current Activity
   "v1.5.2  - 5/12/21",  // Misc updates to clean up small mobile screen 
   "v1.5.1  - 5/11/21",  // Update firebase.json to deploy from dist/pwa instead of dist/spa  
   "v1.5.0  - 5/11/21",  // Initial app intall infra, initial user portfolio; user only sees invoices that have been sent
   "v1.4.0  - 5/9/21",   // Sep binding of drop, req, hold items; admin footer; admin sees full bidder info on bids page
   "v1.3.2  - 5/7/21",   // Fix bid countdown problem when thumb is on page twice in diff categories
   "v1.3.1  - 5/7/21",   // Fix quasar build css chunk ordering warning for ItemThumb.vue
   "v1.3.0  - 5/7/21",   // Multiple tags per item
   "v1.2.3  - 5/5/21",   // Base artist recent art on their most recent item avail date, add ItemMgr.getAvailable(...)
   "v1.2.2  - 5/4/21",   // Navigation guard for admin pages, refactor ToDo page and route creation
   "v1.2.1  - 5/3/21",   // Fix ToDo page privledge
   "v1.2.0  - 5/3/21",   // Create Admin ToDo page
   "v1.1.3  - 5/2/21",   // Show user the items they have requested, add anon users to user admin
   "v1.1.2  - 5/1/21",   // Persist cart, specify postLoginRoute
   "v1.1.1  - 4/26/21",  // Create anonymous user for purchase if not logged in
   "v1.1.0  - 4/20/21",  // Initial cart functionality
   "v1.0.0  - 4/17/21",  // Add manual processing of purchase requests
   "v0.21.10 - 11/9/20", // Remove expand icon over image for popup, larger popup
   "v0.21.9 - 11/3/20",  // Popup large image instead of expanding thumb in place
   "v0.21.8 - 10/31/20", // Debounce ItemThumb expand
   "v0.21.7 - 10/30/20", // Toggle component, use on Drop and Category pages
   "v0.21.6 - 10/30/20", // Category avatar
   "v0.21.5 - 10/29/20", // fix Recent Items sort, add expand icon for thumb mouseover, add Drop Page sort selection
   "v0.21.4 - 10/29/20", // fix hold/sold when scrolling through category items 
   "v0.21.3 - 10/29/20", // add category image
   "v0.21.2 - 10/28/20", // mouse-over thumbnail pops up larger image
   "v0.21.1 - 10/28/20", // Combine Name, Sort Name in one col, keep showCols in session
   "v0.21.0 - 10/27/20", // Category as a primary object
   "v0.20.0 - 10/26/20", // RecentItemsPage, refactor item/drop add/edit layout, item.dropId editable
   "v0.19.4 - 10/22/20", // fix TagMgr.primary bug, prev/next through favorites, curr acitivity
   "v0.19.3 - 10/21/20", // SessionMgr, Item Page prev/next inside of an artist category
   "v0.19.2 - 10/20/20", // Do not show hold/sold in item prev/next if they are not shown on drop page
   "v0.19.1 - 10/20/20", // Move drop link to above item
   "v0.19.0 - 10/20/20", // Added swipe, prev/next to Item Page 
   "v0.18.3 - 10/19/20", // Layout Drawer platform dependent show/mini
   "v0.18.2 - 10/19/20", // Site title clickable, home page mobile format
   "v0.18.1 - 10/18/20", // QuickEdit, drop/item descriptions, better control of drops on home page
   "v0.18.0 - 10/16/20", // group items by category in artist page, drop.status private, video link in artist admin list
   "v0.17.1 - 10/15/20", // mini-drawer, transparent footer
   "v0.17.0 - 10/14/20", // Add twitter, artist video,'Drops today'
   "v0.16.1 - 10/12/20", // Fixed outbid popup image
   "v0.16.0 - 10/12/20", // Initial inbound/outbound sms
   "v0.15.2 - 10/9/20",  // Add quick pricing modal, sep bind for userActions
   "v0.15.1 - 10/8/20",  // Multiple images CRUD
   "v0.15.0 - 10/7/20",  // Multiple images groundwork - item.primaryImage
   "v0.14.3 - 10/7/20",  // update CurrentActivity w showDropping/Buys/Outbid
   "v0.14.2 - 10/6/20",  // Update bid popup width
   "v0.14.1 - 10/6/20",  // Add thumbnail to Outbid Alert popup
   "v0.14.0 - 10/6/20",  // Outbid Alert
   "v0.13.1 - 10/5/20",  // handle null/blank user.nickname, click-stop on Schedule Drop
   "v0.13.0 - 10/5/20",  // BidPeriod, thumb on BidsPage, resize fullscreen image to not exceed screen width
   "v0.12.3 - 10/3/20",  // quasar upgrade, CurrentActivity shows last 24 hours, QZoom extension for fullscreen images
   "v0.11.2 - 10/1/20"   // add CurrentActivity
]

export const Colors = [ 'red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]


