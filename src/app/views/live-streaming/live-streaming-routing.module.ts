import { SharedModule } from './../components/shared.module';
import { LiveStreamingComponent } from './live-streaming/live-streaming.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingComponent,
    data: {
      title: 'Streaming'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class LiveStramingRoutingModule {


}
