import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { ITask } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private store: AngularFirestore
  ) { }

  getAlltasks(): Observable<[ITask[], ITask[], ITask[]]> {
    return combineLatest([this.getTodoTasks(), this.getInProgressTasks(), this.getDoneTask()]);
  }

  getTodoTasks(): Observable<ITask[]> {
    return this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<ITask[]>;
  }

  getInProgressTasks(): Observable<ITask[]> {
    return this.store.collection('inProgress').valueChanges({ idField: 'id' })  as Observable<ITask[]>;
  }

  getDoneTask(): Observable<ITask[]> {
    return this.store.collection('done').valueChanges({ idField: 'id' })  as Observable<ITask[]>;
  }
}
