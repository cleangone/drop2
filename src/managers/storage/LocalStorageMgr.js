import { LocalStorage } from 'quasar'
   
export const InstallStatus = {
   INSTALLED: 'Installed',
   LATER:     'Later',
   NEVER:     'Never',
}

export class LocalStorageMgr {   
   static get(key) { return LocalStorage.getItem(key) }
   static set(key, value) { 
      LocalStorage.set(key, value)
      return value 
   }
   
   static getAppInstall()      { return LocalStorageMgr.get('AppInstall') }
   static setAppInstall(value) { return LocalStorageMgr.set('AppInstall', value) }

}
