import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentMessage: string;

  items: Observable<any[]>;
  authState: firebase.User;

  constructor(private firestore: AngularFirestore, private fireAuth: AngularFireAuth) {
    this.items = firestore.collection('items').valueChanges().pipe(
      map(messages => messages.sort((a, b) => (a as any).timestamp - (b as any).timestamp))
    );
    fireAuth.authState.subscribe( authState => {
      this.authState = authState;
    });
  }
  // tslint:disable-next-line:typedef
  public async sendMessage() {
    if (!this.currentMessage || this.currentMessage === '') {
      return;
    }
    const msg = this.currentMessage;
    this.currentMessage = '';
    await this.firestore.collection('items').add({message: msg, timestamp: new Date()});
  }


  public login(): void {
    const user = new auth.GoogleAuthProvider();
    this.fireAuth.signInWithPopup(user);
  }

  public logout(): void {
    this.fireAuth.signOut();
  }

  public test(): void {
    console.log(this.authState.email);
  }
}
