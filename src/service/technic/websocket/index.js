import WebSocketConfig from "../../../common/config/WebSocketConfig";

class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.client = new WebSocket(this.url);
        this.client.onmessage = this.onMessage;
        this.client.onerror = (err) =>
            console.log('Error while connecting to the server: ', err);

        console.log('WebSocketClient initialized!');
    }

    send(message) {
        if (this.client && this.client.readyState === this.client.OPEN)
            this.client.send(JSON.stringify(message));
        else console.log('Could not send message: ', message);
    }

    onMessage = (message) => {
        const messagePayload = JSON.parse(message.data);
        if (this.onReceiveMessage) this.onReceiveMessage(messagePayload);
    };

    close = () => {
        this.client.close();
    };
}

const client = new WebSocketClient(WebSocketConfig.url);

export default client;