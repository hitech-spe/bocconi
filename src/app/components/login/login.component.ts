import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { LoadingService } from "../../services/loading.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  email = '';
  password = '';
  firstName = '';
  lastName = '';
  error = '';
  success = '';
  isLoading = false;

  toggleMode() {
    this.error = '';
    this.success = '';
    this.firstName = '';
    this.lastName = '';
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.error = '';
    this.success = '';

    this.isLoading = true;
    this.loadingService.show();

    try {
        await this.authService.login(this.email, this.password);
        await this.router.navigate(['/home']);
    } catch (err: any) {
      console.error(err);
      this.error = err.message || 'AUTH.ERROR_GENERIC';
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
