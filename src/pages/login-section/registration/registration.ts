import { Component, ViewChild,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController, ToastController  } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { TabsPage } from './../../../pages/tabs/tabs';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../home/home';



@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
})
export class RegistrationPage {
    @ViewChild(Content) content: Content;
    data:any={};
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    selectedFile:any=[];
    file_name:any=[];
    karigar_id:any='';
    formData= new FormData();
    myphoto:any;
    profile_data:any='';
    loading:Loading;
    lang:any='';
    today_date:any;
    validateForm: FormGroup;
    distributor_list:any;
    
    constructor(public navCtrl: NavController,  public toastCtrl: ToastController, public navParams: NavParams, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,private transfer: FileTransfer,public modalCtrl: ModalController,private storage:Storage,public translate:TranslateService) {
        
        this.data.user_type=2;
        this.data.mobile_no = this.navParams.get('mobile_no');
        this.data.document_type='Adharcard';
        this.today_date = new Date().toISOString().slice(0,10);
        this.data.profile='';
        this.data.document_image='';
        this.data.visiting_image='';
        this.data.shop_image='';
        this.data.document_image_back='';
        this.data.pan_image='';
        this.getstatelist();
        if(navParams.data.data){
            this.data = navParams.data.data;
            // this.data.distributor_id = {};
            // this.data.distributor_id = navParams.data.data.distributor_id;
            // this.data.distributor_id.company_name = navParams.data.data.company_name;
            this.data.karigar_edit_id = this.data.id;
        }
        console.log(this.data.state);
        
        if (this.data.state) {
            this.getDistrictList(this.data.state);
        }
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    update_succ:any="";
    
    test()
    {
        console.log(this.data);
        
    }
    
    ionViewDidLoad() {
        
        
        
        
        this.lang = this.navParams.get('lang');
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        
        this.translate.get("Camera")
        .subscribe(resp=>{
            this.cam = resp
        });
        
        this.translate.get("Gallery")
        .subscribe(resp=>{
            this.gal = resp
        });
        
        this.translate.get("Cancel")
        .subscribe(resp=>{
            this.cancl = resp
        });
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        });
        
