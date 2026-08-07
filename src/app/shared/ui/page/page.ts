import { Component } from '@angular/core';
import { PageHeader } from "../page-header/page-header";
import { StatCard } from "../../components/stat-card/stat-card";
import { Card } from "../card/card/card";
import { CardHeader } from "../card/card-header/card-header";
import { CardContent } from "../card/card-content/card-content";

@Component({
  selector: 'app-page',
  imports: [PageHeader, StatCard, Card, CardHeader, CardContent],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {

}
