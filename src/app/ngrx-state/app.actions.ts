// // ! NOT USING THIS, See State Data Service

// import { createAction, props } from "@ngrx/store";
// import { User } from "../interfaces/user";
// import { LoginComponent } from "../login/login.component";

// export enum AppActions{
//     SetCurrUser = '[USER] Set Current User',
    
//     IncrementNextIndex = '[TICKET] Increment Next Index',
//     SetNextIndex = '[TICKET] Set Next Index',

//     ToggleNightMode = '[NIGHTMODE] Toggle Nightmode',
//     SetLightMode = '[NIGHTMODE] Set to Light Mode',
//     SetDarkMode = '[NIGHTMODE] Set to Dark Mode',
// }

// // export const Init = createAction(AppActions.Init)

// export const SetCurrUser = createAction(
//     AppActions.SetCurrUser,
//     props<{ currUser: User }>()
// )

// export const SetNextIndex = createAction(
//     AppActions.SetNextIndex,
//     props<{ nextIndex: Number }>()
// )
// export const IncrementNextIndex = createAction(
//     AppActions.IncrementNextIndex
// )

// export const ToggleNightMode = createAction(
//     AppActions.ToggleNightMode
// )
// export const SetLightMode = createAction(
//     AppActions.SetLightMode
// )
// export const SetDarkMode = createAction(
//     AppActions.SetDarkMode
// )

// // https://v12.ngrx.io/guide/store/selectors scroll a bit for exact usage we need

// * https://www.c-sharpcorner.com/article/state-management-in-angular-using-ngrx/

import { Action } from "@ngrx/store";
import { User } from "../interfaces/user";

export const STORE_USER = 'STORE_USER';

export const STORE_INDEX = 'STORE_INDEX';
export const INCREMENT_INDEX = 'INCREMENT_INDEX';

export class UserAction implements Action{
    readonly type: string = STORE_USER;
    // payload: User;

    constructor(public payload: User){}
}


export class StoreIndexAction implements Action{
    readonly type: string = STORE_INDEX;

    constructor(public payload: Number){}
}
export class IncrementIndexAction implements Action{
    readonly type: string = INCREMENT_INDEX;

    constructor(public payload: any){}  // this doesnt need a payload, but error in reducer if i dont put this
}