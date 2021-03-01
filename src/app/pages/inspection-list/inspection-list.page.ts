import { Component, OnInit } from '@angular/core';
import { inspectionListService } from 'src/app/services/inspection-list.service';
@Component({
	selector: 'app-inspection-list',
	templateUrl: './inspection-list.page.html',
	styleUrls: [ './inspection-list.page.scss' ]
})
export class InspectionListPage implements OnInit {
	constructor(private _inspectionListService: inspectionListService) {}

	lst: any = [];

	ngOnInit() {
		this._inspectionListService.getinspections().subscribe((data) => {
			this.lst = data;
			this.lst = Array.of(this.lst.data);

			console.log(this.lst);
		});
	}
}
