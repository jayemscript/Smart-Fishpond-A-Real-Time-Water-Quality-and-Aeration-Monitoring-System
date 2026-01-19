# ESP32 Connection Flow (Simplified)

## Step 1: Upload ESP32 Code

Upload the `.ino` file to your ESP32.

**ESP32 will:**

* Connect to WiFi
* Get MAC address as `deviceId`
* Connect to Socket.IO
* Automatically identify to the NestJS server
* No manual authorization required

**Serial Monitor Example:**

```
WiFi connected!
IP Address: 192.168.100.217
Device ID: A1B2C3D4E5F6
ESP32 identified to server
Hello World
Hello World
...
```

---

## Step 2: Verify Connection

Check if the ESP32 is connected to the server:

```http
GET /api/esp-32/verify?deviceId=A1B2C3D4E5F6
```

**Response:**

```json
{
  "success": true,
  "connected": true,
  "deviceId": "A1B2C3D4E5F6"
}
```

---

## Step 3: Get Device Info

Retrieve current device information:

```http
GET /api/esp-32/info?deviceId=A1B2C3D4E5F6
```

**Response:**

```json
{
  "success": true,
  "device": {
    "deviceId": "A1B2C3D4E5F6",
    "socketId": "xyz123",
    "connected": true,
    "lastSeen": "2026-01-07T18:30:00.000Z"
  }
}
```

If no `deviceId` is provided, all connected devices are returned:

```http
GET /api/esp-32/info
```

**Response:**

```json
{
  "success": true,
  "totalDevices": 1,
  "devices": [
    {
      "deviceId": "A1B2C3D4E5F6",
      "socketId": "xyz123",
      "connected": true,
      "lastSeen": "2026-01-07T18:30:00.000Z"
    }
  ]
}
```

---

## Step 4: Test Handshake

Send a handshake message to the ESP32. You can provide any `data` payload.

```http
POST /api/esp-32/test-handshake
Content-Type: application/json

{
  "deviceId": "A1B2C3D4E5F6",
  "data": {
    "message": "Hello from server"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Handshake sent",
  "deviceId": "A1B2C3D4E5F6"
}
```

**ESP32 Serial Example:**

```
Event: ["handshake",{"message":"Hello from server"}]
```

---

## Step 5: Disconnect Device

Disconnect an ESP32 from the server:

```http
POST /api/esp-32/disconnect
Content-Type: application/json

{
  "deviceId": "A1B2C3D4E5F6"
}
```

**Response:**

```json
{
  "success": true,
  "message": "ESP32 disconnected"
}
```

**ESP32 Serial Example:**

```
Device DISCONNECTED by server
```

---

### Notes

* **Automatic identification**: The ESP32 sends its `deviceId` on connect, no manual authorization needed.
* **Persistent handshake**: You can resend handshake data anytime; the server caches the last connected socket for each `deviceId`.
* **Hello World**: The ESP32 prints “Hello World” every 5 seconds in the loop to indicate it’s alive.
* `/verify` endpoint allows quick check if the ESP32 is connected.
