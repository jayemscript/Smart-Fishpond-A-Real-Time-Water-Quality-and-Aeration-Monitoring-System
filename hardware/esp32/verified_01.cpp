#include <WiFi.h>
#include <SocketIOclient.h>

SocketIOclient socketIO;

const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";

// Socket.IO event handler
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {

    case sIOtype_DISCONNECT:
      Serial.println("Disconnected from Socket.IO");
      break;

    case sIOtype_CONNECT:
      Serial.println("Connected to Socket.IO server");
      socketIO.send(sIOtype_CONNECT, "/");
      break;

    case sIOtype_EVENT:
      Serial.print("Event: ");
      Serial.println((char*)payload);
      break;

    case sIOtype_ERROR:
      Serial.print("Error: ");
      Serial.println((char*)payload);
      break;

    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  // NestJS Socket.IO (v4)
  socketIO.begin("192.168.100.90", 3000, "/socket.io/?EIO=4&transport=websocket");
  socketIO.onEvent(socketIOEvent);
}

void loop() {
  socketIO.loop();
}
