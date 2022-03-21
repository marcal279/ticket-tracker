export interface Ticket{
    tid: string,
    empid: string,
    dept: string|null,
    title: string,
    desc: string|null,
    status: string|'AAPending'|'Production'|'Testing'|'Approval'|'ZZClosed',
    // issueDate: Date|null,
    // expectedDate: Date|null,
    duration: string|null,
};