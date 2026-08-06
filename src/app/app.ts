import { Component, signal } from '@angular/core';
import { Button } from "./shared/ui/button/button/button";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isSaving = false;
  protected readonly title = signal('stock-control');
}
