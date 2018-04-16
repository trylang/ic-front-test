import { AnimationEntryMetadata } from '@angular/core';
import { trigger, style, state, animate, query, transition } from '@angular/animations';

export const slideInDownAnimation: AnimationEntryMetadata = trigger('slideInDownAnimation', [
  state(
    '*',
    style({
      opacity: 1,
      transform: 'translateX(0)'
    })
  ),

  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
    animate('0.5s ease-in-out')
  ]),

  transition(':leave', [
    animate(
      '0.5s ease-in-out',
      style({
        opacity: 0,
        transform: 'translateY(100%)'
      })
    )
  ])
]);
