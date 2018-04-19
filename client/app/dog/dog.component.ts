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
  date: Date = new Date();
  dog = new Dog();
  dogs: Dog[] = [];

  addDogForm: FormGroup;
  currentUser = this.auth.currentUser.username;

  user = new FormControl(this.auth.currentUser.username);
  name = new FormControl('', Validators.required);
  breed = new FormControl('', Validators.required);
  birthday = new FormControl('', Validators.required);

  constructor(private dogService: DogService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              public auth: AuthService) { }

  ngOnInit() {
    this.editing = false;
    this.getDogs();
    this.resetDogForm();
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
    if (window.confirm('Are you sure you want to delete this stock from your portfolio?')) {
      this.dogService.deleteDog(dog).subscribe(
        () => {
          const pos = this.dogs.map(elem => elem._id).indexOf(dog._id);
          this.dogs.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
