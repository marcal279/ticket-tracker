export interface Ticket{
    tid: string,
    empid: string,
    dept: string|null,
    title: string,
    desc: string|null,
    status: string, // 'AAPending'|'Production'|'Testing'|'Approval'|'ZZClosed',
    issueDate: string,
    duration: string|null,
    expectedDate: string|null,
    priority: string,// 'High'|'Medium'|'Low'
    comments: string,
};