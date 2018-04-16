import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../../tool/animation';

@Component({
  templateUrl: './public.component.html',
  animations: [fadeInAnimation]
})
export class PublicComponent {
  @HostBinding('@fadeInAnimation') public fadeInAnimation = true;

  public prepRouteState(outlet: any) {
    return outlet.activatedRouteData['animation'];
  }

}

