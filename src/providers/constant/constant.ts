import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConstantProvider {

  constructor(public http: Http) {
    console.log('Hello ConstantProvider Provider');
  }

  // live url
  public rootUrl: string = 'https://apps.abacusdesk.com/Magsol/dd_api/';  
  public server_url: string = this.rootUrl + 'index.php/app/';
  public upload_url: string ='https://apps.abacusdesk.com/Magsol/dd_api/app/uploads/';
  
  public pdf_url: string = this.rootUrl + 'app/uploads/pdf/';

  
  public backButton = 0;

}
