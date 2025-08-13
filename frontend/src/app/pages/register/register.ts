import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  hidePassword = signal(true);
  hidePassword2 = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: this.passwordsMatch }
  );

  get username() {
    return this.form.controls.username;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm_password() {
    return this.form.controls.confirm_password;
  }

  passwordsMatch(group: any) {
    const p = group.get('password')?.value;
    const c = group.get('confirm_password')?.value;
    return p === c ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const { username, password, confirm_password } = this.form.getRawValue();
    this.auth
      .register({ username, password, confirm_password, role: 'user' })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Registration failed. Please try again.'
          );
          this.isSubmitting.set(false);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
