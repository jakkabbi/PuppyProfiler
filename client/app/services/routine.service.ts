import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Routine } from '../shared/models/routine.model';

@Injectable()
export class RoutineService {

  constructor(private http: HttpClient) { }

  getRoutines(dog: String): Observable<Routine[]> {
    return this.http.get<Routine[]>(`/api/routines/${dog}`);
  }

  countRoutines(): Observable<number> {
    return this.http.get<number>('/api/routines/count');
  }

  addRoutine(routine: Routine): Observable<Routine> {
    return this.http.post<Routine>('/api/routine', routine);
  }

  getRoutine(routine: Routine): Observable<Routine> {
    return this.http.get<Routine>(`/api/routine/${routine._id}`);
  }

  editRoutine(routine: Routine): Observable<string> {
    return this.http.put(`/api/routine/${routine._id}`, routine, { responseType: 'text' });
  }

  deleteRoutine(routine: Routine): Observable<string> {
    return this.http.delete(`/api/routine/${routine._id}`, { responseType: 'text' });
  }

}
