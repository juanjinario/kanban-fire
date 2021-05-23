import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ITask } from '../../core/models/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { ITaskDialogResult } from 'src/app/core/models/taskDialogResult.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  $todo: Observable<ITask[]>;
  $inProgress!: Observable<ITask[]>;
  $done!: Observable<ITask[]>;

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private taskService: TaskService
  ) {
    this.getTasks();
  }

  getTasks(): void {
    this.$todo = this.taskService.getTodoTasks();
    this.$inProgress = this.taskService.getInProgressTasks();
    this.$done = this.taskService.getDoneTask();
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  addTask() {
    const dialog = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    });
    dialog.afterClosed().subscribe((result: ITaskDialogResult) => {
      if (result?.task) {
        this.store.collection('todo').add(result.task);
      }
    });
  }

  edit(list: 'done' | 'todo' | 'inProgress', task: ITask) {
    const dialog = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: {
        task: task,
        enableDelete: true
      }
    });
    dialog.afterClosed().subscribe((result: ITaskDialogResult) => {
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }
}
