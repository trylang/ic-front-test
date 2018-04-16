import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ark-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public headerTitle: string;
}
