#include <OneWire.h>
#include <DallasTemperature.h>

// Pin where DS18B20 DATA is connected
#define ONE_WIRE_BUS 2  

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  Serial.println("Initializing DS18B20...");
  Serial.println("Loading...");
  
  sensors.begin();

  // Check if sensor is detected
  if (sensors.getDeviceCount() == 0) {
    Serial.println("❌ ERROR: No DS18B20 sensor found!");
    while (1) {
      delay(1000); // Stop program if sensor is missing
    }
  }

  Serial.println("✅ DS18B20 detected successfully!");
  delay(3000); // 3-second loading delay
}

void loop() {
  Serial.println("Reading temperature...");
  
  sensors.requestTemperatures(); // Request temperature

  float temperatureC = sensors.getTempCByIndex(0);

  // Error handling
  if (temperatureC == DEVICE_DISCONNECTED_C) {
    Serial.println("❌ ERROR: Sensor disconnected!");
  } else {
    Serial.print("🌡 Temperature: ");
    Serial.print(temperatureC);
    Serial.println(" °C");
  }

  delay(3000); // 3-second delay between readings
}
