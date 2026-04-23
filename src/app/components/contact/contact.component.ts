import { Component } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    TranslateModule,
    FormsModule,
    NgClass
  ],
  standalone: true
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSending = false;
  submitStatus: 'success' | 'error' | null = null;

  onSubmit() {
    if (this.isSending) return;

    this.isSending = true;
    this.submitStatus = null;

    // Sostituisci questi valori con i tuoi di EmailJS
    const serviceID = 'service_dvvpn9b';
    const templateID = 'template_yepteb7';
    const publicKey = 'BeTmkZ_BQMgszAUkE';

    emailjs.send(serviceID, templateID, this.formData, publicKey)
      .then((result: EmailJSResponseStatus) => {
        console.log('Email inviata con successo!', result.text);
        this.submitStatus = 'success';
        this.resetForm();
      }, (error) => {
        console.error('Errore durante l\'invio:', error.text);
        this.submitStatus = 'error';
      })
      .finally(() => {
        this.isSending = false;
      });
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
}
