import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../../tool/animation';

@Component({
  templateUrl: './admin.component.html',
  animations: [fadeInAnimation]
})
export class AdminComponent {
  @HostBinding('@fadeInAnimation') public fadeInAnimation = true;

  public prepRouteState(outlet: any) {
    return outlet.activatedRouteData['animation'];
  }

}

