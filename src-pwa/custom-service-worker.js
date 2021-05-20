// Service worker - active if quasar.conf: workboxPluginMode is "InjectManifest"

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { FirebaseConfig } from 'src/boot/firebaseConfig'
   
precacheAndRoute(self.__WB_MANIFEST)
// console.log("custom-service-worker")

/*
 * sample image url:
 *    https://firebasestorage.googleapis.com/
 *       v0/b/dropzone-1de48.appspot.com/o/drops
 *          %2F2020-10-09T12%3A45%3A26_thor-6-08_300x300.jpg?
 *             alt=media&token=2232f7f4-ce17-48b2-985b-446e776b4297
 */

const HOSTNAME = 'firebasestorage.googleapis.com'
const PATHNAME_PREFIX = '/v0/b/' + FirebaseConfig.storageBucket + '/'

registerRoute(
   ({ url }) => {
      // console.log("hostname", url.hostname)
      // console.log("pathname", url.pathname)
      return url.hostname === HOSTNAME && url.pathname.startsWith(PATHNAME_PREFIX)
   }, 
   new CacheFirst({
      cacheName: 'image-cache',
      plugins: [
         // cache responses with status 0 or 200
        new CacheableResponsePlugin({ statuses: [0, 200] })
      ]
    })
)

 
 
