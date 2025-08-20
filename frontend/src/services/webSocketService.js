import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.token = null;
    }

    /**
     * WebSocket bağlantısını başlatır
     */
    connect(token) {
        if (this.isConnected) {
            console.log('WebSocket zaten bağlı');
            return;
        }

        this.token = token;
        
        try {
            // STOMP client oluştur
            this.stompClient = new Client({
                brokerURL: 'ws://localhost:8082/ws/websocket',
                connectHeaders: {
                    'Authorization': `Bearer ${this.token}`
                },
                debug: function (str) {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            this.stompClient.onConnect = (frame) => {
                console.log('WebSocket bağlandı:', frame);
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Mevcut subscription'ları yeniden oluştur
                this.resubscribeAll();
            };

            this.stompClient.onDisconnect = () => {
                console.log('WebSocket bağlantısı kesildi');
                this.isConnected = false;
                
                // Yeniden bağlanma denemesi
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
                    setTimeout(() => this.connect(this.token), 5000);
                }
            };

            this.stompClient.onStompError = (frame) => {
                console.error('STOMP Hatası:', frame);
            };

            // Bağlantıyı başlat
            this.stompClient.activate();

        } catch (error) {
            console.error('WebSocket bağlantı hatası:', error);
        }
    }

    /**
     * WebSocket bağlantısını keser
     */
    disconnect() {
        if (this.stompClient && this.isConnected) {
            this.stompClient.deactivate();
            this.isConnected = false;
            this.subscriptions.clear();
        }
    }

    /**
     * Topic'e subscribe olur
     */
    subscribe(topic, callback) {
        if (!this.isConnected || !this.stompClient) {
            console.warn('WebSocket bağlı değil, subscription ertelendi');
            this.subscriptions.set(topic, { callback });
            return;
        }

        const subscription = this.stompClient.subscribe(topic, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('WebSocket mesaj parse hatası:', error);
            }
        });

        this.subscriptions.set(topic, { callback, subscription });
        console.log(`Topic'e subscribe olundu: ${topic}`);
    }

    /**
     * Topic'ten unsubscribe olur
     */
    unsubscribe(topic) {
        const subscriptionData = this.subscriptions.get(topic);
        if (subscriptionData && subscriptionData.subscription) {
            subscriptionData.subscription.unsubscribe();
            this.subscriptions.delete(topic);
            console.log(`Topic'ten unsubscribe olundu: ${topic}`);
        }
    }

    /**
     * Mesaj gönderir
     */
    send(destination, message) {
        if (!this.isConnected || !this.stompClient) {
            console.warn('WebSocket bağlı değil, mesaj gönderilemedi');
            return;
        }

        this.stompClient.publish({
            destination: destination,
            body: JSON.stringify(message)
        });
    }

    /**
     * Tüm subscription'ları yeniden oluşturur
     */
    resubscribeAll() {
        this.subscriptions.forEach((subscriptionData, topic) => {
            if (subscriptionData && subscriptionData.callback) {
                this.subscribe(topic, subscriptionData.callback);
            }
        });
    }

    /**
     * Bağlantı durumunu kontrol eder
     */
    isConnected() {
        return this.isConnected;
    }
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
