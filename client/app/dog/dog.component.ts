import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Dog } from '../shared/models/dog.model';
import { DogService } from '../services/dog.service';
import { Routine } from '../shared/models/routine.model';
import { RoutineService } from '../services/routine.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';

import * as $ from 'jquery';
import 'fullcalendar';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.component.html',
  styleUrls: ['./dog.component.css']
})

export class DogComponent implements OnInit {

  isLoading = true;
  editing = false;
  viewingEvents = false;
  date: Date = new Date();
  dog = new Dog();
  dogs: Dog[] = [];
  routines: Routine[] = [];

  addDogForm: FormGroup;
  addRoutineForm: FormGroup;

  currentUser = this.auth.currentUser.username;
  user = new FormControl(this.auth.currentUser.username);
  name = new FormControl('', Validators.required);
  breed = new FormControl('', Validators.required);
  birthday = new FormControl('', Validators.required);

  time = new FormControl('',Validators.required);
  action = new FormControl('',Validators.required);
  notes = new FormControl('');


  constructor(private dogService: DogService,
              private routineService: RoutineService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              public auth: AuthService) { }

  ngOnInit() {
    this.editing = false;
    this.viewingEvents = false;
    this.getDogs();
    this.resetDogForm();
    this.resetRoutineForm();
  }

  getDogs() {
    this.dogService.getDogs(this.currentUser).subscribe(
      data => {
          this.dogs = data;
          console.log(data);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getAge(dog: Dog) {
    var age = Math.floor((Math.abs(Date.now() - Date.parse(dog.birthday)) / (1000 * 3600 * 24))/30);
    return age;
  }

  resetDogForm(){
    this.user = new FormControl(this.auth.currentUser.username);

    this.addDogForm = this.formBuilder.group({
      user: this.auth.currentUser.username,
      name: this.name,
      breed: this.breed,
      birthday: this.birthday
    });

  }

  addDog() {
    this.dogService.addDog(this.addDogForm.value).subscribe(
      res => {
        this.dogs.push(res);
        this.resetDogForm();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
    console.log(this.addDogForm.value);
    this.getDogs();
  }


  enableEditing(dog: Dog) {
    this.editing = true;
    this.dog = dog;
  }

  cancelEditing() {
    this.editing = false;
    this.dog = new Dog();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the dogs to reset the editing
    this.ngOnInit();
  }

  editDog(dog: Dog) {
    this.dogService.editDog(dog).subscribe(
      () => {
        this.editing = true;
        this.dog = dog;
        this.editing = false;
        this.ngOnInit();
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteDog(dog: Dog) {
    if (window.confirm('Are you sure you want to remove this dog from the app?')) {
      this.dogService.deleteDog(dog).subscribe(
        () => {
          const pos = this.dogs.map(elem => elem._id).indexOf(dog._id);
          this.dogs.splice(pos, 1);
          this.toast.setMessage('item removed successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  resetRoutineForm(){
    this.time = new FormControl('',Validators.required);
    this.action = new FormControl('',Validators.required);
    this.notes = new FormControl('');

    this.addRoutineForm = this.formBuilder.group({
      dog: this.dog._id,
      time: this.time,
      action: this.action,
      notes: this.notes
    });
  }

  getRoutines(dog: Dog) {
    this.dog = dog;
    this.routineService.getRoutines(dog._id).subscribe(
      data => {
          this.routines = data;
          console.log(data);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addRoutine() {
    this.routineService.addRoutine(this.addRoutineForm.value).subscribe(
      res => {
        this.routines.push(res);
        this.resetRoutineForm();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
    console.log(this.addRoutineForm.value);
    this.getDogs();
  }

  enableViewing(dog: Dog){
    this.viewingEvents = true;
    this.dog = dog;
    this.getRoutines(dog);
    this.resetRoutineForm();
  }

  disableViewing(){
    this.viewingEvents = false;
    this.dog = new Dog();
    this.toast.setMessage('Calendar closed.', "success")
    this.ngOnInit();
  }


}
