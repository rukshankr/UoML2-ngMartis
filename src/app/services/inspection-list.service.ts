import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Injectable()
export class inspectionListService {
  latitude;
  longitude;
  constructor(private http: HttpClient, private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude.toString();
      this.longitude = resp.coords.longitude.toString();
    });
  }

  getinspections(): Observable<any> {
    //return this.httpclient.get('https://martisapiversion1.herokuapp.com/test/getTests');
    return this.http.get("http://localhost:3000/test/getTests");
  }

  async getCoords() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude.toString();
      this.longitude = resp.coords.longitude.toString();
    });
  }

  sortInspectionsByDistance(): Observable<any> {
    // console.log(this.longitude);
    // console.log(this.latitude);
    this.getCoords();
    return this.http.post(
      "http://localhost:3000/test//orderByLocationAndInspector",
      {
        empLatitude: this.latitude,
        empLongitude: this.longitude,
        empId: "EMP101",
      }
    );
  }

  sortInspectionsByPriority(): Observable<any> {
    return this.http.get("http://localhost:3000/test/orderByPriority");
  }
}
