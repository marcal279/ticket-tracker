// ! NOT USING THIS, See State Data Service

import { Ticket } from "../interfaces/ticket";
import { User } from "../interfaces/user";

export interface AppState{
    user: User;
    tickets: Ticket[];
    nightMode: boolean;
    nextTicket: Number;
}

// https://v12.ngrx.io/guide/store/selectors scroll a bit for exact usage we need

/* 
export interface UserFeatureState{
    user?: User;
    nightMode: boolean;
}
export interface TicketFeatureState{
    nextTicket: Number;
}

export interface AppState{
    userFeature: UserFeatureState;
    ticketFeature: TicketFeatureState;
}

// export const initialState: AppState = {
//     user :  undefined,
//     nightMode : false,
//     nextTicket : 1,
// }
*/