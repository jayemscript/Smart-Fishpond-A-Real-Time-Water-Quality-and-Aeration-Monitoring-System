// src/modules/sensors/services/sensor-alert.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { TemperatureData } from './temperature-sensor.service';
import { PhWaterData } from './ph-water-sensor.service';
import { DoData } from './do.service';
import { WaterLevelData } from './water-level-sensor.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SensorType =
  | 'temperature'
  | 'phWater'
  | 'dissolvedOxygen'
  | 'waterLevel';

interface Reading {
  timestamp: Date;
  isAbnormal: boolean;
  value: number | string;
}

interface AlertWindow {
  readings: Reading[];
  lastAlertSentAt: Date | null;
}

// ─── Thresholds ───────────────────────────────────────────────────────────────

export const ALERT_CONFIG: Record<
  SensorType,
  {
    windowMs: number; // sliding window duration
    minAbnormal: number; // min bad readings to trigger alert
    cooldownMs: number; // silence period after alert fires
    recipient: string; // email recipient
  }
> = {
  temperature: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    minAbnormal: 15, // 15 bad readings in window
    cooldownMs: 30 * 60 * 1000, // 30 min cooldown
    recipient: process.env.ALERT_EMAIL_RECIPIENT ?? 'admin@example.com',
  },
  phWater: {
    windowMs: 10 * 60 * 1000,
    minAbnormal: 10,
    cooldownMs: 30 * 60 * 1000,
    recipient: process.env.ALERT_EMAIL_RECIPIENT ?? 'admin@example.com',
  },
  dissolvedOxygen: {
    windowMs: 10 * 60 * 1000,
    minAbnormal: 10,
    cooldownMs: 30 * 60 * 1000,
    recipient: process.env.ALERT_EMAIL_RECIPIENT ?? 'admin@example.com',
  },
  waterLevel: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    minAbnormal: 5, // 5 low readings in window
    cooldownMs: 30 * 60 * 1000,
    recipient: process.env.ALERT_EMAIL_RECIPIENT ?? 'admin@example.com',
  },
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class SensorAlertService {
  private readonly logger = new Logger(SensorAlertService.name);

  // Per-sensor sliding windows
  private readonly windows: Record<SensorType, AlertWindow> = {
    temperature: { readings: [], lastAlertSentAt: null },
    phWater: { readings: [], lastAlertSentAt: null },
    dissolvedOxygen: { readings: [], lastAlertSentAt: null },
    waterLevel: { readings: [], lastAlertSentAt: null },
  };

  constructor(private readonly mailerService: MailerService) {}

  // ─── Public evaluation methods (called from each sensor service) ───────────

  evaluateTemperature(data: TemperatureData): void {
    // Normal range: 10°C – 35°C
    const isAbnormal = data.temperature > 35 || data.temperature < 10;
    this.evaluate(
      'temperature',
      {
        timestamp: data.timestamp,
        isAbnormal,
        value: `${data.temperature}°C`,
      },
      data,
    );
  }

  evaluatePhWater(data: PhWaterData): void {
    // Normal range: 6.0 – 9.0
    const isAbnormal = data.phLevel < 6.0 || data.phLevel > 9.0;
    this.evaluate(
      'phWater',
      {
        timestamp: data.timestamp,
        isAbnormal,
        value: `pH ${data.phLevel}`,
      },
      data,
    );
  }

  evaluateDissolvedOxygen(data: DoData): void {
    // Normal: >= 4 mg/L
    const isAbnormal = data.oxygenLevel < 4;
    this.evaluate(
      'dissolvedOxygen',
      {
        timestamp: data.timestamp,
        isAbnormal,
        value: `${data.oxygenLevel} mg/L`,
      },
      data,
    );
  }

  evaluateWaterLevel(data: WaterLevelData): void {
    const isAbnormal = data.status === 'low';
    this.evaluate(
      'waterLevel',
      {
        timestamp: data.timestamp,
        isAbnormal,
        value: data.status,
      },
      data,
    );
  }

  // ─── Core sliding window algorithm ────────────────────────────────────────

  private evaluate(
    sensorType: SensorType,
    reading: Reading,
    rawData: TemperatureData | PhWaterData | DoData | WaterLevelData,
  ): void {
    const config = ALERT_CONFIG[sensorType];
    const window = this.windows[sensorType];
    const now = new Date();

    // 1. Push new reading
    window.readings.push(reading);

    // 2. Evict readings outside the sliding window
    const cutoff = now.getTime() - config.windowMs;
    window.readings = window.readings.filter(
      (r) => r.timestamp.getTime() >= cutoff,
    );

    // 3. Count abnormal readings
    const abnormalCount = window.readings.filter((r) => r.isAbnormal).length;

    this.logger.debug(
      `[${sensorType}] Window: ${window.readings.length} readings, ${abnormalCount} abnormal`,
    );

    // 4. Check if threshold is breached
    if (abnormalCount < config.minAbnormal) return;

    // 5. Respect cooldown — don't spam alerts
    if (window.lastAlertSentAt) {
      const elapsed = now.getTime() - window.lastAlertSentAt.getTime();
      if (elapsed < config.cooldownMs) {
        this.logger.debug(`[${sensorType}] Alert suppressed (cooldown active)`);
        return;
      }
    }

    // 6. Fire the alert
    window.lastAlertSentAt = now;
    this.sendAlert(
      sensorType,
      abnormalCount,
      window.readings.length,
      rawData,
    ).catch((err) => this.logger.error(`Failed to send alert: ${err.message}`));
  }

  // ─── Email builder ─────────────────────────────────────────────────────────

  private async sendAlert(
    sensorType: SensorType,
    abnormalCount: number,
    windowSize: number,
    latestData: TemperatureData | PhWaterData | DoData | WaterLevelData,
  ): Promise<void> {
    const config = ALERT_CONFIG[sensorType];
    const windowMinutes = config.windowMs / 60000;
    const sensorLabel = this.getSensorLabel(sensorType);
    const details = this.buildAlertDetails(sensorType, latestData);

    const subject = `🚨 [ALERT] ${sensorLabel} Abnormal Reading Detected`;

    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">⚠️ Sensor Alert: ${sensorLabel}</h2>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">
            <strong>${abnormalCount} out of ${windowSize} readings</strong> in the last
            <strong>${windowMinutes} minutes</strong> are outside the normal range.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background: #fee2e2;">
                <th style="text-align:left; padding: 8px 12px; border: 1px solid #fca5a5;">Field</th>
                <th style="text-align:left; padding: 8px 12px; border: 1px solid #fca5a5;">Value</th>
              </tr>
            </thead>
            <tbody>
              ${details}
              <tr>
                <td style="padding: 8px 12px; border: 1px solid #fca5a5;">Alert Time</td>
                <td style="padding: 8px 12px; border: 1px solid #fca5a5;">${new Date().toISOString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; border: 1px solid #fca5a5;">Abnormal Readings</td>
                <td style="padding: 8px 12px; border: 1px solid #fca5a5; color: #dc2626; font-weight: bold;">
                  ${abnormalCount} / ${windowSize}
                </td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">
            This alert was triggered because the abnormal reading count exceeded the configured threshold.
            Check your aquaculture monitoring dashboard for more details.
          </p>
        </div>
      </div>
    `;

    this.logger.warn(
      `🚨 ALERT triggered for [${sensorType}]: ${abnormalCount}/${windowSize} abnormal readings`,
    );

    await this.mailerService.sendEmail({
      recipient: config.recipient,
      subject,
      body,
    });

    this.logger.log(
      `Alert email sent for [${sensorType}] to ${config.recipient}`,
    );
  }

  // ─── Report JSON generation (used by PDF endpoint) ────────────────────────

  generateAlertReport(sensorType: SensorType): AlertReportJson {
    const config = ALERT_CONFIG[sensorType];
    const window = this.windows[sensorType];
    const now = new Date();

    const cutoff = now.getTime() - config.windowMs;
    const activeReadings = window.readings.filter(
      (r) => r.timestamp.getTime() >= cutoff,
    );
    const abnormalReadings = activeReadings.filter((r) => r.isAbnormal);

    return {
      sensorType,
      sensorLabel: this.getSensorLabel(sensorType),
      generatedAt: now.toISOString(),
      windowMinutes: config.windowMs / 60000,
      totalReadingsInWindow: activeReadings.length,
      abnormalReadingsInWindow: abnormalReadings.length,
      thresholdToAlert: config.minAbnormal,
      alertTriggered: abnormalReadings.length >= config.minAbnormal,
      lastAlertSentAt: window.lastAlertSentAt?.toISOString() ?? null,
      cooldownMinutes: config.cooldownMs / 60000,
      readings: activeReadings.map((r) => ({
        timestamp: r.timestamp.toISOString(),
        value: r.value,
        isAbnormal: r.isAbnormal,
      })),
    };
  }

  generateFullReport(): FullAlertReportJson {
    const sensors: SensorType[] = [
      'temperature',
      'phWater',
      'dissolvedOxygen',
      'waterLevel',
    ];

    return {
      reportTitle: 'PondWatch Sensor Alert Report',
      generatedAt: new Date().toISOString(),
      sensors: sensors.map((s) => this.generateAlertReport(s)),
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private getSensorLabel(type: SensorType): string {
    const labels: Record<SensorType, string> = {
      temperature: 'Temperature Sensor',
      phWater: 'pH Water Sensor',
      dissolvedOxygen: 'Dissolved Oxygen Sensor',
      waterLevel: 'Water Level Sensor',
    };
    return labels[type];
  }

  private buildAlertDetails(
    type: SensorType,
    data: TemperatureData | PhWaterData | DoData | WaterLevelData,
  ): string {
    const row = (label: string, value: string) =>
      `<tr>
        <td style="padding: 8px 12px; border: 1px solid #fca5a5;">${label}</td>
        <td style="padding: 8px 12px; border: 1px solid #fca5a5;">${value}</td>
      </tr>`;

    switch (type) {
      case 'temperature': {
        const d = data as TemperatureData;
        return (
          row('Sensor ID', d.sensorId) +
          row('Latest Temperature', `${d.temperature}°${d.unit}`) +
          row('Normal Range', '10°C – 35°C')
        );
      }
      case 'phWater': {
        const d = data as PhWaterData;
        return (
          row('Sensor ID', d.sensorId) +
          row('Latest pH Level', String(d.phLevel)) +
          row('Status', d.status) +
          row('Normal Range', '6.0 – 9.0')
        );
      }
      case 'dissolvedOxygen': {
        const d = data as DoData;
        return (
          row('Sensor ID', d.sensorId) +
          row('Latest DO Level', `${d.oxygenLevel} ${d.unit}`) +
          row('Normal Range', '≥ 4 mg/L')
        );
      }
      case 'waterLevel': {
        const d = data as WaterLevelData;
        return (
          row('Sensor ID', d.sensorId) +
          row('Level Value', String(d.level)) +
          row('Status', d.status)
        );
      }
    }
  }
}

// ─── Report JSON types (for client-side PDF generation) ───────────────────────

export interface AlertReportJson {
  sensorType: SensorType;
  sensorLabel: string;
  generatedAt: string;
  windowMinutes: number;
  totalReadingsInWindow: number;
  abnormalReadingsInWindow: number;
  thresholdToAlert: number;
  alertTriggered: boolean;
  lastAlertSentAt: string | null;
  cooldownMinutes: number;
  readings: {
    timestamp: string;
    value: number | string;
    isAbnormal: boolean;
  }[];
}

export interface FullAlertReportJson {
  reportTitle: string;
  generatedAt: string;
  sensors: AlertReportJson[];
}
