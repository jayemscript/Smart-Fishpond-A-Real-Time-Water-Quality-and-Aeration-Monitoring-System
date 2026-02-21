#include <WiFi.h>
#include <HTTPClient.h>

// ======================
// WiFi credentials
// ======================
const char* ssid = "LouisWifi1";
const char* password = "WelcomeHome2024!";

// NestJS API endpoint
const char* serverUrl = "http://192.168.100.205:3005/api/sensors/data";

// Send interval
const unsigned long sendInterval = 3000;
unsigned long lastSend = 0;

// ======================
// UART from Arduino
// ======================
HardwareSerial Link(2);  // UART2

// ======================
// Sensor variables
// ======================
float temperature = 0.0;
float phValue = 0.0;
float dissolvedOxygen = 0.0;
String floatState = "UNKNOWN";

// ======================
// Setup
// ======================
void setup() {
  Serial.begin(115200);
  
  // UART (Arduino → ESP32)
  Link.begin(9600, SERIAL_8N1, 16, -1); // RX=16, TX unused
  
  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected");
  Serial.println(WiFi.localIP());
}

// ======================
// Main Loop
// ======================
void loop() {
  readArduinoData();
  sendToAPI();
}

// ======================
// Read data from Arduino
// ======================
void readArduinoData() {
  while (Link.available()) {
    String line = Link.readStringUntil('\n');
    line.trim();
    
    if (line.startsWith("TEMP=")) {
      temperature = line.substring(5).toFloat();
    }
    else if (line.startsWith("PH=")) {
      phValue = line.substring(3).toFloat();
    }
    else if (line.startsWith("DO=")) {
      dissolvedOxygen = line.substring(3).toFloat();
    }
    else if (line.startsWith("FLOAT=")) {
      floatState = line.substring(6);
    }
    
    // Debug output
    Serial.println("Received:");
    Serial.println(line);
  }
}

// ======================
// Send data to NestJS API
// ======================
void sendToAPI() {
  if (millis() - lastSend < sendInterval) return;
  lastSend = millis();
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected");
    return;
  }
  
  HTTPClient http;
  
  // ======================
  // Send temperature
  // ======================
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String tempPayload =
    "{"
      "\"sensorType\":\"temperature\","
      "\"data\":{"
        "\"temperature\":" + String(temperature, 2) + ","
        "\"sensorId\":\"TEMP_ESP32_01\""
      "}"
    "}";
  
  int tempCode = http.POST(tempPayload);
  Serial.print("Temp POST: ");
  Serial.println(tempCode);
  http.end();
  
  delay(100);
  
  // ======================
  // Send pH
  // ======================
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String phPayload =
    "{"
      "\"sensorType\":\"phWater\","
      "\"data\":{"
        "\"phLevel\":" + String(phValue, 2) + ","
        "\"sensorId\":\"PH_ESP32_01\""
      "}"
    "}";
  
  int phCode = http.POST(phPayload);
  Serial.print("pH POST: ");
  Serial.println(phCode);
  http.end();
  
  delay(100);
  
  // ======================
  // Send Dissolved Oxygen
  // ======================
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String doPayload =
    "{"
      "\"sensorType\":\"dissolvedOxygen\","
      "\"data\":{"
        "\"oxygenLevel\":" + String(dissolvedOxygen, 2) + ","
        "\"sensorId\":\"DO_ESP32_01\""
      "}"
    "}";
  
  int doCode = http.POST(doPayload);
  Serial.print("DO POST: ");
  Serial.println(doCode);
  http.end();
  
  delay(100);
  
  // ======================
  // Send Float Switch
  // ======================
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String floatPayload =
    "{"
      "\"sensorType\":\"floatSwitch\","
      "\"data\":{"
        "\"state\":\"" + floatState + "\","
        "\"sensorId\":\"FLOAT_ESP32_01\""
      "}"
    "}";
  
  int floatCode = http.POST(floatPayload);
  Serial.print("Float POST: ");
  Serial.println(floatCode);
  http.end();
}