import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the SalesUserHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sales-user-history',
  templateUrl: 'sales-user-history.html',
})
export class SalesUserHistoryPage {

  echanicData:any =[]
  filter :any = {};
  flag:any='';
  loading:Loading;
data:any =[]


  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    this.getoMechanicList('');

  }

  ionViewDidLoad() {
    this.presentLoading();
  }

  presentLoading() 
  {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
          this.loading = this.loadingCtrl.create({
              content: resp,
              dismissOnPageChange: false
          });
          this.loading.present();
      })
  }


  getoMechanicList(search)
  {
    console.log(search);
    this.filter.search=search;
    this.filter.limit =0;

    this.service.post_rqst({'sales_user_id':this.service.karigar_id, 'filter':this.filter},'app_karigar/sales_user_wallet_history')
    .subscribe((r)=>
    {
      console.log(r);
      this.data =r.dealer_list;
      console.log(this.data);
      
      this.loading.dismiss();
    });
  }

}
