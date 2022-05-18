

import React from 'react'
import UserStore from './userStore'
import AdminStore from './adminStore'
import PowerStore from './powerStore' 


export const storesContext = React.createContext({
    UserStore,
    AdminStore,
    PowerStore
})