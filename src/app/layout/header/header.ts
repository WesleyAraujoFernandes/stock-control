import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly toggleSidebar = output<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
