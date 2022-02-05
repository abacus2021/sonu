import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Loading,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  
  tokenInfo:any={};
  lang:any='';
  loading:Loading;
  profile_data:any='';
  constructor(public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams,private app:App,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
    this. getCompanyprofile()
    this.get_user_lang();
  }

  ionViewDidLeave()
  {
    this.get_user_lang();
    let nav = this.app.getActiveNav();
    if(nav && nav.getActive()) 
    {
      let activeView = nav.getActive().name;
      let previuosView = '';
      if(nav.getPrevious() && nav.getPrevious().name)
      {
        previuosView = nav.getPrevious().name;
      }  
      console.log(previuosView); 
      console.log(activeView);  
      console.log('its leaving');
      if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
      {
        
        console.log(previuosView);
        this.navCtrl.popToRoot();
      }
    }
  }
  
  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      
      this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
      .subscribe(resp=>{
        console.log(resp);
        this.lang = resp['language'];
        if(this.lang == "")
        {
          this.lang = "en";
        }
        this.translate.use(this.lang);
      })
    })
  }
  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }
 
 
  
  getCompanyprofile()
  {
      this.presentLoading();
      
      this.db.post_rqst({},'app_karigar/companyProfile')
      .subscribe( (response)=>
      {
          console.log(response);
          this.loading.dismiss();
          this.profile_data=response.getData;
      })
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
}
