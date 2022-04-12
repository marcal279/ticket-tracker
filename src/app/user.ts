export interface User{
    empEid: string,      // use email as username, later maybe empID too
    name: string,
    password: string,   // later could hash this value
    // picture: null,      // later check how to add this (profile picture)
    role: string,
    mob: string,
    company: string,    // NDL or IMCL
    dept: string,       // Finance, Ops, Legal, Logistics
    designation: string, 
    supervisor: string,
    offExt: string
}