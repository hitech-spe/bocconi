import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {FirestoreService} from '../../services/firestore.service';
import {Announcement} from '../../models/announcement.model';
import {AuthService} from "../../services/auth.service";
import {LoadingService} from "../../services/loading.service";

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class AnnouncementsComponent {
    private authService = inject(AuthService);
    user$ = this.authService.user$;
    private firestoreService = inject(FirestoreService);
    private fb = inject(FormBuilder);
    private loadingService = inject(LoadingService);

    announcements$: Observable<Announcement[]>;
    announcementForm: FormGroup;
    isModalOpen = false;
    isSubmitting = false;
    editingAnnouncementId: string | null = null;

    selectedFile: File | null = null;
    previewUrl: string | ArrayBuffer | null = null;
    isDragging = false;

    constructor() {
        this.announcements$ = this.firestoreService.getAnnunci();
        this.announcementForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(80)]],
            link: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
            price: [null, [Validators.min(0)]],
            description: ['', [Validators.required, Validators.maxLength(240)]],
        });
    }

    openModal(): void {
        this.editingAnnouncementId = null;
        this.announcementForm.reset();
        this.selectedFile = null;
        this.previewUrl = null;
        this.isModalOpen = true;
    }

    openEditModal(announcement: Announcement): void {
        if (!announcement.id) {
            return;
        }

        this.editingAnnouncementId = announcement.id;
        this.announcementForm.patchValue({
            name: announcement.name,
            link: announcement.link ?? '',
            price: announcement.price ?? null,
            description: announcement.description ?? '',
        });
        this.selectedFile = null;
        this.previewUrl = announcement.imageUrl;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.editingAnnouncementId = null;
        this.announcementForm.reset();
        this.selectedFile = null;
        this.previewUrl = null;
    }

    handleFileSelect(file: File): void {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.handleFileSelect(input.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
        if (event.dataTransfer?.files[0]) {
            this.handleFileSelect(event.dataTransfer.files[0]);
        }
    }

    async onSubmit(): Promise<void> {
        if (this.announcementForm.invalid || (!this.isEditing && !this.selectedFile)) {
            this.announcementForm.markAllAsTouched();
            alert(this.isEditing
                ? 'Nome e descrizione sono obbligatori.'
                : 'Nome, descrizione e immagine sono obbligatori.');
            return;
        }
        this.loadingService.show();

        this.isSubmitting = true;

        try {
            const imageUrl = this.selectedFile
                ? await this.firestoreService.uploadImage(this.selectedFile)
                : (this.previewUrl as string);
            const formValue = this.announcementForm.value;

            const announcementData: Omit<Announcement, 'id' | 'createdAt'> = {
                name: formValue.name?.trim(),
                imageUrl: imageUrl,
                link: formValue.link?.trim() || null,
                price: formValue.price ?? null,
                description: formValue.description?.trim(),
            };

            if (this.editingAnnouncementId) {
                await this.firestoreService.updateAnnuncio(this.editingAnnouncementId, announcementData);
            } else {
                await this.firestoreService.saveAnnuncio(announcementData);
            }
            this.closeModal();
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
            alert("Si è verificato un errore durante il salvataggio.");
        } finally {
            this.loadingService.hide();
            this.isSubmitting = false;
        }
    }

    async onDelete(announcement: Announcement): Promise<void> {
        if (!announcement.id) {
            return;
        }

        const confirmed = confirm(`Vuoi davvero eliminare l'annuncio "${announcement.name}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await this.firestoreService.deleteAnnuncio(announcement.id);
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            alert('Si è verificato un errore durante l\'eliminazione.');
        }
    }

    get isEditing(): boolean {
        return !!this.editingAnnouncementId;
    }

    formatDate(value: any): string {
        if (value && typeof value.toDate === 'function') {
            value = value.toDate();
        }
        if (value instanceof Date || typeof value === 'string') {
            return new Date(value).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        }
        return 'Data non valida';
    }
}
