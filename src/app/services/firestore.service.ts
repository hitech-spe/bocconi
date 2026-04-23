import {inject, Injectable} from '@angular/core';
import {Firestore, collection, addDoc, collectionData, doc, setDoc, getDoc, query, where} from '@angular/fire/firestore';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  private firestore = inject(Firestore);

  saveUser(uid: string, data: any) {
    const ref = doc(this.firestore, 'users', uid);
    return setDoc(ref, data);
  }

  getUser(uid: string) {
    const ref = doc(this.firestore, 'users', uid);
    return getDoc(ref);
  }

  getUsers(): Observable<any[]> {
    const ref = collection(this.firestore, 'users');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }

  saveAnnuncio(annuncio: any) {
    const ref = collection(this.firestore, 'annunci');
    return addDoc(ref, {
      ...annuncio,
      createdAt: new Date().toISOString()
    });
  }

  getAnnunci(): Observable<any[]> {
    const ref = collection(this.firestore, 'annunci');
    return collectionData(query(ref), { idField: 'id' }) as Observable<any[]>;
  }


}
