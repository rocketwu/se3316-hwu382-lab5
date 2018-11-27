import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AboutComponent, AppComponent} from './app.component';
import { SignupComponent } from './signup/signup.component';
import {HttpClientModule} from '@angular/common/http';
import { TestComponent } from './test/test.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule, MatExpansionModule,
  MatInputModule,
  MatListModule, MatSelectModule, MatSliderModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { LoginComponent } from './login/login.component';
import {ToastrModule} from 'ngx-toastr';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { ShelfComponent } from './shelf/shelf.component';
import {ItemComponent, SingleItemDialogComponent} from './item/item.component';
import { CommentComponent } from './comment/comment.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import 'hammerjs';
import { UserCartComponent } from './user-cart/user-cart.component';
import { SingleCartItemComponent } from './single-cart-item/single-cart-item.component';
import { UserListComponent } from './user-list/user-list.component';
import { SingleListComponent } from './single-list/single-list.component';

const appRoutes: Routes = [
{ path: 'verify/:id', redirectTo: 'http://localhost:9000/verify/asdf'}
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    TestComponent,
    LoginComponent,
    EmailVerifyComponent,
    ShelfComponent,
    ItemComponent,
    SingleItemDialogComponent,
    CommentComponent,
    AddCommentComponent,
    AboutComponent,
    UserCartComponent,
    SingleCartItemComponent,
    UserListComponent,
    SingleListComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    MatSliderModule,
    MatExpansionModule,
    MatTableModule,
    MatSelectModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SingleItemDialogComponent,
    AddCommentComponent,
    AboutComponent,
    UserCartComponent,
    UserListComponent,
    SingleListComponent
  ]
})
export class AppModule { }
