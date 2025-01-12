import { Component, inject } from '@angular/core';
import { CasaService } from '../../servicios/casa.service';
import { CommonModule } from '@angular/common';
import { casa } from '../../entidades/casa';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  clocalizacion?: casa;
  currentSlide = 0;

  constructor(private cservice: CasaService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    // Nos suscribimos al Observable para obtener la casa con el id
    this.cservice.getCasaId(id).subscribe(
      (data) => {
        this.clocalizacion = data;
        console.log('Casa obtenida:', this.clocalizacion);
      },
      (error) => {
        console.error('Error al obtener la casa:', error);
      }
    );
  }

  prevSlide(): void {
    if (this.clocalizacion && this.clocalizacion.foto.length) {
      this.currentSlide = (this.currentSlide - 1 + this.clocalizacion.foto.length) % this.clocalizacion.foto.length;
    }
  }

  nextSlide(): void {
    if (this.clocalizacion && this.clocalizacion.foto.length) {
      this.currentSlide = (this.currentSlide + 1) % this.clocalizacion.foto.length;
    }
  }
}