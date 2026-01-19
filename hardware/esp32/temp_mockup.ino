#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";

// Update this to match your NestJS server
const char* serverUrl = "http://192.168.100.90:3005/sensors/temperature/data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  static unsigned long lastSend = 0;
  if (millis() - lastSend > 3000) { // send every 3 seconds
    lastSend = millis();

    float temp = 28.5; // replace with your sensor reading
    String payload = "{\"data\":{\"temperature\":";
    payload += temp;
    payload += ",\"sensorId\":\"TEMP_SENSOR_01\",\"unit\":\"°C\"}}";

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        Serial.print("Temperature sent, response code: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error sending temperature: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
  }
}
