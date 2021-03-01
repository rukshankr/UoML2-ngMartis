import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { SetresultGroundsService } from '../services/setresult-grounds.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-grounds-test',
	templateUrl: './grounds-test.page.html',
	styleUrls: [ './grounds-test.page.scss' ]
})
export class GroundsTestPage implements OnInit {
	opost = new Posts();

	assetid: String;
	testid: String;

	createTestForm = this.formBuilder.group({
		AssetID: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4) ] ],
		TestID: [ '' ],
		comment: [ '' ],
		Result: [ '' ],
		DateCompleted: [ '' ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private setresult: SetresultGroundsService,
		private alertCtrl: AlertController,
		private route: ActivatedRoute
	) {}

	get assetID() {
		return this.createTestForm.get('AssetID');
	}
	get testID() {
		return this.createTestForm.get('TestID');
	}
	get comment() {
		return this.createTestForm.get('comment');
	}
	get result() {
		return this.createTestForm.get('Result');
	}
	get date() {
		return this.createTestForm.get('DateCompleted');
	}

	ngOnInit() {
		console.log(this.route.snapshot.params.assetid);
		this.assetid = this.route.snapshot.params.assetid;
		this.testid = this.route.snapshot.params.testid;
	}

	onSave() {
		this.opost = this.createTestForm.value;

		console.log('Page Saved', this.opost);

		this.setresult.patch(this.opost).subscribe((data) => {
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
							this.createTestForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}
}

export class Posts {
	AssetID: string;
	TestID: string;
	DataCompleted: string;
	comments: string;
	Result: string;
}
