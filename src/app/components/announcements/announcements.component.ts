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

    selectedFiles: File[] = [];
    previewUrls: (string | ArrayBuffer)[] = [];
    previewIdImg: (string | ArrayBuffer)[] = [];
    isDragging = false;

    constructor() {
        this.loadingService.show();
        this.announcements$ = this.firestoreService.getAnnunci();
        this.announcementForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(80)]],
            link: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
            km: [null, [Validators.min(0)]],
            registrationDate: [''],
            fuel: [''],
            transmission: ['manuale'],
            description: ['', [Validators.required, Validators.maxLength(240)]],
        });
        this.loadingService.hide()
    }

    openModal(): void {
        this.editingAnnouncementId = null;
        this.announcementForm.reset({transmission: 'manuale'});
        this.selectedFiles = [];
        this.previewUrls = [];
        this.previewIdImg = [];
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
            km: announcement.km ?? null,
            registrationDate: announcement.registrationDate ?? '',
            fuel: announcement.fuel ?? '',
            transmission: announcement.transmission ?? 'manuale',
            description: announcement.description ?? '',
        });
        this.selectedFiles = [];
        this.previewUrls = announcement.imageUrls ?? [];
        this.previewIdImg = announcement.imagePublicIds ?? [];
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.editingAnnouncementId = null;
        this.announcementForm.reset();
        this.selectedFiles = [];
        this.previewUrls = [];
        this.previewIdImg = [];
    }

    handleFileSelect(files: FileList): void {
        const filesArray = Array.from(files).slice(0, 3 - this.selectedFiles.length);
        
        filesArray.forEach(file => {
            this.selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    this.previewUrls.push(reader.result);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    removeImage(index: number): void {
        if (index < this.selectedFiles.length) {
            this.selectedFiles.splice(index, 1);
        }
        this.previewUrls.splice(index, 1);
        this.previewIdImg.splice(index, 1);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFileSelect(input.files);
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
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            this.handleFileSelect(event.dataTransfer.files);
        }
    }

    async onSubmit(): Promise<void> {
        if (this.announcementForm.invalid || (this.previewUrls.length === 0)) {
            this.announcementForm.markAllAsTouched();
            alert('Nome, descrizione e almeno un\'immagine sono obbligatori.');
            return;
        }
        this.loadingService.show();

        this.isSubmitting = true;

        try {
            
            const finalImageUrls: string[] = [];
            const finalPublicIds: string[] = [];
            
            // Separiamo le immagini esistenti da quelle nuove
            const existingUrls = this.previewUrls.filter(p => typeof p === 'string' && p.startsWith('http')) as string[];
            finalImageUrls.push(...existingUrls);

            if (this.selectedFiles.length > 0) {
                const uploadedUrls = await this.firestoreService.uploadImages(this.selectedFiles);
                for (const response of uploadedUrls) {
                    finalImageUrls.push(response.secure_url);
                    finalPublicIds.push(response.public_id);
                }
            }

            const formValue = this.announcementForm.value;

            const announcementData: Omit<Announcement, 'id' | 'createdAt'> = {
                name: formValue.name?.trim(),
                imageUrls: finalImageUrls,
                imagePublicIds: finalPublicIds,
                link: formValue.link?.trim() || null,
                km: formValue.km ?? null,
                registrationDate: formValue.registrationDate || null,
                fuel: formValue.fuel?.trim() || null,
                transmission: formValue.transmission || 'manuale',
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

    onCopy(announcement: Announcement) {
        this.announcementForm.patchValue({
            name: announcement.name,
            link: announcement.link ?? '',
            km: announcement.km ?? null,
            registrationDate: announcement.registrationDate ?? '',
            fuel: announcement.fuel ?? '',
            transmission: announcement.transmission ?? 'manuale',
            description: announcement.description ?? '',
        });
        this.selectedFiles = [];
        this.previewUrls = announcement.imageUrls ?? [];
        this.previewIdImg = announcement.imagePublicIds ?? [];
        this.isModalOpen = true;
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
            this.loadingService.show();
            await this.firestoreService.deleteAnnuncio(announcement);
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
            alert('Si è verificato un errore durante l\'eliminazione.');
        } finally {
            this.loadingService.hide();
        }
    }

    get isEditing(): boolean {
        return !!this.editingAnnouncementId;
    }

    currentImageIndex: { [key: string]: number } = {};

    prevImage(announcementId: string, total: number): void {
        const current = this.currentImageIndex[announcementId] || 0;
        this.currentImageIndex[announcementId] = (current - 1 + total) % total;
    }

    nextImage(announcementId: string, total: number): void {
        const current = this.currentImageIndex[announcementId] || 0;
        this.currentImageIndex[announcementId] = (current + 1) % total;
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
