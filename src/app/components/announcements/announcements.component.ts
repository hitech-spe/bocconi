import {Component, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {Observable, combineLatest, map} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {FirestoreService} from '../../services/firestore.service';
import {Announcement} from '../../models/announcement.model';
import {AuthService} from "../../services/auth.service";
import {LoadingService} from "../../services/loading.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormsModule]
})
export class AnnouncementsComponent {
    private authService = inject(AuthService);
    user$ = this.authService.user$;
    private firestoreService = inject(FirestoreService);
    private fb = inject(FormBuilder);
    private loadingService = inject(LoadingService);

    announcements$: Observable<Announcement[]>;
    
    // Filtri e Ordinamento
    searchTerm = signal('');
    sortBy = signal<'date' | 'name' | 'km'>('date');
    sortOrder = signal<'asc' | 'desc'>('desc');
    activeTab = signal<'all' | 'featured'>('all');

    displayAnnouncements$: Observable<Announcement[]>;

    announcementForm: FormGroup;
    isModalOpen = false;
    isSubmitting = false;
    editingAnnouncementId: string | null = null;

    selectedFiles: File[] = [];
    previewUrls: (string | ArrayBuffer)[] = [];
    imagePositions: string[] = [];
    isDragging = false;

    // Dragging state for image position
    draggingIndex: number | null = null;
    startY = 0;
    startX = 0;
    startPercentX = 50;
    startPercentY = 50;
    isEditorOpen = false;
    editingImageIndex: number | null = null;

    constructor() {
        this.loadingService.show();
        this.announcements$ = this.firestoreService.getAnnunci();

        this.displayAnnouncements$ = combineLatest([
            this.announcements$,
            toObservable(this.searchTerm),
            toObservable(this.sortBy),
            toObservable(this.sortOrder),
            toObservable(this.activeTab)
        ]).pipe(
            map(([annunci, term, sort, order, tab]) => {
                let filtered = [...annunci];

                // Filtro per Tab (Home)
                if (tab === 'featured') {
                    filtered = filtered.filter(a => a.featured);
                }

                // Filtro per nome
                if (term) {
                    const t = term.toLowerCase();
                    filtered = filtered.filter(a => a.name.toLowerCase().includes(t));
                }

                // Ordinamento
                filtered.sort((a, b) => {
                    let valA: any;
                    let valB: any;

                    switch (sort) {
                        case 'name':
                            valA = a.name.toLowerCase();
                            valB = b.name.toLowerCase();
                            break;
                        case 'km':
                            valA = a.km ?? 0;
                            valB = b.km ?? 0;
                            break;
                        case 'date':
                        default:
                            valA = new Date(a.createdAt).getTime();
                            valB = new Date(b.createdAt).getTime();
                            break;
                    }

                    if (valA < valB) return order === 'asc' ? -1 : 1;
                    if (valA > valB) return order === 'asc' ? 1 : -1;
                    return 0;
                });

                return filtered;
            })
        );

        this.announcementForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(80)]],
            link: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
            km: [null, [Validators.min(0)]],
            registrationDate: [''],
            fuel: [''],
            transmission: ['manuale'],
            description: ['', [Validators.required]],
        });
        this.loadingService.hide()
    }

    openModal(): void {
        this.editingAnnouncementId = null;
        this.announcementForm.reset({transmission: 'manuale'});
        this.selectedFiles = [];
        this.previewUrls = [];
        this.imagePositions = [];
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
        this.imagePositions = announcement.imagePositions ?? (announcement.imageUrls ? announcement.imageUrls.map(() => 'center') : []);
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.editingAnnouncementId = null;
        this.announcementForm.reset();
        this.selectedFiles = [];
        this.previewUrls = [];
        this.imagePositions = [];
    }

    handleFileSelect(files: FileList): void {
        const filesArray = Array.from(files).slice(0, 3 - this.selectedFiles.length);
        
        filesArray.forEach(file => {
            this.selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    this.previewUrls.push(reader.result);
                    this.imagePositions.push('center');
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
        this.imagePositions.splice(index, 1);
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
            const finalImageUrls: string[] = this.previewUrls.map(p => p.toString());

            const formValue = this.announcementForm.value;

            const announcementData: Omit<Announcement, 'id' | 'createdAt'> = {
                name: formValue.name?.trim(),
                imageUrls: finalImageUrls,
                imagePositions: this.imagePositions,
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
        this.imagePositions = announcement.imagePositions ?? (announcement.imageUrls ? announcement.imageUrls.map(() => 'center') : []);
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

    async onToggleFeatured(announcement: Announcement): Promise<void> {
        if (!announcement.id) return;
        try {
            const newState = !announcement.featured;
            await this.firestoreService.toggleFeatured(announcement.id, newState);
        } catch (error) {
            console.error('Errore durante il cambio stato evidenza:', error);
        }
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchTerm.set(value);
    }

    setSortBy(field: 'date' | 'name' | 'km'): void {
        if (this.sortBy() === field) {
            this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortBy.set(field);
            this.sortOrder.set(field === 'date' ? 'desc' : 'asc');
        }
    }

    setTab(tab: 'all' | 'featured'): void {
        this.activeTab.set(tab);
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

    setImagePosition(index: number, position: string): void {
        this.imagePositions[index] = position;
    }

    openImageEditor(index: number): void {
        this.editingImageIndex = index;
        this.isEditorOpen = true;
    }

    closeImageEditor(): void {
        this.isEditorOpen = false;
        this.editingImageIndex = null;
    }

    onImageDragStart(event: MouseEvent | TouchEvent, index: number): void {
        event.preventDefault();
        this.draggingIndex = index;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.startY = clientY;
        this.startX = clientX;

        const currentPos = this.imagePositions[index] || 'center';
        
        // Parse current position (e.g., "center 30%" or "10% 20%" or "top")
        if (currentPos === 'top') { this.startPercentX = 50; this.startPercentY = 0; }
        else if (currentPos === 'center') { this.startPercentX = 50; this.startPercentY = 50; }
        else if (currentPos === 'bottom') { this.startPercentX = 50; this.startPercentY = 100; }
        else {
            const parts = currentPos.split(' ');
            if (parts.length === 2) {
                // Handle "center 30%"
                if (parts[0] === 'center') this.startPercentX = 50;
                else this.startPercentX = parseInt(parts[0], 10) || 50;
                
                this.startPercentY = parseInt(parts[1], 10) || 50;
            } else {
                this.startPercentX = 50;
                this.startPercentY = 50;
            }
        }

        const moveHandler = (e: MouseEvent | TouchEvent) => this.onImageDragMove(e);
        const endHandler = () => {
            this.draggingIndex = null;
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', endHandler);
        };

        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', endHandler);
        window.addEventListener('touchmove', moveHandler, { passive: false });
        window.addEventListener('touchend', endHandler);
    }

    onImageDragMove(event: MouseEvent | TouchEvent): void {
        if (this.draggingIndex === null) return;

        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        
        const deltaY = clientY - this.startY;
        const deltaX = clientX - this.startX;
        
        // Sensitivity: 1px = 0.4%
        let newPercentY = this.startPercentY + (deltaY * 0.4);
        let newPercentX = this.startPercentX + (deltaX * 0.4);
        
        newPercentY = Math.max(0, Math.min(100, newPercentY));
        newPercentX = Math.max(0, Math.min(100, newPercentX));

        this.imagePositions[this.draggingIndex] = `${Math.round(newPercentX)}% ${Math.round(newPercentY)}%`;
    }
}
