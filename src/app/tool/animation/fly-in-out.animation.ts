import { AnimationEntryMetadata } from '@angular/core';
import { trigger, animate, state, style, group, transition } from '@angular/animations';

export const flyInOutAnimation: AnimationEntryMetadata = trigger('flyInOutAnimation', [
  state('in', style({ width: 120, transform: 'translateX(0)', opacity: 1 })),
  transition('void => *', [
    style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
    group([
      animate(
        '0.3s 0.1s ease',
        style({
          transform: 'translateX(0)',
          width: '100%'
        })
      ),
      animate(
        '0.3s ease',
        style({
          opacity: 1
        })
      )
    ])
  ]),

  transition('* => void', [
    group([
      animate(
        '0.2s ease',
        style({
          transform: 'translateY(100%)'
        })
      ),
      animate(
        '0.2s ease-out',
        style({
          opacity: 0
        })
      )
    ])
  ])
]);
