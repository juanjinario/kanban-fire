import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { TaskComponent } from './components/task/task.component';
import { SharedModule } from '../../shared/shared.module';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';


@NgModule({
  declarations: [
    BoardComponent,
    TaskComponent,
    TaskDialogComponent
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    SharedModule
  ]
})
export class BoardModule { }
