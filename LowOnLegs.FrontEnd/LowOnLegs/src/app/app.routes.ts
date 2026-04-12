import { Routes } from '@angular/router';
import { SingleScoreboardComponent } from './scoreboard/single/single-scoreboard..component';
import { HomeComponent } from './home/home.component';
import { DoubleScoreboardComponent } from './scoreboard/double/double-scoreboard.component';
import { OverallStatsComponent } from './stats/overall-stats/overall-stats.component';

export const routes: Routes = [

            { path: '', component: SingleScoreboardComponent }, // Domyślny komponent (strona główna)
            { path: 'single', component: SingleScoreboardComponent }, // Ścieżka do scoreboard
            { path: 'double', component: DoubleScoreboardComponent }, // Ścieżka do scoreboard
            { path: 'stats', component: OverallStatsComponent }, // Ścieżka do scoreboard
            { path: '**', redirectTo: '', pathMatch: 'full' } // Obsługa nieznanych tras
];
