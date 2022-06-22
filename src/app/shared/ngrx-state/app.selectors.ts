// // ! NOT USING THIS, See State Data Service

// import { createFeatureSelector, createSelector, State } from "@ngrx/store";
// import { User } from "../interfaces/user";
// import { appReducer } from "./app.reducers";
// import { AppState } from "./app.state";


// // heirarchy: App Selector, then Feature Selector. Feature is kind of like part of app
// // export const getAppState = createFeatureSelector<State>('TicketsUsers');
// //'TicketUser' is store name

// // consider adding tickets to store too, will make it easier and faster to read & filter

// export const selectUser = (state: AppState) => state.user;
// export const selectNextIndex = (state: AppState) => state.nextTicket;
// export const selectNightModeStatus = (state: AppState) => state.nightMode;

// export const selectAll = createSelector(
//     selectUser,
//     selectNextIndex,
//     selectNightModeStatus,
//     (user: User, nextIndex: Number, nightMode: Boolean) => {
//         return user
//     }
// );

// // export const getUser = createSelector(
// //     (state: AppState) => state.user,

// // );



// // export const getState = createSelector(
// //     selectUser,
// //     selectNextIndex,
// //     selectNightModeStatus,
// //     (user: User, nextTicket: Number, nightMode: Boolean) => {}
// // );

// // https://v12.ngrx.io/guide/store/selectors scroll a bit for exact usage we need