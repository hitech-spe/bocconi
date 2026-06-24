import {inject, Injectable} from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    doc,
    setDoc,
    query,
    updateDoc,
    deleteDoc
} from '@angular/fire/firestore';
import {Observable} from "rxjs";
import {Announcement} from "../models/announcement.model";

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {

    private firestore = inject(Firestore);

    saveUser(uid: string, data: any) {
        const ref = doc(this.firestore, 'users', uid);
        return setDoc(ref, data);
    }

    saveAnnuncio(annuncio: any) {
        const ref = collection(this.firestore, 'annunci');
        return addDoc(ref, {
            ...annuncio,
            createdAt: new Date().toISOString()
        });
    }

    updateAnnuncio(id: string, annuncio: Omit<Announcement, 'id' | 'createdAt'>) {
        const announcementRef = doc(this.firestore, 'annunci', id);
        return updateDoc(announcementRef, {
            ...annuncio
        });
    }

    async deleteAnnuncio(announcement: Announcement) {
        try {
            // Cancella il documento da Firestore
            const docRef = doc(this.firestore, `annunci/${announcement.id}`);
            return deleteDoc(docRef);

        } catch (error) {
            console.error("Errore durante la cancellazione dell'annuncio:", error);
            // Gestisci l'errore, magari mostrando un messaggio all'utente
            throw new Error("Non è stato possibile eliminare l'annuncio completamente.");
        }
    }

    getAnnunci(): Observable<Announcement[]> {
        const ref = collection(this.firestore, 'annunci');
        return collectionData(query(ref), {idField: 'id'}) as Observable<Announcement[]>;
    }
}
