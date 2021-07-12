import { SessionMgr } from 'src/managers/SessionMgr'

const ToggleOptions = {
   SHOW_ALL:        { label: 'Show All', value: 'all' }, 
   SHOW_AVAILABLE:  { label: 'Available', value: 'available' },
   SORT_NAME:       { label: 'Sort by Name', value: 'name' },
   SORT_DATE:       { label: 'Date', value: 'date' },
   SORT_PRICE_HIGH: { label: 'Price (Highest)', value: "price" }, 
   SORT_PRICE_LOW:  { label: 'Price (Lowest)', value: "low" },
   CARRIER_USPS:    { label: 'USPS', value: 'usps' }, 
   CARRIER_FEDEX:   { label: 'FedEx', value: 'fedex' }, 
   CARRIER_OTHER:   { label: 'Other', value: 'other' }, 
}

export class ToggleContainerMgr {
   static getShowItemsContainer() {
      return createToggleContainer([ ToggleOptions.SHOW_ALL, ToggleOptions.SHOW_AVAILABLE ], "ShowItemsModel")
   }

   static getSortItemsContainer() {
      return createToggleContainer([ ToggleOptions.SORT_NAME, ToggleOptions.SORT_DATE ], "SortItemsModel")
   }

   static getSortItemsFullContainer() {
      return createToggleContainer(
         [ ToggleOptions.SORT_NAME, ToggleOptions.SORT_DATE, ToggleOptions.SORT_PRICE_HIGH, ToggleOptions.SORT_PRICE_LOW ],
         "SortItemsFullModel")
   }

   static getCarriersContainer() {
      return createToggleContainer(
         [ ToggleOptions.CARRIER_USPS, ToggleOptions.CARRIER_FEDEX, ToggleOptions.CARRIER_OTHER ], 
         "CarriersModel")
   }

   static isShowItemsAll(toggleContainer)    { return isModel(toggleContainer, ToggleOptions.SHOW_ALL) }
   static isSortItemsByName(toggleContainer) { return isModel(toggleContainer, ToggleOptions.SORT_NAME) }
   static isSortItemsByDate(toggleContainer) { return isModel(toggleContainer, ToggleOptions.SORT_DATE) }
   static isSortItemsByPriceHighest(toggleContainer) { return isModel(toggleContainer, ToggleOptions.SORT_PRICE_HIGH) }
   static isSortItemsByPriceLowest(toggleContainer)  { return isModel(toggleContainer, ToggleOptions.SORT_PRICE_LOW) }
   static isUSPS(toggleContainer)  { return isModel(toggleContainer, ToggleOptions.CARRIER_USPS) }
   static isFedEx(toggleContainer) { return isModel(toggleContainer, ToggleOptions.CARRIER_FEDEX) }
}

function createToggleContainer(options, sessionKey) {  
   const toggleContainer =  {
      model: options[0].value, 
      options: options,
      sessionKey: sessionKey,
   }

   const model = SessionMgr.get(toggleContainer.sessionKey)
   if (model != null) { toggleContainer.model = model }

   return toggleContainer
}

export function isModel(toggleContainer, toggleOption) { return toggleContainer.model == toggleOption.value }



