export interface DoData {
  sensorId: string;
  oxygenLevel: number;
  timestamp: string;
  status: string;
}

export interface PhData {
  sensorId: string;
  phLevel: number;
  timestamp: string;
  status: string;
}

export interface TempData {
  sensorId: string;
  temperature: number;
  timestamp: string;
  unit: string;
}

export interface WaterLevelData {
  sensorId: string;
  level: number;
  timestamp: string;
  status: string;
}
