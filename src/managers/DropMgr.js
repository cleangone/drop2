
/*
   drop
      id
      status
      name
      description
      startDate
      defaultSaleType
      imageUrl
*/

export const DropStatus = {
   PRIVATE:    'Private',
   SETUP:      'Setup',
   SCHEDULING: 'Scheduling',
   SCHEDULED:  'Scheduled',
   START_COUNTDOWN: 'Start Countdown',
   COUNTDOWN:  'Countdown',
   LIVE:       'Live',
   DROPPED:    'Dropped'
}

export const HomeGroup = {
   PRIMARY:   'Primary',
   SECONDARY: 'Secondary',
   NONE:      'None',
}

export class DropMgr {
   static isPreDrop(drop)        { return DropMgr.isPrivate(drop) || DropMgr.isSetup(drop) || DropMgr.isInScheduling(drop) }
   static isInScheduling(drop)   { return DropMgr.isScheduling(drop) || DropMgr.isScheduled(drop) }
   static isInCountdown(drop)    { return DropMgr.isStartCountdown(drop) || DropMgr.isCountdown(drop) }
   static isActive(drop)         { return DropMgr.isLive(drop) || DropMgr.isDropped(drop) }
   
   static isStatus(drop, status) { return drop.status == status }
   static isPrivate(drop)        { return drop.status == DropStatus.PRIVATE }
   static isSetup(drop)          { return drop.status == DropStatus.SETUP }
   static isScheduling(drop)     { return drop.status == DropStatus.SCHEDULING }		
   static isScheduled(drop)      { return drop.status == DropStatus.SCHEDULED }		
   static isStartCountdown(drop) { return drop.status == DropStatus.START_COUNTDOWN }		
   static isCountdown(drop)      { return drop.status == DropStatus.COUNTDOWN }		
   static isLive(drop)           { return drop.status == DropStatus.LIVE }		
   static isDropped(drop)        { return drop.status == DropStatus.DROPPED }	

   static hasHomeGroup(drop)     { return DropMgr.isPrimaryGroup(drop) || DropMgr.isSecondaryGroup(drop) }
   static isPrimaryGroup(drop)   { return drop.homeGroup == HomeGroup.PRIMARY }
   static isSecondaryGroup(drop) { return drop.homeGroup == HomeGroup.SECONDARY }
   static homePosition(drop)     { return drop.homePosition ?  drop.homePosition : "zzz" } 
}
