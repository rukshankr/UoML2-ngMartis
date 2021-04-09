import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileSharer} from '@byteowls/capacitor-filesharer';


@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.page.html',
  styleUrls: ['./report-generation.page.scss'],
})
export class ReportGenerationPage implements OnInit {

  constructor(private http: HttpClient ) { }

  ngOnInit() {
  }

  async sendToEmail(){
    console.log('started');
    this.http.get('./assets/ar.pdf', {responseType: 'blob'})
    .subscribe( res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];

        FileSharer.share(
          {
            filename: "test.pdf",
            base64Data,
            contentType: "application/pdf",
          }
        ).then(() => {
          console.log('file sharing success!');
          // do sth
        }).catch(error => {
          console.error("File sharing failed", error.message);
        });
      }
      reader.readAsDataURL(res);
    });
    
  }
}
