//src/modules/sensors/services/esp32-endpoint.service.ts
import {Injectable, Logger} from '@nestjs/common'


@Injectable()
export class ESP32EndpointService {
    constructor () {}


 /**
  * Connect esp32
  * POST METHOD
  * PARAMS: wifi_name, wifi_password, port, ip_add,
  * this will be an post method that needed an credentials so that the esp32 is dynamically connected to any wifi and
  * to any web server.
  */

 async connectESP32() {}

 /**
  * Disconnect esp32
  * POST method
  * this is a simple disconnections of esp32 to web server
  */

 async disconnectESP32() {}

 /**
  * Get Esp32 Info
  * Get MEthod ??
  * this is an read mode only that maybe an additional endpoint to verify if the esp32 is connected succesfully
  */

 async getESP32Info() {}


 /**
  * Test Handshake
  * POST method
  * this will be an test endpoint if an webserver can send data to esp32
  * and esp32 can send back.
  * 
  */

 async testHandshakeESP32() {}

}