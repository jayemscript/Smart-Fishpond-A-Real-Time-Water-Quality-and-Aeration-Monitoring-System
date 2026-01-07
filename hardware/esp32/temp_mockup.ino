#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "WALANG SIGNAL-2G";
const char* password = "PULMANO4586";
const char* mqtt_server = "192.168.100.90";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✓ WiFi connected!");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // Test TCP connection to broker
  Serial.println("\nTesting TCP connection to broker...");
  WiFiClient testClient;
  if (testClient.connect(mqtt_server, mqtt_port)) {
    Serial.println("✓ TCP connection successful!");
    testClient.stop();
  } else {
    Serial.println("✗ TCP connection FAILED! Check broker/firewall.");
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    
    // Try to connect with a unique client ID
    String clientId = "ESP32-" + String(WiFi.macAddress());
    
    if (client.connect(clientId.c_str())) {
      Serial.println("✓ Connected!");
      client.subscribe("esp32/temperature");
    } else {
      Serial.print("✗ Failed, rc=");
      Serial.print(client.state());
      Serial.print(" (");
      
      // Decode error
      switch(client.state()) {
        case -4: Serial.print("TIMEOUT"); break;
        case -3: Serial.print("CONNECTION_LOST"); break;
        case -2: Serial.print("CONNECT_FAILED"); break;
        case -1: Serial.print("DISCONNECTED"); break;
        case  1: Serial.print("BAD_PROTOCOL"); break;
        case  2: Serial.print("BAD_CLIENT_ID"); break;
        case  3: Serial.print("UNAVAILABLE"); break;
        case  4: Serial.print("BAD_CREDENTIALS"); break;
        case  5: Serial.print("UNAUTHORIZED"); break;
      }
      
      Serial.println(")");
      Serial.println("Retrying in 2s...");
      delay(2000);
    }
  }
}