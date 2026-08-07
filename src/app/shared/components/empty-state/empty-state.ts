import { Component, computed } from '@angular/core';
import { EMPTY_STATE_CLASSES } from './empty-state.styles';

@Component({
  selector: 'app-empty-state',
  imports: [],
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly classes = computed(() => EMPTY_STATE_CLASSES);
}
