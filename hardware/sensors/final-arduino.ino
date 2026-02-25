// ===== ARDUINO UNO/NANO (Fishpond sender) =====
// Sends: TEMP= , PH= , DO= , FLOAT=  to ESP32 over SoftwareSerial TX on D4
//
// Wiring to ESP32:
//  Arduino D4 (TX) -> voltage divider -> ESP32 RX2 (GPIO16)
//  Arduino GND -> ESP32 GND (direct)
//
// DS18B20:
//  Data -> D2, 4.7k pullup from D2 to 5V
//
// Float switch:
//  One side -> D3, other -> GND (INPUT_PULLUP)
//
// pH sensor analog -> ADS1115 A0 (I2C address 0x48)
// DO sensor analog -> A1
//
// LCD I2C: address 0x27, 16x2

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SoftwareSerial.h>
#include <Adafruit_ADS1X15.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const int FLOAT_PIN     = 3;
const int ONE_WIRE_BUS  = 2;
const int DO_PIN        = A1;
// PH_PIN removed - now using ADS1115

// UART to ESP32 via D4
const int TX_TO_ESP = 4;
SoftwareSerial espSerial(-1, TX_TO_ESP); // RX unused, TX on D4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

Adafruit_ADS1115 ads; // ADS1115 default I2C address 0x48

// ---- Calibration (keep your values) ----
float phSlope  = -5.77;
float phOffset = 22.25;
float doSlope  = 4.88;
float doOffset = 0.00;

const float AREF_V = 5.0;
const int ADC_MAX  = 1023;

// ADS1115 at gain 1x: full scale = 4.096V, 16-bit signed = 32767 counts
const float ADS_GAIN_V   = 4.096;
const int   ADS_ADC_MAX  = 32767;

// ---- Thresholds for LCD status ----
const float DO_MIN   = 4.5;
const float PH_MIN   = 6.5;
const float TEMP_MIN = 25.0;
const float TEMP_MAX = 31.0;

const unsigned long SCREEN_TIME = 5000;
unsigned long lastScreenChange = 0;

const unsigned long SEND_INTERVAL = 3000;
unsigned long lastSend = 0;

int screenIndex = 0;

bool readFloatSwitchDebounced() {
  static bool stableState = HIGH;
  static bool lastReading = HIGH;
  static unsigned long lastChangeMs = 0;

  bool reading = digitalRead(FLOAT_PIN);
  unsigned long now = millis();

  if (reading != lastReading) {
    lastReading = reading;
    lastChangeMs = now;
  }

  if (now - lastChangeMs > 30) {
    stableState = reading;
  }

  return stableState;
}

float readVoltageAnalogPH(int samples = 50) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += ads.readADC_SingleEnded(0); // ADS1115 channel 0 for pH
    delay(8);
  }
  float avg = sum / (float)samples;
  return (avg * ADS_GAIN_V) / ADS_ADC_MAX;
}

float readVoltageAnalog(int pin, int samples = 50) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
    delay(5);
  }
  float avg = sum / (float)samples;
  return (avg * AREF_V) / ADC_MAX;
}

void sendToESP32(float temp, float ph, float doMgL, bool floatState) {
  // EXACT format expected by ESP32 code
  espSerial.print("TEMP=");  espSerial.println(temp, 2);
  espSerial.print("PH=");    espSerial.println(ph, 2);
  espSerial.print("DO=");    espSerial.println(doMgL, 2);
  espSerial.print("FLOAT="); espSerial.println(floatState ? 1 : 0);
}

void setup() {
  // ESP link
  espSerial.begin(9600);

  Wire.begin();
  pinMode(FLOAT_PIN, INPUT_PULLUP);

  ads.setGain(GAIN_ONE); // +/-4.096V range
  ads.begin();

  lcd.init();
  lcd.backlight();
  lcd.print("Fishpond System");
  delay(1500);
  lcd.clear();

  sensors.begin();
}

void loop() {
  unsigned long now = millis();

  // ---- Read sensors ----
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  bool tempValid = (tempC > -55 && tempC < 125);

  float phV = readVoltageAnalogPH();
  float ph = phSlope * phV + phOffset;
  ph = constrain(ph, 0, 14);

  float doV = readVoltageAnalog(DO_PIN);
  float doMgL = doSlope * doV + doOffset;
  if (doMgL < 0) doMgL = 0;

  bool floatState = readFloatSwitchDebounced();
  bool waterStable = (floatState == HIGH);

  // ---- Send to ESP32 every 3s ----
  if (now - lastSend >= SEND_INTERVAL) {
    sendToESP32(tempC, ph, doMgL, floatState);
    lastSend = now;
  }

  // ---- LCD warnings ----
  bool warning = false;
  String cause = "";

  if (ph < PH_MIN) { warning = true; cause += "pH"; }

  if (doMgL < DO_MIN) {
    if (warning) cause += ", ";
    warning = true;
    cause += "DO";
  }

  if (!tempValid || tempC < TEMP_MIN || tempC > TEMP_MAX) {
    if (warning) cause += ", ";
    warning = true;
    cause += "TEMP";
  }

  // ---- Screen rotation ----
  if (now - lastScreenChange >= SCREEN_TIME) {
    screenIndex = (screenIndex + 1) % 5;
    lastScreenChange = now;
    lcd.clear();
  }

  switch (screenIndex) {
    case 0:
      lcd.setCursor(0, 0);
      lcd.print("FISHPOND STATUS");
      lcd.setCursor(0, 1);
      if (!warning) lcd.print("STABLE         ");
      else {
        String line = "CAUSE: " + cause;
        if (line.length() > 16) line = line.substring(0, 16);
        lcd.print(line);
      }
      break;

    case 1:
      lcd.setCursor(0, 0);
      lcd.print("pH LEVEL");
      lcd.setCursor(0, 1);
      lcd.print("pH: ");
      lcd.print(ph, 2);
      lcd.print("        ");
      break;

    case 2:
      lcd.setCursor(0, 0);
      lcd.print("WATER LEVEL");
      lcd.setCursor(0, 1);
      lcd.print(waterStable ? "STABLE      " : "LOW         ");
      break;

    case 3:
      lcd.setCursor(0, 0);
      lcd.print("TEMPERATURE");
      lcd.setCursor(0, 1);
      if (tempValid) {
        lcd.print(tempC, 1);
        lcd.print((char)223);
        lcd.print("C      ");
      } else {
        lcd.print("ERROR        ");
      }
      break;

    case 4:
      lcd.setCursor(0, 0);
      lcd.print("DISSOLVED O2");
      lcd.setCursor(0, 1);
      lcd.print(doMgL, 2);
      lcd.print(" mg/L    ");
      break;
  }

  delay(200);
}
Write to Thesis Ideas
