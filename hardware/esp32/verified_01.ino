#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";

// NestJS server endpoint
const char* serverUrl = "http://192.168.100.90:3005/api/sensors/data";

// Interval between sending data (ms)
const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;

// ---------- Mock Sensor Readings (randomized) ----------

// Temperature (25°C - 32°C for fishpond)
float readTemperature() {
  float base = 28.0;
  float variation = ((float)random(-50, 50)) / 10.0; // -5.0 to +5.0
  return base + variation;
}

// pH Water (6.5 - 8.5 optimal range)
float readPhWater() {
  float base = 7.5;
  float variation = ((float)random(-20, 20)) / 10.0; // -2.0 to +2.0
  return base + variation;
}

// Turbidity (0 - 100 NTU)
float readTurbidity() {
  return (float)random(0, 101);
}

// Helper to send any sensor data
void sendSensorData(const char* sensorType, const String& jsonData) {
  if (WiFi.status() != WL_CONNECTED) return;

  String payload = "{\"sensorType\":\"";
  payload += sensorType;
  payload += "\",\"data\":";
  payload += jsonData;
  payload += "}";

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.print(sensorType);
    Serial.print(" sent, response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error sending ");
    Serial.print(sensorType);
    Serial.print(": ");
    Serial.println(httpResponseCode);
  }

  http.end();
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
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  randomSeed(analogRead(0)); // Initialize random generator
}

void loop() {
  if (millis() - lastSend >= sendInterval) {
    lastSend = millis();

    // --- Temperature sensor ---
    float temp = readTemperature();
    String tempJson = "{\"temperature\":";
    tempJson += temp;
    tempJson += ",\"sensorId\":\"TEMP_SENSOR_01\",\"unit\":\"°C\"}";
    sendSensorData("temperature", tempJson);

    // --- pH water sensor ---
    float ph = readPhWater();
    String phJson = "{\"phLevel\":";
    phJson += ph;
    phJson += ",\"sensorId\":\"PH_SENSOR_01\"}";
    sendSensorData("phWater", phJson);

    // --- Turbidity sensor ---
    float turb = readTurbidity();
    String turbJson = "{\"turbidity\":";
    turbJson += turb;
    turbJson += ",\"sensorId\":\"TURB_SENSOR_01\"}";
    sendSensorData("turbidity", turbJson);

    // --- Add more sensors here as needed ---
  }
}
