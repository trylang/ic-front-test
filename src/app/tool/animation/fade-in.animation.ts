import { trigger, state, animate, transition, style, query } from '@angular/animations';
import { AnimationEntryMetadata } from '@angular/core';

export const fadeInAnimation: AnimationEntryMetadata = trigger('fadeInAnimation', [
  transition('* <=> *', [
    style({
      opacity: 0
    }),
    animate(
      '.5s ease',
      style({
        opacity: 1
      })
    )
  ])
]);
