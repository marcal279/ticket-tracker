export interface Ticket{
    key: any,               // Firebase key
    tid: string,
    
    ticketType: string,
    company: string,
    platform: string,
    empEid: string,
    projLead: string,       // Our side
    vendor: string,    // Their side

    title: string,
    desc?: string,
    status: string,
    priority: string,       // 'High'|'Medium'|'Low'
    requestedBy: { dept: string, requester: string },
    
    // * Dates
    issueDate: Date,
    duration?: string,
    expectedDate?: Date,
    closedDate?: Date,
    lastUpdated: Date,
    // lastViewed: Date,
    
    estimatedAmount?: string,
    approvedAmount?: string,

    updateHistory: { updater: string, updateDate: Date, commitMessage ?: string }[]

    zattachments: {name: string, url: string}[]     // not a typo, just want it last in csv header list, hence z

    // comments?: string,
};