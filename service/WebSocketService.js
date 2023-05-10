import io from 'socket.io-client';


const SERVER_URL = 'http://192.168.1.53:5000';

class WebSocketService {
  socket = null;

  connect() {
    this.socket = io(SERVER_URL);

    this.socket.on('connect', () => {
      console.log('Connected to the WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewData(callback) {
    if (this.socket) {
      this.socket.on('new_signal', data => {
        // Veri alındığında bildirim gönderme işlemi burada yapılacak
        callback(data);
      });
    }
  }
}


export default WebSocketService;
