import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { DealerAddPage } from '../dealer-add/dealer-add';

/**
* Generated class for the DealerListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-dealer-list',
  templateUrl: 'dealer-list.html',
})
export class DealerListPage {
  
  dealerData:any =[]
  filter :any = {};
  flag:any='';
  loading:Loading;
  
  constructor(public navCtrl: NavController, public loadingCtrl:LoadingController, public navParams: NavParams, public service:DbserviceProvider, public translate:TranslateService) {
    console.log(service);
    this.getoDealerList('');
    
  }
  
  ionViewDidLoad() {
    this.presentLoading();
  }
  
  
  goAddDealer(){
    this.navCtrl.push(DealerAddPage);
  }
  
  
  getoDealerList(search)
  {
    console.log(search);
    this.filter.search=search;
    this.filter.limit =0;

    this.service.post_rqst({'sales_user_id':this.service.karigar_id, 'filter':this.filter},'app_karigar/sales_dealer_list')
    .subscribe((r)=>
    {
      console.log(r);
      this.loading.dismiss();
      this.dealerData=r['sales_karigar_list'];
      console.log(this.dealerData);
      
      
    });
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

  doRefresh(refresher) 
  {
    this.getoDealerList(''); 
    refresher.complete();
  }
  
  loadData(infiniteScroll)
  {
    console.log(infiniteScroll);
    
    console.log('loading');
    this.filter.limit=this.dealerData.length;
    console.log(this.filter.limit);
    this.service.post_rqst({'sales_user_id':this.service.karigar_id,'filter':this.filter},'app_karigar/sales_dealer_list')
    .subscribe( (r) =>
    {
      console.log(r);
      if(r['sales_karigar_list']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.dealerData=this.dealerData.concat(r['sales_karigar_list']);
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
    });
  }
  
}
