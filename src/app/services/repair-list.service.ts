import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RepairListService {
	constructor(private httpclient: HttpClient) {}

	getrepairs(): Observable<any> {
		return this.httpclient.get('https://martisapiversion1.herokuapp.com/repair/getRepairs');
	}
}
