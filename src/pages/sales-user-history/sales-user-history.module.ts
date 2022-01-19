import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesUserHistoryPage } from './sales-user-history';

@NgModule({
  declarations: [
    SalesUserHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesUserHistoryPage),
  ],
})
export class SalesUserHistoryPageModule {}
