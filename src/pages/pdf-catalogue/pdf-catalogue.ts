import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import {DocumentViewer } from '@ionic-native/document-viewer';

/**
 * Generated class for the PdfCataloguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//  declare var DocumentViewer: any;
declare var DocumentViewer: any;

@IonicPage()
@Component({
  selector: 'page-pdf-catalogue',
  templateUrl: 'pdf-catalogue.html',
})
export class PdfCataloguePage {
   pdf_name:any;
   uploadUrl:any =''
   loading:Loading

  constructor(public navCtrl: NavController, public translate:TranslateService, public navParams: NavParams, public service:DbserviceProvider,public con:ConstantProvider, public loadingCtrl:LoadingController) {
    this.uploadUrl = con.pdf_url;
    this.presentLoading();
    this.pdfList();
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdfCataloguePage');
  }


  pdfList(){
    this.service.get_rqst('app_karigar/get_app_pdf')
    .subscribe( (r) =>
    {
        console.log(r);
        this.pdf_name = r.pdf;
        this.loading.dismiss();
    });
  }


    
  presentLoading() 
  {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
          this.loading = this.loadingCtrl.create({
              content: "",
              dismissOnPageChange: false
          });
          this.loading.present();
      })
  }


  // openCatelogue()
  // {
  //   this.service.get_rqst('app_karigar/get_app_pdf')
  //   .subscribe((r)=>
  //   {
  //       console.log(r);
  //        this.pdf_name = r.pdf
  //        console.log(this.pdf_name);
         
       
  //   });
  //   var upload_url=  this.con.pdf_url + this.pdf_name
  //   console.log(upload_url);
    
  //   DocumentViewer.previewFileFromUrlOrPath(
  //     function () {
  //       console.log('success');
  //     }, function (error) 
  //     {
  //       if (error == 53) 
  //       {
  //         console.log('No app that handles this file type.');
  //       }else if (error == 2)
  //       {
  //         console.log('Invalid link');
  //       }
  //     },
  //     upload_url ,'dummy', 'application/pdf');
  //   }

    // openCatelogue()
    // {


    //   var upload_url=  this.con.pdf_url + 'dummy.pdf'
    //   console.log(upload_url);
      
    //   DocumentViewer.previewFileFromUrlOrPath(
    //     function () {
    //       console.log('success');
    //     }, function (error) 
    //     {
    //       if (error == 53) 
    //       {
    //         console.log('No app that handles this file type.');
    //       }else if (error == 2)
    //       {
    //         console.log('Invalid link');
    //       }
    //     },
    //     upload_url ,'dummy', 'application/pdf');
    //   }
    
}
