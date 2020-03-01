import WebSocket from 'ws';

declare class User extends WebSocket {
    name: string;
    otherName: string;
}

export { User };