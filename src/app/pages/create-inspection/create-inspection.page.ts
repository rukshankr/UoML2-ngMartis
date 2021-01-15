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

  inspectionPost = new InspectionPosts();

  createInspectionForm = this.formBuilder.group({
    TestID: [""],
    AssetID: [""],
    InspectorID: [""],
    SupervisorID: [""],
    Frequency: [""],
    TestModID: [""],
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
    this.inspectionPost = this.createInspectionForm.value;

    console.log("Page Saved", this.inspectionPost);

     this.inspectionService.post(this.inspectionPost).subscribe((data) => {
      console.log("Post method success?: ", data.reply);
      if(data.reply === "Error"){
        this.showAlert(false);
      }else{
        this.showAlert(true);
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

export class InspectionPosts {
  TestID: string;
  AssetID: string;
  InspectorID: string;
  SupervisorID: string;
  Frequency: string;
  TestModID: string;
  Priority: string;
}