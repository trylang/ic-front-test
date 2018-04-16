import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../../tool/animation';

@Component({
  templateUrl: './researcher.component.html',
  animations: [fadeInAnimation]
})
export class ResearcherComponent {
  @HostBinding('@fadeInAnimation') public fadeInAnimation = true;

  public prepRouteState(outlet: any) {
    return outlet.activatedRouteData['animation'];
  }

}
