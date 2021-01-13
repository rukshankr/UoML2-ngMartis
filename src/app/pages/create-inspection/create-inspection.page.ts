import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { InspectionService } from "src/app/services/create-inspection.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create-inspection',
  templateUrl: './create-inspection.page.html',
  styleUrls: ['./create-inspection.page.scss'],
})
export class CreateInspectionPage implements OnInit {
  results: object[]; 

  opost = new Posts();

  createInspectionForm = this.formBuilder.group({
    TestID: [""],
    AssetID: [""],
    InspectorID: [""],
    SupervisorID: [""],
    Frequency: [""],
    TestModuleID: [""],
    Priority: [""]
  });

  constructor(
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private geolocation: Geolocation,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onSave() {
    this.opost = this.createInspectionForm.value;

    console.log("Page Saved", this.opost);

     this.inspectionService.post(this.opost).subscribe((data) => {
      console.log("Post method success?: ", data);
      if(data){
        this.showAlert(true);
      }else{
        this.showAlert(false);
      }
    });



}

async showAlert(val){
  await this.alertCtrl.create({
    header: "Result",
    message: val ? "Test added Sucessfully": "Error",
    buttons: [{
      text: "OK",
      handler: () =>{
        this.createInspectionForm.reset();
      }
    }]
  }).then(res => res.present())
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