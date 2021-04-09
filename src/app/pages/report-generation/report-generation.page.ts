import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-report-generation',
	templateUrl: './report-generation.page.html',
	styleUrls: [ './report-generation.page.scss' ]
})
export class ReportGenerationPage implements OnInit {
	opost = new Posts();

	createReportForm = this.formBuilder.group({
		inspectorID: [ '', [ Validators.required, Validators.pattern('^EMP[0-9]{3}'), Validators.maxLength(6) ] ],
		initialDate: [ '' ],
		finalDate: [ '' ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private createReport: CreateReportEmpidService,
		private alertCtrl: AlertController,
		private datePipe: DatePipe
	) {}
	lst: any = [];
	async onSave() {
		this.opost = this.createReportForm.value;

		this.opost.initialDate = this.datePipe
			.transform(this.opost.initialDate, 'yyyy-MM-dd HH:mm:ss', 'utc')
			.toString();
		this.opost.finalDate = this.datePipe.transform(this.opost.finalDate, 'yyyy-MM-dd HH:mm:ss', 'utc').toString();

		console.log('Page Saved', this.opost);

		this.createReport.post(this.opost).subscribe((data) => {
			console.log('Post method success?: ', data);
			if (data) {
				this.lst = data;
				this.lst = Array.of(this.lst.data);
				this.showAlert(true);
			} else {
				this.showAlert(false);
			}
		});
	}
	async showAlert(val) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Report retrieved   Successfully' : 'Error',
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createReportForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}

	ngOnInit() {}
}
export class Posts {
	initialDate: string;
	finalDate: string;
	inspectorID: string;
}
