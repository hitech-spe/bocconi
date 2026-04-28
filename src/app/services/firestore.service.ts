import {inject, Injectable} from '@angular/core';
import {Firestore, collection, addDoc, collectionData, doc, setDoc, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import {Observable, firstValueFrom} from "rxjs";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";

interface CloudinaryUploadResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  private readonly cloudinaryCloudName = 'dbtwfuplj';
  private readonly cloudinaryUploadPreset = 'ml_default';

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

  deleteAnnuncio(id: string) {
    const announcementRef = doc(this.firestore, 'annunci', id);
    return deleteDoc(announcementRef);
  }

  getAnnunci(): Observable<Announcement[]> {
    const ref = collection(this.firestore, 'annunci');
    return collectionData(query(ref), { idField: 'id' }) as Observable<Announcement[]>;
  }

  async uploadImage(file: File): Promise<string> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryUploadPreset);
    formData.append('folder', 'announcements');

    const endpoint = `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/image/upload`;
    const response = await firstValueFrom(
      this.http.post<CloudinaryUploadResponse>(endpoint, formData)
    );

    if (!response?.secure_url) {
      throw new Error('Upload Cloudinary non riuscito: URL immagine non disponibile.');
    }

    return response.secure_url;
  }


}
