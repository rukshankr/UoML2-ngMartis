import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class inspectionListService {
	constructor(private httpclient: HttpClient) {}

	getinspections(): Observable<any> {
		return this.httpclient.get('http://localhost:3000/test/getTests');
	}
}
