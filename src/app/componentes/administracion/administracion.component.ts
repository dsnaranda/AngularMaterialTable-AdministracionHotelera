import { Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { casa } from '../../entidades/casa';
import { CasaService } from '../../servicios/casa.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card'; 
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AggEditComponent } from '../agg-edit/agg-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AggEditComponent, HttpClientModule, MatCardModule, MatProgressBarModule, CommonModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent implements AfterViewInit, OnInit {
  selectedCasa: casa | null = null;
  isOpen: boolean = false;
  Lista: casa[] = [];
  displayedColumnsBase: string[] = ['id', 'nombre', 'ciudad', 'provincia', 'foto', 'unidades', 'wifi', 'lavanderia'];
  displayedColumns: string[] = [...this.displayedColumnsBase, 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  porcentajeWifi: number = 0;
  porcentajeLavanderia: number = 0;
  porcentajeSinWifiLavanderia: number = 0;
  user: any = {}; 


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Asegura que el sort también se aplique
  }

  calcularPorcentajes(): void {
    const totalCasas = this.Lista.length;

    if (totalCasas > 0) {
      const casasConWifi = this.Lista.filter(casa => casa.wifi).length;
      const casasConLavanderia = this.Lista.filter(casa => casa.lavanderia).length;
      const casasSinWifiLavanderia = this.Lista.filter(casa => !casa.wifi && !casa.lavanderia).length;

      this.porcentajeWifi = (casasConWifi / totalCasas) * 100;
      this.porcentajeLavanderia = (casasConLavanderia / totalCasas) * 100;
      this.porcentajeSinWifiLavanderia = (casasSinWifiLavanderia / totalCasas) * 100;
    }
  }
  constructor(private cservice: CasaService, private changeDetector: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);  // Parseamos los datos guardados en localStorage
    }
    // Cargar la lista de casas usando Observable y .subscribe()
    this.cservice.getLista().subscribe(
      (data) => {
        this.Lista = data;
        this.cargarLista(); // Llama a cargarLista para asignar los datos a la tabla
        this.calcularPorcentajes(); // Llama a calcular los porcentajes y total de casas
        console.log('Casas cargadas:', this.Lista);
      },
      (error) => {
        console.error('Error al cargar la lista de casas:', error);
      }
    );
  }

  cargarLista(): void {
    if (this.Lista.length > 0) {
      this.dataSource.data = this.Lista; // Asigna los datos a dataSource para la tabla
      this.changeDetector.detectChanges(); // Fuerza la detección de cambios si es necesario
    }
  }

  eliminarCasa(id: number): void {
    this.cservice.eliminarCasaPorId(id).subscribe(
      () => {
        // Eliminamos la casa de la lista localmente
        this.Lista = this.Lista.filter(casa => casa.id !== id);
        this.cargarLista();
        this.changeDetector.detectChanges(); // Fuerza la detección de cambios si es necesario
      },
      (error) => {
        console.error('Error al eliminar la casa:', error);
      }
    );
  }


  // Método para editar una casa seleccionada
  editCasa(casa: casa): void {
    this.selectedCasa = casa;
    this.isOpen = true;
  }

  // Método para cerrar el modal
  onCloseModal(): void {
    this.isOpen = false;
    this.selectedCasa = null;
    this.cargarLista(); // Recarga la lista de casas después de cerrar el modal
  }


  logout() {
    // Eliminar el token o los datos del usuario almacenados en localStorage o sessionStorage
    localStorage.removeItem('user'); 
    sessionStorage.removeItem('user'); 
    this.router.navigate(['/login']); 
  }
}