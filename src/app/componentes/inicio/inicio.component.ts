import { Component } from '@angular/core';
import { LocalizacionCasaComponent } from '../localizacion-casa/localizacion-casa.component';
import { CasaService } from '../../servicios/casa.service';
import { casa } from '../../entidades/casa';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, LocalizacionCasaComponent, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  Lista: casa[] = [];
  ListaFiltrada: casa[] = [];
  CiudadFiltrada: string = '';
  noResults: boolean = false;
  errorMessage: string = '';  // Mensaje de error

  constructor(private cservice: CasaService) { }

  ngOnInit(): void {
    this.cservice.getLista().subscribe(
      (data) => {
        this.Lista = data;
        this.ListaFiltrada = [...data]; 
      },
      (error) => {
        console.error('Error al cargar las casas:', error);
        this.errorMessage = 'Error al cargar la lista de casas. Intenta nuevamente.';
      }
    );
  }


  filtradoCiudad(): void {
    if (this.CiudadFiltrada.trim() === '') {
      this.ListaFiltrada = this.Lista;
      this.noResults = false;
    } else {
      this.ListaFiltrada = this.Lista.filter(casa =>
        casa.ciudad.toLowerCase().includes(this.CiudadFiltrada.toLowerCase())
      );
      this.noResults = this.ListaFiltrada.length === 0;
    }
  }
}