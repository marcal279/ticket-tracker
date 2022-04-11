export interface Ticket{
    tid: string,
    company: string,
    platform: string,
    empEid: string,
    dept: string|null,
    title: string,
    desc: string|null,
    status: string, // 'AAPending'|'Production'|'Testing'|'Approval'|'ZZClosed',
    issueDate: Date,
    duration: string|null,
    expectedDate: Date,
    priority: string,// 'High'|'Medium'|'Low'
    comments: string,
};