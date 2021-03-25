import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RepairListService {
	constructor(private httpclient: HttpClient) {}

	getrepairs(): Observable<any> {
		return this.httpclient.get('http://localhost:3000/repair/getRepairs');
	}
}
