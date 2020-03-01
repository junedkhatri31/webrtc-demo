import WebSocket from 'ws';
import { WebSocketMessage, OfferMessage, AnswerMessage, CandidateMessage, LeaveMessage } from './types/messages';
import { User } from './types/user';

class WebSocketHandler {
    users: User[];
    actionMapping = {
        'login': this.login.bind(this),
        'offer': this.offer.bind(this),
        'answer': this.answer.bind(this),
        'candidate': this.candidate.bind(this),
        'leave': this.leave.bind(this),
    };

    constructor() {
        this.users = [];
    }

    onMessage(connection: User, data: WebSocket.Data) {
        let webSocketMessage: WebSocketMessage = this.parseMessage(<string> data);
        let actionToCall = this.actionMapping[webSocketMessage.type] || this.defaultAction.bind(this);
        actionToCall(connection, webSocketMessage);
    }

    onClose(connection: User, code: number, reason: string) {
        if (connection.name) {
            this.removeUser(connection);
            this.leave(connection, new LeaveMessage(connection.otherName));
        }
    }

    sendToClient(connection: WebSocket, message: any) {
        connection.send(JSON.stringify(message));
    }

    parseMessage(message: string): any {
        return JSON.parse(message);
    }

    login(user: User, message: WebSocketMessage) {
        if (this.getUser(message.name)) {
            this.sendToClient(user, {
                type: 'login',
                success: false,
            });
        } else {
            user.name = message.name;
            this.users.push(user);
            this.sendToClient(user, {
                type: 'login',
                success: true
            });
            console.log(`Successfull login: ${user.name}`);
        }
    }

    offer(user: User, offerMessage: OfferMessage) {
        let anotherConnection = this.getUser(offerMessage.name);
        if (anotherConnection) {
            user.otherName = offerMessage.name;
            this.sendToClient(anotherConnection, {
                type: 'offer',
                offer: offerMessage.offer,
                name: user.name
            });
        }
    }

    answer(user: User, answerMessage: AnswerMessage) {
        let anotherConnection = this.getUser(answerMessage.name);
        if (anotherConnection) {
            user.otherName = answerMessage.name;
            this.sendToClient(anotherConnection, {
                type: 'answer',
                answer: answerMessage.answer
            })
        }
    }

    candidate(user: User, candidateMessage: CandidateMessage) {
        let anotherConnection = this.getUser(candidateMessage.name);
        if (anotherConnection) {
            this.sendToClient(anotherConnection, {
                type: 'candidate',
                candidate: candidateMessage.candidate
            });
        }
    }

    leave(user: User, leaveMessage: LeaveMessage) {
        let anotherUser = this.getUser(leaveMessage.name);
        if (anotherUser) {
            anotherUser.otherName = null;
            this.sendToClient(anotherUser, {
                type: 'leave'
            });
        }
    }

    defaultAction(user: User, message: WebSocketMessage) {
        this.sendToClient(user, {
            type: 'error',
            message: `Command not found: ${message.type}`
        });
    }

    getUser(username: string): User {
        let userIndex = this.getUserIndex(username);
        return userIndex !== -1 ? this.users[userIndex] : null;
    }

    removeUser(user: User) {
        console.log(`Removing user ${user.name}`);
        let userIndex = this.getUserIndex(user.name);
        this.users.splice(userIndex, 1);
    }

    getUserIndex(username: string): number {
        for (let i = 0; i < this.users.length; i++) {
            if (username === this.users[i].name) {
                return i;
            }
        }
        return -1;
    }
}
export { WebSocketHandler };
