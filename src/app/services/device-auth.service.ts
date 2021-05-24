import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DeviceAuthService {
  constructor(private http: HttpClient) {}


  getDevice(DeviceId): Observable<any> {
    return this.http.post(
      //"https://martisapiversion1.herokuapp.com/test/getTests",
      "https://martiswabtec.herokuapp.com/device/getDeviceByID",
      {
        deviceId: DeviceId,
      }
    );
  }

  setPin(DeviceId, DevicePin, UserID): Observable<any> {
    return this.http.post(
      //"https://martisapiversion1.herokuapp.com/test/getTests",
      "https://martiswabtec.herokuapp.com/device/setDevicePinByID",
      {
        deviceId: DeviceId,
        devicePin: DevicePin,
        userId: UserID,
      }
    );
  }

  getUserNameAndRole(EmpID): Observable<any> {
    return this.http.post(
      "https://martiswabtec.herokuapp.com/user/getUserNameAndRole",
      {
        EmpId: EmpID,
      }
    );
  }
}
