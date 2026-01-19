#include <WiFi.h>
#include <HTTPClient.h>

// Serial2 pins for Arduino
#define RXD2 27
#define TXD2 26

// WiFi credentials
const char* ssid = "LouisWifi1";
const char* password = "WelcomeHome2024!";

// NestJS server endpoint
const char* serverUrl = "http://192.168.100.205:3005/api/sensors/data";

// Interval between sending data (ms)
const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;

// Latest temperature from Arduino
float latestTemperature = -100.0;

// Helper to send any sensor data
void sendSensorData(const char* sensorType, const String& jsonData) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping send");
    return;
  }

  String payload = "{\"sensorType\":\"";
  payload += sensorType;
  payload += "\",\"data\":";
  payload += jsonData;
  payload += "}";

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  Serial.print("POST ");
  Serial.print(sensorType);
  Serial.print(" -> ");
  Serial.println(httpResponseCode);

  http.end();
}

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Waiting for temperature from Arduino...");
}

void loop() {
  // Read temperature from Arduino
  if (Serial2.available()) {
    String tempStr = Serial2.readStringUntil('\n');
    tempStr.trim();

    float tempValue = tempStr.toFloat();

    if (tempValue > -50 && tempValue < 125) {
      latestTemperature = tempValue;
      Serial.print("Received temperature: ");
      Serial.println(latestTemperature);
    } else {
      Serial.print("Invalid temperature received: ");
      Serial.println(tempStr);
    }
  }

  if (millis() - lastSend >= sendInterval && latestTemperature > -50) {
    lastSend = millis();

    Serial.println("Sending temperature to API");

    String tempJson = "{\"temperature\":";
    tempJson += latestTemperature;
    tempJson += ",\"sensorId\":\"TEMP_SENSOR_01\",\"unit\":\"°C\"}";
    sendSensorData("temperature", tempJson);

    // pH disabled
    // Turbidity disabled
  }
}
