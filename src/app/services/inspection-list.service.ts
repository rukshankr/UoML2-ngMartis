import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
		return this.http.get('https://martiswabtec.herokuapp.com/test/getTests');
	}

	async getCoords() {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.latitude = resp.coords.latitude.toString();
			this.longitude = resp.coords.longitude.toString();
		});
		console.log(this.latitude);
		console.log(this.longitude);
	}

	sortInspectionsByDistance(): Observable<any> {
		this.getCoords();
		return this.http.post('https://martiswabtec.herokuapp.com/test/orderByLocationAndInspector', {
			empLatitude: this.latitude,
			empLongitude: this.longitude
		});
	}

	sortByLocationAndInspectorAndEmpID(empID): Observable<any> {
		this.getCoords();
		return this.http.post('https://martiswabtec.herokuapp.com/test/orderByLocationAndInspectorAndEmpID', {
			empLatitude: this.latitude,
			empLongitude: this.longitude,
			empId: empID
		});
	}

	sortInspectionsByPriorityAndEmpID(empID): Observable<any> {
		return this.http.post('https://martiswabtec.herokuapp.com/test/orderByPriorityAndEmpID', {
			empId: empID
		});
	}

	sortInspectionsByPriority(): Observable<any> {
		return this.http.get('https://martiswabtec.herokuapp.com/test/orderByPriority');
	}
}
