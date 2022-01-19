import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerAddPage } from './dealer-add';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    DealerAddPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerAddPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class DealerAddPageModule {}
