import { Component, computed } from '@angular/core';
import { CARD_BASE_CLASSES } from './card.styles';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly classes = computed(() => CARD_BASE_CLASSES);
}
