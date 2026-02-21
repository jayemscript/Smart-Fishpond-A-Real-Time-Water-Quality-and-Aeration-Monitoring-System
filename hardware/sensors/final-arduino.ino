#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

Adafruit_ADS1115 ads;
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ===== PIN DEFINITIONS =====
const int FLOAT_PIN     = 2;
const int ONE_WIRE_BUS  = 3;
const int DO_PIN        = A1;
const int PH_CH         = 0;

// ===== TEMPERATURE =====
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// ===== ADS GAIN =====
adsGain_t GAIN = GAIN_ONE;

// ===== pH CALIBRATION =====
float phSlope  = -5.77;
float phOffset = 22.25;

// ===== DO CALIBRATION (UPDATED) =====
// 1.66V in air at ~27°C ≈ 8.1 mg/L
float doSlope  = 4.88;
float doOffset = 0.00;

// ===== Arduino ADC settings =====
const float AREF_V = 5.0;
const int ADC_MAX  = 1023;

// ===== WARNING THRESHOLDS =====
const float DO_MIN   = 4.5;
const float PH_MIN   = 6.5;
const float TEMP_MIN = 25.0;
const float TEMP_MAX = 31.0;

// ===== SCREEN CYCLING =====
const unsigned long SCREEN_TIME = 5000;
unsigned long lastScreenChange = 0;

// ===== ESP32 COMMUNICATION =====
const unsigned long SEND_INTERVAL = 3000;
unsigned long lastSend = 0;

// Screens:
// 0 = STATUS
// 1 = pH
// 2 = FLOAT
// 3 = TEMP
// 4 = DO
int screenIndex = 0;

// ===== FLOAT SWITCH =====
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

// ===== READ pH FROM ADS =====
float readVoltageADS(int channel, int samples = 50) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += ads.readADC_SingleEnded(channel);
    delay(8);
  }
  float avgCounts = sum / (float)samples;
  return ads.computeVolts((int16_t)avgCounts);
}

// ===== READ DO FROM ARDUINO ADC =====
float readVoltageAnalog(int pin, int samples = 50) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
    delay(5);
  }
  float avg = sum / (float)samples;
  return (avg * AREF_V) / ADC_MAX;
}

// ===== SEND DATA TO ESP32 =====
void sendToESP32(float temp, float ph, float doMgL, bool floatState) {
  Serial.print("TEMP=");
  Serial.println(temp, 2);
  
  Serial.print("PH=");
  Serial.println(ph, 2);
  
  Serial.print("DO=");
  Serial.println(doMgL, 2);
  
  Serial.print("FLOAT=");
  Serial.println(floatState ? "HIGH" : "LOW");
}

void setup() {
  Serial.begin(9600);
  Wire.begin();
  pinMode(FLOAT_PIN, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.print("Fishpond System");
  delay(1500);
  lcd.clear();

  if (!ads.begin()) {
    lcd.print("ADS ERROR");
    while (1);
  }
  ads.setGain(GAIN);

  sensors.begin();
}

void loop() {
  unsigned long now = millis();

  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  bool tempValid = (tempC > -55 && tempC < 125);

  float phV = readVoltageADS(PH_CH);
  float ph = phSlope * phV + phOffset;
  ph = constrain(ph, 0, 14);

  float doV = readVoltageAnalog(DO_PIN);
  float doMgL = doSlope * doV + doOffset;
  if (doMgL < 0) doMgL = 0;

  bool floatState = readFloatSwitchDebounced();
  bool waterStable = (floatState == HIGH);

  // ===== SEND TO ESP32 =====
  if (now - lastSend >= SEND_INTERVAL) {
    sendToESP32(tempC, ph, doMgL, floatState);
    lastSend = now;
  }

  // ===== CHECK WARNINGS =====
  bool warning = false;
  String cause = "";

  if (ph < PH_MIN) {
    warning = true;
    cause += "pH";
  }

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

  // ===== SCREEN TIMER =====
  if (now - lastScreenChange >= SCREEN_TIME) {
    screenIndex = (screenIndex + 1) % 5;
    lastScreenChange = now;
    lcd.clear();
  }

  // ===== LCD DISPLAY =====
  switch (screenIndex) {

    case 0: // STATUS
      lcd.setCursor(0, 0);
      lcd.print("FISHPOND STATUS");

      lcd.setCursor(0, 1);
      if (!warning) {
        lcd.print("STABLE         ");
      } else {
        String line = "CAUSE: " + cause;
        if (line.length() > 16)
          line = line.substring(0, 16);
        lcd.print(line);
      }
      break;

    case 1: // pH
      lcd.setCursor(0, 0);
      lcd.print("pH LEVEL");
      lcd.setCursor(0, 1);
      lcd.print("pH: ");
      lcd.print(ph, 2);
      lcd.print("        ");
      break;

    case 2: // FLOAT
      lcd.setCursor(0, 0);
      lcd.print("WATER LEVEL");
      lcd.setCursor(0, 1);
      lcd.print(waterStable ? "STABLE      " : "LOW         ");
      break;

    case 3: // TEMP
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

    case 4: // DO
      lcd.setCursor(0, 0);
      lcd.print("DISSOLVED O2");
      lcd.setCursor(0, 1);
      lcd.print(doMgL, 2);
      lcd.print(" mg/L    ");
      break;
  }

  delay(200);
}