import { Component, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { casa } from '../../entidades/casa';
import { CasaService } from '../../servicios/casa.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AggEditComponent } from '../agg-edit/agg-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AggEditComponent, HttpClientModule],
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Asegura que el sort también se aplique
  }

  constructor(private cservice: CasaService, private changeDetector: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    // Cargar la lista de casas usando Observable y .subscribe()
    this.cservice.getLista().subscribe(
      (data) => {
        this.Lista = data;
        this.cargarLista(); // Llama a cargarLista para asignar los datos a la tabla
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
    localStorage.removeItem('user'); // Si almacenas los datos del usuario en localStorage
    sessionStorage.removeItem('user'); // Si almacenas los datos en sessionStorage

    // También puedes limpiar cualquier otro estado de autenticación en tu aplicación si es necesario

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);  // Aquí puedes redirigir a la página de login
  }
}