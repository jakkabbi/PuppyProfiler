import { Component, OnInit } from '@angular/core';

import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  user: User;
  users: User[] = [];
  isLoading = true;
  editing = false;

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  enableEditing(user: User) {
    this.editing = true;
    this.user = user;
  }

  cancelEditing() {
    this.editing = false;
    this.user = new User();
    this.toast.setMessage('user editing cancelled.', 'warning');
    // reload the users to reset the editing
    this.ngOnInit();
  }

  editUser(user: User) {
    this.userService.editUser(user).subscribe(
      () => {
        this.editing = true;
        this.user = user;
        this.toast.setMessage('user edited successfully.', 'success');
        this.editing = false;
        this.user = new User();
        this.ngOnInit();
      },
      error => console.log(error)
    );
  }

  deleteUser(user: User) {
    if (window.confirm('Are you sure you want to delete ' + user.username + '?')) {
      this.userService.deleteUser(user).subscribe(
        data => this.toast.setMessage('user deleted successfully.', 'success'),
        error => console.log(error),
        () => this.getUsers()
      );
    }
  }

}
