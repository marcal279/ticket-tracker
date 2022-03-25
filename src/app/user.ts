export interface User{
    name: string,
    empID: string,      // can use empID or email as username
    email: string,
    password: string,   // later could hash this value
    picture: null,      // later check how to add this (profile picture)
    dept: string,       // Finance, Ops, Legal, Logistics
}