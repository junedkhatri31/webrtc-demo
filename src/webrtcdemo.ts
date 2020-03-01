import { Server as WebSocketServer } from 'ws';
import http, {Server} from 'http';
import { app as express_app } from './express_app';
import { Environment } from './environment';
import WebSocket from 'ws';
import { WebSocketHandler } from './websockethandler';


class WebRTCDemo {
    server: Server;
    environment: Environment;
    wss: WebSocketServer;
    webSocketHandler: WebSocketHandler;

    port: number;
    host: string;

    constructor() {
        this.server = http.createServer();
        this.environment = new Environment();
        this.wss = new WebSocketServer({
            server: this.server
        });
        this.webSocketHandler = new WebSocketHandler();
        this.init();
    }

    init() {
        this.initEnvs();
        this.initWS();
        this.initStatic();
    }

    initWS() {
        this.wss.on('connection', this.wssConnection.bind(this));
    }

    wssConnection(connection: WebSocket) {
        connection.on("message", this.webSocketHandler.onMessage.bind(this.webSocketHandler, connection));
        connection.on("close", this.webSocketHandler.onClose.bind(this.webSocketHandler, connection));
    }

    initStatic() {
        this.server.on('request', express_app);
    }

    initEnvs() {
        this.port = Number.parseInt(this.environment.get('PORT', '9090'));
        this.host = this.environment.get('HOST', '127.0.0.1');
    }

    listen() {
        this.server.listen(this.port, this.host, this.onServerStarted.bind(this));
    }

    onServerStarted() {
        console.log(`http/ws server listening on http://${this.host}:${this.port}`);
    }
}

export { WebRTCDemo }
