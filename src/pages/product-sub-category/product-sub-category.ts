import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
* Generated class for the ProductSubCategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-product-sub-category',
  templateUrl: 'product-sub-category.html',
})
export class ProductSubCategoryPage {
  cat_id:any='';
  cat_name:any='';
  prod_detail:any={};
  filter :any = {};
  flag:any='';
  assign_prod:any=[];
  prod_detail_image:any={};
  loading:Loading;
  lang:any='';
  tokenInfo:any={};
  uploadUrl:any="";
  subcat_list:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public con:ConstantProvider, public service:DbserviceProvider, public translate:TranslateService,  public loadingCtrl:LoadingController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductSubCategoryPage');
    
    console.log('ionViewDidLoad ProductSubdetailPage');
    console.log(this.navParams);
    this.cat_id = this.navParams.get('id');
    this.cat_name = this.navParams.get('name');
    console.log(this.cat_id);
    this.uploadUrl = this.con.upload_url;
    this.getProductSubCategory();
    this.presentLoading();
  }
  
  
  
  getProductSubCategory()
  {
    console.log('catagorylist');
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter, 'id':this.cat_id },'app_master/subCategoryList')
    .subscribe( (r) =>
    {
      console.log(r['categories']);
      this.loading.dismiss();
      this.subcat_list=r['categories'];
    });
  }
  
  loadData(infiniteScroll)
  {
    console.log(infiniteScroll);
    
    console.log('loading');
    this.filter.limit=this.subcat_list.length;
    console.log(this.filter.limit);
    this.service.post_rqst({'filter' : this.filter, 'id':this.cat_id },'app_master/subCategoryList')
    .subscribe( (r) =>
    {
      console.log(r);
      if(r['categories']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.subcat_list=this.subcat_list.concat(r['categories']);
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
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
  
  goOnProductDetailPage(id){
    this.navCtrl.push(ProductDetailPage,{'id':id})
  }
  
}
