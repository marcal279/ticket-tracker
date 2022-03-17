export interface Ticket{
    tid: string,
    empid: string,
    title: string,
    desc: string|null,
    status: string|'Pending'|'Production'|'Testing'|'Approval'|'Closed',
    // issueDate: Date|null,
    // expectedDate: Date|null,
    duration: string|null
};