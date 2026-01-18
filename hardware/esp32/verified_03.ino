// ESP32: Simple receiver from Arduino
HardwareSerial Link(2);  // Use UART2

void setup() {
  Serial.begin(115200);                // USB serial for monitor
  Link.begin(9600, SERIAL_8N1, 16, -1); // RX=16, TX not used

  Serial.println("ESP32 ready. Waiting for Arduino data...");
}

void loop() {
  while (Link.available()) {
    String line = Link.readStringUntil('\n');
    line.trim();

    if (line.startsWith("TEMP=")) {
      float tempC = line.substring(5).toFloat();
      Serial.print("Temperature: ");
      Serial.print(tempC, 2);
      Serial.println(" C");
    } 
    else if (line.startsWith("PH=")) {
      float phValue = line.substring(3).toFloat();
      Serial.print("pH: ");
      Serial.println(phValue, 2);
    } 
    else if (line.startsWith("FLOAT=")) {
      String floatState = line.substring(6);
      Serial.print("Float: ");
      Serial.println(floatState);
    }
  }
}
