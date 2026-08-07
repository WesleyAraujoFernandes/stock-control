import { Component, computed } from '@angular/core';
import { PAGE_CLASSES } from './page.style';

@Component({
  selector: 'app-page',
  imports: [],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  readonly classes = computed(() => PAGE_CLASSES);
}
