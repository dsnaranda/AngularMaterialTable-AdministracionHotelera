import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { casa } from '../../entidades/casa';
import { CasaService } from '../../servicios/casa.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-agg-edit',
  standalone: true,
  imports: [NgIf, FormsModule, HttpClientModule],
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
    unidades: 0,
    wifi: false,
    lavanderia: false,
  };

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
    };
  }

  constructor(private cservice: CasaService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCasa'] && this.selectedCasa) {
      this.oCasa = { ...this.selectedCasa }; // Asigna la casa seleccionada
    } else if (!this.selectedCasa) {
      this.resetCasa();
    }
  }

  closeModal() {
    this.close.emit();
    window.location.reload();  
  }

  onSubmit() {
    // Asegúrate de que oCasa.foto sea un arreglo incluso si solo contiene una URL
    const casaData: casa = {
      id: this.oCasa.id,
      nombre: this.oCasa.nombre,
      ciudad: this.oCasa.ciudad,
      provincia: this.oCasa.provincia,
      foto: Array.isArray(this.oCasa.foto) ? this.oCasa.foto : [this.oCasa.foto],  // Garantiza que foto sea un arreglo
      unidades: Number(this.oCasa.unidades),
      wifi: this.oCasa.wifi,
      lavanderia: this.oCasa.lavanderia,
    };
  
    if (this.selectedCasa) {
      // Si ya existe una casa seleccionada, actualiza
      this.cservice.updateCasa(casaData).subscribe(
        () => {
          this.closeModal();  // Cierra el modal después de actualizar
        },
        (error) => {
          console.error('Error al actualizar la casa:', error);
        }
      );
    } else {
      // Si no, agrega una nueva casa
      this.cservice.agregarCasa(casaData).subscribe(
        () => {
          this.closeModal();  // Cierra el modal después de agregar
        },
        (error) => {
          console.error('Error al agregar la casa:', error);
        }
      );
    }
  }
  
}