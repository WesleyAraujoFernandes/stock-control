import { Component, input } from '@angular/core';
import { Card } from '../../ui/card/card/card';
import { CardHeader } from '../../ui/card/card-header/card-header';
import { CardContent } from '../../ui/card/card-content/card-content';
import { STAT_CARD_VALUE_CLASSES } from './stat-card.types';

@Component({
  selector: 'app-stat-card',
  imports: [Card, CardHeader, CardContent],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly valueClasses = STAT_CARD_VALUE_CLASSES;
}
