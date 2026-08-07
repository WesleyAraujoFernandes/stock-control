import { Component, computed } from '@angular/core';
import { STATS_GRID_CLASSES } from './stats-grid.styles';

@Component({
  selector: 'app-stats-grid',
  imports: [],
  templateUrl: './stats-grid.html',
  styleUrl: './stats-grid.css',
})
export class StatsGrid {
  readonly classes = computed(() => STATS_GRID_CLASSES);
}
