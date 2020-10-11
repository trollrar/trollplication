import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentMessage: string;

  items: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.items = firestore.collection('items').valueChanges().pipe(
      map(messages => messages.sort((a, b) => (a as any).timestamp - (b as any).timestamp))
    );
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
}
