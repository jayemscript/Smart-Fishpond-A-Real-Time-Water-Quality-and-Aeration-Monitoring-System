#include <WiFi.h>
#include <SocketIOclient.h>

// ===== CONFIG =====
const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";

const char* host = "192.168.100.90"; // NestJS server IP
const uint16_t port = 3005;          // Socket.IO port
const char* path = "/socket.io/";    // Socket.IO path

// ===== GLOBALS =====
SocketIOclient socketIO;
String deviceId = "";
bool isConnected = false;

// ===== SOCKET.IO EVENT HANDLER =====
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      Serial.println("Disconnected from Socket.IO");
      isConnected = false;
      break;

    case sIOtype_CONNECT:
      Serial.println("Connected to Socket.IO server");
      socketIO.send(sIOtype_CONNECT, "/");

      delay(500);

      // Send identification
      {
        String payloadStr = "[\"esp32:identify\",{\"deviceId\":\"" + deviceId + "\"}]";
        socketIO.sendEVENT(payloadStr);
      }

      isConnected = true;
      Serial.println("ESP32 identified to server");
      break;

    case sIOtype_EVENT:
      {
        String eventData = String((char*)payload);
        Serial.print("Event: ");
        Serial.println(eventData);
      }
      break;

    case sIOtype_ERROR:
      Serial.print("Socket.IO Error: ");
      Serial.println((char*)payload);
      isConnected = false;
      break;

    default:
      break;
  }
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Use MAC address as deviceId
  deviceId = WiFi.macAddress();
  deviceId.replace(":", "");
  Serial.print("Device ID: ");
  Serial.println(deviceId);

  // Start Socket.IO
  socketIO.begin(host, port, path, "arduino"); // corrected
  socketIO.onEvent(socketIOEvent);
  socketIO.setReconnectInterval(5000); // auto-reconnect every 5s
}


void loop() {
  socketIO.loop();

  // ===== Heartbeat =====
  static unsigned long lastPing = 0;
  if (millis() - lastPing > 25000) { // every 25s
    String emptyPayload = "";
    socketIO.send(sIOtype_PING, emptyPayload); // must be socketIOmessageType_t
    lastPing = millis();
  }

  // ===== Hello World =====
  static unsigned long lastHello = 0;
  if (millis() - lastHello > 5000) { // every 5s
    Serial.println("Hello World");
    lastHello = millis();
  }
}
