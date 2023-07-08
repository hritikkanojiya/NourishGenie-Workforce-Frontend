export interface prev_state {
    appAgents: number,
    agentsCount: number
}

export interface pagination_prev_state {
    itemsPerPage: number,
    showingFrom: number,
    showingTill: number,
    page: number,
}

export interface ticket_detail {
    subject: string,
    content: string,
    priority: string,
    status: string,
    attachements: any[]
}