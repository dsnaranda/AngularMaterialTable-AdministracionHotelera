import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { casa } from '../../entidades/casa';
import { CasaService } from '../../servicios/casa.service';

@Component({
  selector: 'app-agg-edit',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './agg-edit.component.html',
  styleUrl: './agg-edit.component.css'
})
export class AggEditComponent {
  @Input() isOpen = false;
  @Input() selectedCasa: casa | null = null;
  @Output() close = new EventEmitter<void>();

  oCasa = {
    id: 0,
    nombre: '',
    ciudad: '',
    provincia: '',
    foto: [] as string[],
    unidades: 0,      // Debe ser un número
    wifi: false,      // Debe ser booleano
    lavanderia: false, // Debe ser booleano
  }

  public resetCasa() {
    this.oCasa = {
      id: 0,
      nombre: '',
      ciudad: '',
      provincia: '',
      foto: [] as string[],
      unidades: 0,
      wifi: false,
      lavanderia: false,
    }
  }

  constructor(private cservice: CasaService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCasa'] && this.selectedCasa) {
      this.oCasa = {
        ...this.selectedCasa,
      };
    } else if (!this.selectedCasa) {
      this.resetCasa();
    }
  }


  closeModal() {
    this.close.emit();
  }

  onCloseModal() {
    this.closeModal();
  }

  onSubmit() {
    // Convierte los datos según el tipo adecuado, usando la interfaz 'casa'
    const casaData: casa = {
      id: this.oCasa.id,
      nombre: this.oCasa.nombre,
      ciudad: this.oCasa.ciudad,
      provincia: this.oCasa.provincia,
      foto: this.oCasa.foto,
      unidades: Number(this.oCasa.unidades), // Asegúrate de que unidades sea un número
      wifi: this.oCasa.wifi,                // Es un booleano
      lavanderia: this.oCasa.lavanderia     // Es un booleano
    };

    if (this.selectedCasa) {
      // Si ya existe una casa seleccionada, actualiza
      this.cservice.updateCasa(casaData);
    } else {
      // Si no, agrega una nueva casa
      this.cservice.agregarCasa(casaData);
    }

    this.closeModal();  // Cierra el modal después de agregar o actualizar
  }

}