#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_ADS1X15.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// PINS
#define ONE_WIRE_BUS 2
#define FLOAT_PIN 3

// OBJECTS
LiquidCrystal_I2C lcd(0x27, 16, 2);
Adafruit_ADS1115 ads;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// TIMING
unsigned long lastSend = 0;
unsigned long lastLCD = 0;
const unsigned long sendInterval = 2000;
const unsigned long lcdInterval = 3000;
bool lcdToggle = false;
int lcdScreen = 0;  // 0, 1, or 2 for three screens

// STORAGE
float tempC = 0.0;
float phValue = 0.0;
float doValue = 0.0;  // Dissolved Oxygen
float doVoltage = 0.0;  // DO sensor voltage
String floatState = "DOWN";

// DO CALIBRATION
const float DO_CALIB_VOLT = 1.14;  // Calibrated voltage at saturation

void setup() {
  Serial.begin(9600);   // UART to ESP32
  delay(1000);          // wait for ESP32 boot
  
  pinMode(FLOAT_PIN, INPUT_PULLUP);
  Wire.begin();
  
  lcd.init();
  lcd.backlight();
  lcd.clear();
  
  ads.begin();
  tempSensor.begin();
  
  lcd.setCursor(0,0);
  lcd.print("System Starting");
  delay(1500);
  lcd.clear();
}

void loop() {
  unsigned long now = millis();
  
  // READ & SEND DATA
  if (now - lastSend >= sendInterval) {
    lastSend = now;
    
    // TEMP
    tempSensor.requestTemperatures();
    tempC = tempSensor.getTempCByIndex(0);
    
    // PH (ADS A0)
    int16_t rawPH = ads.readADC_SingleEnded(0);
    float voltagePH = rawPH * 0.1875 / 1000.0;
    phValue = 3.5 * voltagePH; // calibrate later
    
    // DO (ADS A1)
    int16_t rawDO = ads.readADC_SingleEnded(1);
    doVoltage = rawDO * 0.1875 / 1000.0;
    // Calculate DO using calibrated voltage (assuming 100% sat = 8.0 mg/L at 25°C)
    doValue = (doVoltage / DO_CALIB_VOLT) * 8.0;
    
    // FLOAT
    int fs = digitalRead(FLOAT_PIN);
    floatState = (fs == HIGH) ? "UP" : "DOWN";
    
    // SEND TO ESP32
    Serial.print("TEMP=");
    Serial.println(tempC, 2);
    
    Serial.print("PH=");
    Serial.println(phValue, 2);
    
    Serial.print("DO=");
    Serial.println(doValue, 2);
    
    Serial.print("DO_VOLT=");
    Serial.println(doVoltage, 3);
    
    Serial.print("FLOAT=");
    Serial.println(floatState);
  }
  
  // LCD DISPLAY
  if (now - lastLCD >= lcdInterval) {
    lastLCD = now;
    lcdScreen++;
    if (lcdScreen > 2) lcdScreen = 0;
    lcd.clear();
    
    if (lcdScreen == 0) {
      lcd.setCursor(0,0);
      lcd.print("Temp: ");
      lcd.print(tempC,1);
      lcd.print(" C");
      
      lcd.setCursor(0,1);
      lcd.print("pH: ");
      lcd.print(phValue,2);
    } else if (lcdScreen == 1) {
      lcd.setCursor(0,0);
      lcd.print("DO: ");
      lcd.print(doValue,2);
      lcd.print(" mg/L");
      
      lcd.setCursor(0,1);
      lcd.print("Volt: ");
      lcd.print(doVoltage,3);
      lcd.print(" V");
    } else {
      lcd.setCursor(0,0);
      lcd.print("Water Level");
      
      lcd.setCursor(0,1);
      lcd.print("Float: ");
      lcd.print(floatState);
    }
  }
}