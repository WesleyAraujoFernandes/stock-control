import { Component } from '@angular/core';
import { PageHeader } from "../../shared/ui/page-header/page-header";
import { PageContent } from "../../shared/ui/page-content/page-content";
import { Page } from "../../shared/ui/page/page";
import { EmptyState } from "../../shared/components/empty-state/empty-state";
import { StatCard } from "../../shared/components/stat-card/stat-card";
import { Card } from "../../shared/ui/card/card/card";
import { CardHeader } from "../../shared/ui/card/card-header/card-header";
import { CardContent } from "../../shared/ui/card/card-content/card-content";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageHeader, PageContent, Page, EmptyState, StatCard, Card, CardHeader, CardContent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
