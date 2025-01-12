import { Component } from '@angular/core';
import { CasaService } from '../../servicios/casa.service';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, MatCardModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('1s', style({ opacity: 0 })),
      ])
    ])
  ]
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  

  constructor(private http: HttpClient, private router: Router,) {}

  onSubmit(): void {
    this.isLoading = true;
    const body = { correo: this.correo, password: this.password };
  
    setTimeout(() => {
      this.http.post<any>('http://localhost:3000/api/login', body).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response.usuario)); // Puedes almacenar el usuario o el token
          this.router.navigate(['/administracion']);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'Error desconocido al iniciar sesión';
          this.isLoading = false;
          this.checkAndHideError();
        }
      });
    }, 2000); 
  }

  // Método que borra el mensaje de error
  hideError() {
    this.errorMessage = null;
  }

  // Método que revisa si hay un error y lo oculta después de un tiempo
  checkAndHideError(): void {
    if (this.errorMessage) {
      setTimeout(() => {
        this.hideError();
      }, 2000); // Borra el mensaje después de 3 segundos
    }
  }
}