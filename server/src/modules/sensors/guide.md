```typescript
// Real-time: WebSocket broadcast every 3 seconds
// Database: Save every 5 minutes with:
{
  timestamp: Date,
  avgTemp: 28.5,
  minTemp: 27.8,
  maxTemp: 29.1,
  readings: 100,
  alerts: ['high_temp'] // Only if thresholds exceeded
}
```