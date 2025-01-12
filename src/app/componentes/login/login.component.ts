import { Component } from '@angular/core';
import { CasaService } from '../../servicios/casa.service';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const body = { correo: this.correo, password: this.password };

    this.http.post<any>('http://localhost:3000/api/login', body).subscribe({
      next: (response) => {
        // Guardar los datos del usuario en localStorage para mantener la sesión activa
        localStorage.setItem('user', JSON.stringify(response.usuario)); // Puedes almacenar el usuario o el token

        // Redirigir a la página de administración
        this.router.navigate(['/administracion']);
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Error desconocido al iniciar sesión';
      }
    });
  }
}