        this.translate.get("Upload File")
        .subscribe(resp=>{
            this.upl_file = resp
        });
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
        this.translate.get("Profile update Successfully")
        .subscribe(resp=>{
            this.update_succ = resp
        });
    }
    
    
    
    
    getstatelist(){
        this.service.get_rqst('app_master/getStates').subscribe( r =>
            {
                console.log(r);
                this.state_list=r['states'];
                
                this.karigar_id=r['id'];
                console.log(this.state_list);
            });
        }
        
        getDistributor(district){
            this.service.post_rqst({'district':district},'app_master/getDistributors')
            .subscribe( (r) =>
            {
                console.log("distributor =====>",r);
                this.distributor_list =r['distributors'];
                console.log(this.distributor_list);
            });
        }
        
        getDistrict(state) {
            console.log(state);
            
            let loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h15" />`,
            });
            
            // this.service.getCity(state).then((response:any)=>{
            //   loading.dismiss();
            //   console.log(response);
            //   this.district_list = response;
            
            // });
            loading.present();
        }
        
        
        
        getDistrictList(state_name)
        {
            console.log("state name is call ==>",state_name);
            this.service.post_rqst({'state_name':state_name},'app_master/getDistrict')
            .subscribe( (r) =>
            {
                console.log(r);
                this.district_list=r['districts'];
                console.log(this.state_list);
            });
        }
        
        getCityList(district_name)
        {
            console.log(district_name);
            this.service.post_rqst({'district_name':district_name},'app_master/getCity')
            .subscribe( (r) =>
            {
                console.log(r);
                this.city_list=r['cities'];
                this.pincode_list=r['pins'];
                console.log(this.pincode_list);
            });
        }
        
        getaddress(pincode)
        {
            if(this.data.pincode.length=='6')
            {
                this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
                .subscribe( (result) =>
                {
                    console.log(result);
                    var address = result.address;
                    if(address!= null)
                    {
                        this.data.state = result.address.state_name;
                        this.getDistrictList(this.data.state)
                        this.data.district = result.address.district_name;
                        this.data.city = result.address.city;
                        console.log(this.data);
                    }
                });
            }
            
        }
        
        
        scrollUp()
        {
            this.content.scrollToTop();
        }  
        
        submit()
        {
            // this.data.distributor_id = this.data.distributor_id.distributor_id;
            console.log( this.data.distributor_id);
            
            console.log(this.data.parent_counter_name);
            // this.data.state =this.data.state.state_name;
            // this.data.district =this.data.district.district_name;
            
            if(!this.data.profile){
                const toast = this.toastCtrl.create({
                    message: 'Profile image required',
                    duration: 3000
                });
                toast.present();
                return
            }
            
            if(!this.data.document_image){
                const toast = this.toastCtrl.create({
                    message: 'Document image required',
                    duration: 3000
                });
                toast.present();
                return
            }
            
            if(this.data.user_type == '2'){
                if(!this.data.pan_image){
                    const toast = this.toastCtrl.create({
                        message: 'Pancard image required',
                        duration: 3000
                    });
                    toast.present();
                    return
                }
            }
            
            if(this.data.dealer_counter_name)
            {
                this.data.dealer_status='Active';
                console.log(this.data.dealer_status);
            }
            else
            {
                this.data.dealer_status='';
            }
            this.data.lang = this.lang;
            console.log(this.data);
            
            this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
            .subscribe( (r) =>
            {
                console.log(r);
                // this.loading.dismiss();
                this.karigar_id=r['id'];
                console.log(this.karigar_id);
                
                if(r['status'] == 'UPDATED')
                {
                    this.navCtrl.push(HomePage);
                    this.showUpdate(this.update_succ+"!");
                }
                
                
                if(r['status']=="SUCCESS")
                {
                    this.showSuccess(this.save_succ+"!");
                    this.service.post_rqst({'mobile_no': this.data.mobile_no ,'mode' :'App'},'auth/login')
                    .subscribe( (r) =>
                    {
                        console.log(r);
                        if(r['status'] == 'NOT FOUND')
                        {
                            return;
                        } 
                        else if(r['status'] == 'ACCOUNT SUSPENDED')
                        {
                            this.translate.get("Your account has been suspended")
                            .subscribe(resp=>{
                                this.showAlert(resp);
                            })
                            return;
                        }
                        else if(r['status'] == 'SUCCESS')
                        {
                            this.storage.set('token',r['token']); 
                            this.service.karigar_id=r['user'].id;
                            this.service.karigar_status=r['user'].status;
                            console.log(this.service.karigar_id);
                            
                            if( r['user'].user_type == 4){
                                this.navCtrl.push(HomePage, {'lang':this.lang});
                                return;
                            }
                            
                            if(r['user'].status !='Verified')
                            {
                                let contactModal = this.modalCtrl.create(AboutusModalPage);
                                contactModal.present();
                                return;
                            }
                        }
                        
                        console.log("before navcontrol homepage");
                        this.navCtrl.push(HomePage);
                    });
                }
                else if(r['status']=="EXIST")
                {
                    this.translate.get("Already Registered")
                    .subscribe(resp=>{
                        this.showAlert(resp+"!");
                    })
                }
            });
        }
        namecheck(event: any) 
        {
            console.log("called");
            
            const pattern = /[A-Z\+\-\a-z ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) 
            {event.preventDefault(); }
        }
        
        caps_add(add:any)
        {
            this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        showSuccess(text)
        {
            this.translate.get("Success")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        showUpdate(text)
        {
            this.translate.get("Update")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        showAlert(text) 
        {
            this.translate.get("Alert")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        openeditprofile()
        {
            let actionsheet = this.actionSheetController.create({
                title:"Profile photo",
                cssClass: 'cs-actionsheet',
                
                buttons:[{
                    cssClass: 'sheet-m',
                    text: this.cam,
                    icon:'camera',
                    handler: () => {
                        console.log("Camera Clicked");
                        this.takePhoto();
                    }
                },
                {
                    cssClass: 'sheet-m1',
                    text: this.gal,
                    icon:'image',
                    handler: () => {
                        console.log("Gallery Clicked");
                        this.getImage();
                    }
                },
                {
                    cssClass: 'cs-cancel',
                    text: this.cancl,
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionsheet.present();
    }
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400,
            cameraDirection: 1,
            correctOrientation: true
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    getImage() 
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    
    flag:boolean=true;  
    
    onUploadChange(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title:this.upl_file,
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: this.cam,
                icon:'camera',
                handler: () => {
                    console.log("Camera Clicked");
                    this.takeDocPhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getDocImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionsheet.present();
}
onUploadChange_back(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                console.log("Camera Clicked");
                this.takeDocPhoto_back();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                console.log("Gallery Clicked");
                this.getDocImage_back();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
onUploadChange_pan(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                console.log("Camera Clicked");
                this.takeDocPhoto_pan();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                console.log("Gallery Clicked");
                this.getDocImage_pan();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
takeDocPhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        // this.data.document_image_back='data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
takeDocPhoto_back()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.document_image_back='data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
takeDocPhoto_pan()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.pan_image='data:image/jpeg;base64,' + imageData;
        console.log(this.data.pan_image);
    }, (err) => {
    });
}
getDocImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        // this.data.document_image_back='data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
getDocImage_back()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        // this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        this.data.document_image_back='data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
getDocImage_pan()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        // this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        this.data.pan_image='data:image/jpeg;base64,' + imageData;
        console.log(this.data.pan_image);
    }, (err) => {
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





onUploadVistingCard(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.vistingCardPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getVistingImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
            }
        }
    ]
});
actionsheet.present();
}
vistingCardPhoto()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.visiting_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}
getVistingImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.visiting_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}

onUploadShop(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.shopPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.shopImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
            }
        }
    ]
});
actionsheet.present();
}
shopPhoto()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.shop_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}
shopImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.shop_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}



}
