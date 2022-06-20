// // ! NOT USING THIS, See State Data Service

// import { Action, createReducer, on } from "@ngrx/store";
// import * as AppActions from "./app.actions";
// import { AppState } from "./app.state";


// export const initialState: AppState = {
//     user: newUser,
//     nightMode: false,
//     nextTicket: 1,
//     tickets: []
// }

// export const appReducer = createReducer(initialState, 
//     /* on(AppActions.Init, (state) => ({...state, user: newUser, nextTicket: 1, nightMode: false})), */
    
//     // * the parameter in below curly braces eg: {currUser}, {nextIndex} must match the name given when creating action
//     // * hence if currUser there, must also be currUser here
//     on(AppActions.SetCurrUser, (state, {currUser}) => ({...state, user: currUser})),
    
//     on(AppActions.SetNextIndex, (state, {nextIndex}) => ({...state, nextTicket: nextIndex})),
//     on(AppActions.IncrementNextIndex, (state) => ({...state, nextTicket: +state.nextTicket + 1})),
    
//     on(AppActions.ToggleNightMode, (state) => ({...state, nightMode: !state.nightMode})),
//     on(AppActions.SetLightMode, (state) => ({...state, nightMode: false})),
//     on(AppActions.SetDarkMode, (state) => ({...state, nightMode: true})),
// )

// // https://v12.ngrx.io/guide/store/selectors scroll a bit for exact usage we need

// * https://www.c-sharpcorner.com/article/state-management-in-angular-using-ngrx/

import { Action } from "@ngrx/store";
import { STORE_USER, UserAction, STORE_INDEX, StoreIndexAction, INCREMENT_INDEX, IncrementIndexAction } from "./app.actions";
// import { StoreIndexAction } 

let newUserObject = {
    empEid: '',
    name: '',
    password: '',
    dept: '',
    role: '',
    mob: '',
    company: '',
    designation: '',
    supervisor: '',
    offExt: '',
}

const initialState = {
    currUser: newUserObject,
    nextIndex: 1
}

export function UserReducer(state = initialState, action: UserAction){
    switch(action.type){
        case STORE_USER:
            return {...state, currUser: action.payload}
        default:
            return state;
    }
}

export function IndexReducer(state = initialState, action: StoreIndexAction|IncrementIndexAction){
    switch(action.type){
        case STORE_INDEX:
            return {...state, nextIndex: action.payload}
        case INCREMENT_INDEX:
            return {...state, nextIndex: state.nextIndex+1 }
        default:
            return state;
    }
}