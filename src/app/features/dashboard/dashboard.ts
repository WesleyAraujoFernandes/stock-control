import { Component } from '@angular/core';
import { StatCard } from "../../shared/components/stat-card/stat-card";
import { PageHeader } from "../../shared/ui/page-header/page-header";
import { PageContent } from "../../shared/ui/page-content/page-content";
import { Page } from "../../shared/ui/page/page";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCard, PageHeader, PageContent, Page],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
