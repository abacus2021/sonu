import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MechanicListPage } from './mechanic-list';

@NgModule({
  declarations: [
    MechanicListPage,
  ],
  imports: [
    IonicPageModule.forChild(MechanicListPage),
  ],
})
export class MechanicListPageModule {}
