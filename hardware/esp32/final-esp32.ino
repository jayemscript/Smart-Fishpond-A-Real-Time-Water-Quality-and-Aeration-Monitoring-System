#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "LouisWifi1";
const char* password = "WelcomeHome2024!";
const char* serverUrl = "http://192.168.100.205:3005/api/sensors/data";

const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;

HardwareSerial Link(2);

float temperature = 0.0;
float phValue = 0.0;
float dissolvedOxygen = 0.0;
int floatState = -1;

void setup() {
  Serial.begin(115200);
  Link.begin(9600, SERIAL_8N1, 16, -1);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
}

void loop() {
  readArduinoData();
  sendToAPI();
}

void readArduinoData() {
  while (Link.available()) {
    String line = Link.readStringUntil('\n');
    line.trim();

    if (line.startsWith("TEMP="))        temperature = line.substring(5).toFloat();
    else if (line.startsWith("PH="))     phValue = line.substring(3).toFloat();
    else if (line.startsWith("DO="))     dissolvedOxygen = line.substring(3).toFloat();
    else if (line.startsWith("FLOAT="))  floatState = line.substring(6).toInt();
  }
}

void postSensor(HTTPClient& http, String payload, String label) {
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  Serial.println(label + ": " + code);
  http.end();
}

void sendToAPI() {
  if (millis() - lastSend < sendInterval) return;
  lastSend = millis();

  Serial.println("──────────────────────────────");
  Serial.println("TEMP=" + String(temperature, 2) + " | PH=" + String(phValue, 2) + " | DO=" + String(dissolvedOxygen, 2) + " | FLOAT=" + String(floatState));

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected");
    return;
  }

  HTTPClient http;

  postSensor(http, "{\"sensorType\":\"temperature\",\"data\":{\"temperature\":" + String(temperature, 2) + ",\"sensorId\":\"TEMP_ESP32_01\"}}", "TEMP");
  delay(100);
  postSensor(http, "{\"sensorType\":\"phWater\",\"data\":{\"phLevel\":" + String(phValue, 2) + ",\"sensorId\":\"PH_ESP32_01\"}}", "PH");
  delay(100);
  postSensor(http, "{\"sensorType\":\"dissolvedOxygen\",\"data\":{\"oxygenLevel\":" + String(dissolvedOxygen, 2) + ",\"sensorId\":\"DO_ESP32_01\"}}", "DO");
  delay(100);
  postSensor(http, "{\"sensorType\":\"floatSwitch\",\"data\":{\"level\":" + String(floatState) + ",\"sensorId\":\"FLOAT_ESP32_01\"}}", "FLOAT");
}
