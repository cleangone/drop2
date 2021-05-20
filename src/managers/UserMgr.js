
/*
    user: 
      id (auth userId)    
      authEmailCopy (filled in if user logged in with email, password)
      anonUserEmail (used for anon logins)
      firstName, lastName
      nickname
      address, city, state, zip, country
      phone
      acceptTexts
      isAdmin   
      likedItemIds []
*/  

export const AlertType = {
   LATE_BID: 'Late Bid',
   OUTBID:   'Outbid',
}

export class UserMgr {   
   static getNickname(user) { 
      if (UserMgr.exists(user.nickname)) { return user.nickname }
      else if (UserMgr.exists(user.firstName)) { return user.firstName }
      else if (UserMgr.exists(user.lastName)) { return user.lastName }
      else if (UserMgr.exists(user.authEmailCopy)) { return user.authEmailCopy }
      else return "User"
   }

   static getUserIdToInfo(users) { 
      let userIdToInfo = new Map()
      for (var user of users) {
         userIdToInfo.set(user.id, UserMgr.getInfo(user))
      }
      
      return userIdToInfo      
   }

   static getInfo(user) { 
      let fullName = UserMgr.fullName(user)
      let email = user.authEmailCopy

      if (UserMgr.exists(user.anonUserEmail)) { 
         fullName += " (Anon User)"
         email = user.anonUserEmail
      }
      
      return { fullName: fullName, email: email }      
   }

   static fullName(user) { 
      if (UserMgr.exists(user.firstName) && UserMgr.exists(user.lastName)) { return user.firstName + " " +  user.lastName}
      else if (UserMgr.exists(user.firstName)) { return user.firstName }
      else if (UserMgr.exists(user.lastName)) { return user.lastName }
      else return ""
   }

   static lookupFullName(userLookup, userId) { 
      const user = userLookup ? userLookup.get(userId) : null
      return user ? user.fullName : "" 
   }
   static lookupEmail(userLookup, userId) { 
      const user = userLookup ? userLookup.get(userId) : null
      return user ? user.email : "" 
   }
   static lookupAcceptsEmail(userLookup, userId) { 
      const user = userLookup ? userLookup.get(userId) : null
      return user ? user.acceptsEmail : false
   }

   static isOutbid(alert)  { return alert.alertType == AlertType.OUTBID } 
   static isLateBid(alert) { return alert.alertType == AlertType.LATE_BID } 
   
   static exists(field) { return field && field.length }
}
