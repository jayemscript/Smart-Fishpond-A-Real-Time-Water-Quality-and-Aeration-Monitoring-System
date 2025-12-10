#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// Use these when using a real DS18B20:
// #include <OneWire.h>
// #include <DallasTemperature.h>
// #define ONE_WIRE_BUS 4
// OneWire oneWire(ONE_WIRE_BUS);
// DallasTemperature sensors(&oneWire);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* ws_host = "192.168.1.100";
const int ws_port = 3000;
const char* ws_path = "/";

const char* SENSOR_ID = "TEMP_SENSOR_01";
const int READING_INTERVAL = 3000;

WebSocketsClient webSocket;
unsigned long lastReadingTime = 0;

void setupWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("[WS] Connected");
  } else if (type == WStype_DISCONNECTED) {
    Serial.println("[WS] Disconnected");
  }
}

float readTemperature() {
  // Simulated temperature (remove when using real sensor)
  static float temp = 28.0;
  temp += (random(-10, 10) / 100.0);
  return constrain(temp, 24.0, 33.0);

  // Real sensor:
  // sensors.requestTemperatures();
  // return sensors.getTempCByIndex(0);
}

void sendTemperatureData(float temperature) {
  StaticJsonDocument<256> doc;

  doc["type"] = "sensor:temperature";

  JsonObject data = doc.createNestedObject("data");
  data["temperature"] = round(temperature * 100.0) / 100.0;
  data["sensorId"] = SENSOR_ID;
  data["unit"] = "°C";
  data["timestamp"] = millis();

  String json;
  serializeJson(doc, json);
  webSocket.sendTXT(json);

  Serial.print("Sent: ");
  Serial.print(temperature);
  Serial.println("°C");
}

void setup() {
  Serial.begin(115200);
  Serial.println("\nESP32 Temperature Sensor");

  setupWiFi();

  webSocket.begin(ws_host, ws_port, ws_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  // For real DS18B20:
  // sensors.begin();
}

void loop() {
  webSocket.loop();

  unsigned long now = millis();
  if (now - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = now;

    float t = readTemperature();
    if (!isnan(t)) {
      sendTemperatureData(t);
    }
  }
}
