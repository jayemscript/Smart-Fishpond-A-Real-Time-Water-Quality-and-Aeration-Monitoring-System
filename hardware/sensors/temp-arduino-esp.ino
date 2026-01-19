#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();

  if (sensors.getDeviceCount() == 0) {
    Serial.println("ERROR: No sensor detected!");
    while (1) delay(1000);
  } else {
    Serial.print("Sensor count: ");
    Serial.println(sensors.getDeviceCount());
  }
}

void loop() {
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("ERROR: Disconnected");
  } else {
    Serial.print("Temperature C: ");
    Serial.println(tempC, 2);
  }

  delay(3000);
}
