import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerListPage } from './dealer-list';

@NgModule({
  declarations: [
    DealerListPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerListPage),
  ],
})
export class DealerListPageModule {}
