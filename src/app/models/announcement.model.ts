export interface Announcement {
  id?: string;
  name: string;
  imageUrls: string[];
  imagePublicIds: string[];
  link?: string;
  km?: number;
  registrationDate?: string;
  fuel?: string;
  transmission?: 'manuale' | 'automatico';
  description?: string;
  createdAt: string;
}
