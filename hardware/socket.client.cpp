#include <WiFi.h>
#include <SocketIoClient.h>

SocketIoClient socket;

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_WIFI_PASSWORD";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  /*
  * Connect ESP32 → NestJS WebSocket Gateway
  * 
  */
  socket.begin("YOUR_SERVER_IP", 3000);   // example: "192.168.1.10"

  // Fires when connected
  socket.on("connect", [](const char* payload, size_t length) {
    Serial.println("Connected to NestJS WebSocket!");
  });

  // Fires when disconnected
  socket.on("disconnect", [](const char* payload, size_t length) {
    Serial.println("Disconnected from NestJS.");
  });
}

void loop() {
  socket.loop();  // required to keep connection alive
}
