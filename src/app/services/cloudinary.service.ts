import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);

  private readonly cloudName = 'dbtwfuplj';
  private readonly uploadPreset = 'ml_default';

  async uploadImage(base64Data: string): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    // TRUCCO MAGICO: Convertiamo la stringa Base64 in un vero file binario (Blob)
    const responseBlob = await fetch(base64Data);
    const blob = await responseBlob.blob();

    const formData = new FormData();
    // È buona pratica aggiungere prima l'upload_preset
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'announcements');
    formData.append('file', blob, 'immagine.jpg');

    try {
      const response: any = await firstValueFrom(this.http.post(url, formData));
      return response.secure_url;
    } catch (error) {
      console.error('Errore durante l\'upload su Cloudinary:', error);
      throw error;
    }
  }
}
