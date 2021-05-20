import { Route } from 'src/utils/Constants'

const routes = [
   {
      path: '/',
      component: () => import('layouts/Layout.vue'),
      children: [
         createRoute('',                     'HomePage',                 Route.HOME),
         createRoute('/auth/login/:route',   'Auth/LoginRegisterPage',   Route.LOGIN),
         createRoute('/auth/register',       'Auth/LoginRegisterPage',   Route.REGISTER),
         createRoute('/auth/forgot',         'Auth/ForgotPasswordPage'),
         createRoute('/drop/:id',            'DropPage',                 Route.DROP),
         createRoute('/item/:itemId',        'ItemPage',                 Route.ITEM),
         createRoute('/category/:id/',       'CategoryPage'),
         createRoute('/category/:id/:tagId', 'CategoryPage',             Route.CATEGORY),
         createRoute('/bids/:itemId',        'BidsPage'),
         createRoute('/recent',              'RecentItemsPage',          Route.RECENT),
         createRoute('/cart',                'CartPage',                 Route.CART),
         createRoute('/install',             'InstallPage'),
         createRoute('/current',             'User/CurrentActivityPage', Route.CURRENT),
         createRoute('/activity',            'User/ActivityPage',        Route.ACTIVITY),
         createRoute('/account',             'User/AccountPage'),
         createRoute('/favorites',           'User/FavoritesPage',       Route.FAVORITE),
         createRoute('/actions',             'User/ActionsPage'),
         createRoute('/invoices',            'User/InvoicesPage'),
         createAdminRoute('/todo',           'ToDoAdminPage',            Route.TODO),
         createAdminRoute('/drops',          'DropsAdminPage'),
         createAdminRoute('/dropitems/:id',  'DropItemsAdminPage'),
         createAdminRoute('/reqs/:itemId',        'PurchaseReqsAdminPage'),
         createAdminRoute('/reqs/:itemId/:route', 'PurchaseReqsAdminPage'),
         createAdminRoute('/categories',     'CategoriesAdminPage'),
         createAdminRoute('/catitems/:id',   'CategoryItemsAdminPage'),
         createAdminRoute('/images/:itemId', 'ItemImagesPage'),
         createAdminRoute('/users',          'UsersAdminPage'),
         createAdminRoute('/invoices',       'InvoicesAdminPage'),
         createAdminRoute('/tags',           'TagsAdminPage'),
         createAdminRoute('/settings',       'SettingsPage'),
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

function createAdminRoute(path, page, name) {   
   const route = createRoute('/admin' + path, 'Admin/' + page, name)
   route.meta = { requiresAdmin: true }
   return route 
}

function createRoute(path, page, name) {    
   return name ? 
      { path: path, component: () => import('pages/' + page + '.vue'), name: name } :
      { path: path, component: () => import('pages/' + page + '.vue') }
}