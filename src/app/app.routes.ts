import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { LoginComponent } from "./components/login/login.component";
import { authGuard } from "./guards/auth.guard";
import {AnnouncementsComponent} from "./components/announcements/announcements.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/:id', component: ServiceDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'annunci', component: AnnouncementsComponent },
  { path: '**', redirectTo: '/home' }
];
