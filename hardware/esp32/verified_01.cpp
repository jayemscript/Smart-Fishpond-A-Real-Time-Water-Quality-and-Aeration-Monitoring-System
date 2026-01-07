#include <WiFi.h>
#include <SocketIOclient.h>

SocketIOclient socketIO;

const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {

    case sIOtype_DISCONNECT:
      Serial.println("Disconnected from Socket.IO");
      break;

    case sIOtype_CONNECT:
      Serial.println("Connected to Socket.IO server");
      break;

    case sIOtype_EVENT:
      Serial.print("Event: ");
      Serial.println((char*)payload);
      break;

    case sIOtype_ERROR:
      Serial.print("Error: ");
      Serial.println((char*)payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  WiFi.setSleep(false); 

  socketIO.begin(
    "192.168.100.90",
    3005,
    "/socket.io/?EIO=3&transport=websocket"
  );

  socketIO.onEvent(socketIOEvent);
}

void loop() {
  socketIO.loop();
  delay(1); // watchdog + WiFi stability
}
