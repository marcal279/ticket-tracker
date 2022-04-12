export interface Ticket{
    tid: string,
    company: string,
    platform: string,
    empEid: string,
    dept?: string,
    title: string,
    desc?: string,
    status: string, // 'AAPending'|'Production'|'Testing'|'Approval'|'ZZClosed',
    issueDate: Date,
    duration?: string,
    expectedDate: Date,
    priority: string,// 'High'|'Medium'|'Low'
    comments: string,
};