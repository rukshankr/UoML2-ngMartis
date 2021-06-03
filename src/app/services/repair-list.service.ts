import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RepairListService {
  constructor(private http: HttpClient) {}
  getrepairs(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/repair/getRepairs"
    );
  }

  sortRepairsByDistance(latitude, longitude): Observable<any> {
    return this.http.post(
      "https://martisapiversion1.herokuapp.com/repair/orderRepairsByLocation",
      {
        empLatitude: latitude,
        empLongitude: longitude,
      }
    );
  }
}
