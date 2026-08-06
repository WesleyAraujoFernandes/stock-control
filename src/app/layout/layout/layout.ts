import { Component, signal } from '@angular/core';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Main } from "../main/main";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, Sidebar, Main, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly sidebarExpanded = signal(true);

  toggleSidebar(): void {
    this.sidebarExpanded.update(value => !value);
  }
}
