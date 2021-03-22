import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InspectionService } from 'src/app/services/create-inspection.service';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-create-inspection',
	templateUrl: './create-inspection.page.html',
	styleUrls: [ './create-inspection.page.scss' ]
})
export class CreateInspectionPage implements OnInit {
	results: object[];

	opost = new Posts();

	get testId() {
		return this.createInspectionForm.get('TestID');
	}
	get insId() {
		return this.createInspectionForm.get('InspectorID');
	}
	get supId() {
		return this.createInspectionForm.get('SupervisorID');
	}
	get assetId() {
		return this.createInspectionForm.get('AssetID');
	}

	public errorMessage = {
		testID: [
			{ type: 'required', message: 'Test ID is required' },
			{ type: 'pattern', message: 'Must be in the form: T000' }
		],
		empID: [
			{ type: 'required', message: 'Employee ID is required' },
			{ type: 'pattern', message: 'Must be in the form: EMP000' }
		],
		assetID: [
			{ type: 'required', message: 'Asset ID is required' },
			{ type: 'pattern', message: 'Must be in the form: A000' }
		]
	};

	createInspectionForm = this.formBuilder.group({
		TestID: [ '', [ Validators.required, Validators.pattern('^T[0-9]{3}') ] ],
		AssetID: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}') ] ],
		InspectorID: [ '', [ Validators.required, Validators.pattern('^EMP[0-9]{3}') ] ],
		SupervisorID: [ '', [ Validators.required, Validators.pattern('^EMP[0-9]{3}') ] ],
		Frequency: [ '' ],
		TestModuleID: [ '', [ Validators.required, Validators.pattern('^TM[0-9]{3}') ] ],
		Priority: [ '' ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private inspectionService: InspectionService,
		//private geolocation: Geolocation,
		private alertCtrl: AlertController
	) {}

	ngOnInit() {}

	onSave() {
		this.opost = this.createInspectionForm.value;

		console.log('Page Saved', this.opost);

		this.inspectionService.post(this.opost).subscribe((data) => {
			console.log('Post method success?: ', data);
			if (data) {
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
				message: val ? 'Test added Sucessfully' : 'Error',
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createInspectionForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}
}

export class Posts {
	TestID: string;
	AssetID: string;
	InspectorID: string;
	SupervisorID: string;
	Frequency: string;
	TestModuleID: string;
	Priority: string;
}
