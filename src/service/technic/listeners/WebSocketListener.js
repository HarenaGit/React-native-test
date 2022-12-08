import { useEffect } from 'react';
import WebSocketClient from '../websocket/index';

const useWebSocketListener = (_callBack = () => { }) => {

    useEffect(() => {
        WebSocketClient.onReceiveMessage = (data) => {
            _callBack(data);
        };
        return () => WebSocketClient.close();
    }, []);
}

export default useWebSocketListener;