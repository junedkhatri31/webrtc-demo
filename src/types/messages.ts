class WebSocketMessage {
    type: "login" | "offer" | "answer" | "candidate" | "leave";
    name: string;

    constructor(type: "login" | "offer" | "answer" | "candidate" | "leave", name: string) {
        this.type = type;
        this.name = name;
    }
}

declare class OfferMessage extends WebSocketMessage{
    offer: any;
}

declare class AnswerMessage extends WebSocketMessage{
    answer: any;
}

declare class CandidateMessage extends WebSocketMessage{
    candidate: any;
}

class LeaveMessage extends WebSocketMessage {
    constructor(name: string) {
        super('leave', name);
    }
}

export { WebSocketMessage, OfferMessage, AnswerMessage, CandidateMessage, LeaveMessage };
