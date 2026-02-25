#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "LouisWifi1";
const char* password = "WelcomeHome2024!";
const char* serverUrl = "http://192.168.100.205:3005/api/sensors/data";

HardwareSerial Link(2);          // UART2
String rxLine = "";

const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;

float temperature = NAN;
float phValue = NAN;
float dissolvedOxygen = NAN;
int floatState = -1;

bool gotTemp=false, gotPH=false, gotDO=false, gotFloat=false;

unsigned long lastWifiPrint = 0;
unsigned long lastWifiRetry = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 STARTED - UART + WiFi");

  // UART2 RX2=GPIO16, TX2=GPIO17 (TX not used but set anyway)
  Link.begin(9600, SERIAL_8N1, 16, 17);
  Serial.println("UART2 listening on GPIO16 (RX2)");

  // Start WiFi (NON-BLOCKING)
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
}

void loop() {
  readArduinoData();

  // Print WiFi status every 1s
  if (millis() - lastWifiPrint >= 1000) {
    lastWifiPrint = millis();
    Serial.print("WiFi status: ");
    Serial.print(WiFi.status());
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("  IP: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println();
    }
  }

  // Retry WiFi every 5s if not connected
  if (WiFi.status() != WL_CONNECTED && millis() - lastWifiRetry >= 5000) {
    lastWifiRetry = millis();
    Serial.println("Retry WiFi...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
  }

  // Send to API every 3s
  if (millis() - lastSend >= sendInterval) {
    lastSend = millis();
    sendToAPI();
  }
}

void readArduinoData() {
  while (Link.available()) {
    char c = (char)Link.read();

    if (c == '\n') {
      String line = rxLine;
      rxLine = "";
      line.trim(); // removes CR too
      if (!line.length()) continue;

      Serial.print("UART: ");
      Serial.println(line);

      if (line.startsWith("TEMP=")) {
        temperature = line.substring(5).toFloat();
        gotTemp = true;
      } else if (line.startsWith("PH=")) {
        phValue = line.substring(3).toFloat();
        gotPH = true;
      } else if (line.startsWith("DO=")) {
        dissolvedOxygen = line.substring(3).toFloat();
        gotDO = true;
      } else if (line.startsWith("FLOAT=")) {
        floatState = line.substring(6).toInt();
        gotFloat = true;
      }
    } else {
      if (c != '\r') rxLine += c;
      if (rxLine.length() > 80) rxLine = ""; // safety
    }
  }
}

void postJson(const String& payload, const String& label) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  Serial.println(label + " -> HTTP " + String(code));
  http.end();
}

void sendToAPI() {
  if (!(gotTemp && gotPH && gotDO && gotFloat)) {
    Serial.println("Waiting full sensor set (TEMP/PH/DO/FLOAT)...");
    return;
  }

  Serial.println("──────────────────────────────");
  Serial.println("TEMP=" + String(temperature,2) +
                 " | PH=" + String(phValue,2) +
                 " | DO=" + String(dissolvedOxygen,2) +
                 " | FLOAT=" + String(floatState));

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected yet, skip POST");
    return;
  }

  Serial.println("POSTING...");
  postJson("{\"sensorType\":\"temperature\",\"data\":{\"temperature\":" + String(temperature, 2) + ",\"sensorId\":\"TEMP_ESP32_01\"}}", "TEMP");
  delay(50);
  postJson("{\"sensorType\":\"phWater\",\"data\":{\"phLevel\":" + String(phValue, 2) + ",\"sensorId\":\"PH_ESP32_01\"}}", "PH");
  delay(50);
  postJson("{\"sensorType\":\"dissolvedOxygen\",\"data\":{\"oxygenLevel\":" + String(dissolvedOxygen, 2) + ",\"sensorId\":\"DO_ESP32_01\"}}", "DO");
  delay(50);
  postJson("{\"sensorType\":\"floatSwitch\",\"data\":{\"level\":" + String(floatState) + ",\"sensorId\":\"FLOAT_ESP32_01\"}}", "FLOAT");
}