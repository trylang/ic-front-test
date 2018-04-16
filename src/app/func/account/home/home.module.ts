import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { NgxCropperModule } from 'ngx-cropper';
import { PaginatorModule } from '../../../tool/paginator';
import { ArkPipeModule } from '../../../tool/pipe';
import { TableModule } from '../../../tool/table/table.module';
// import { LineModule, PieModule, MapModule } from '../../../tool/chart';
import { ChartModule, RelationModule, EntityRelationModule} from '../../../tool/chart';
import { HomeComponent } from './home.component';
import { EditComponent } from './edit/edit.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { NewsComponent } from './news/news.component';
import { HomeService } from './home.service';
import { DataNotFoundModule } from '../../data-not-found';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'edit', component: EditComponent },
  { path: 'analysis',  component: AnalysisComponent},
  { path: 'news', component: NewsComponent}
];

@NgModule({
  declarations: [
    HomeComponent,
    EditComponent,
    SubscribeComponent,
    AnalysisComponent,
    NewsComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCropperModule,
    PaginatorModule,
    ArkPipeModule,
    TableModule,
    ChartModule,
    RelationModule,
    EntityRelationModule,
    DataNotFoundModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [
    HomeService
  ],
  exports: [SubscribeComponent, AnalysisComponent],
  entryComponents: [SubscribeComponent]
})
export class HomeModule {}
