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
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';  // Importa el módulo

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AggEditComponent, HttpClientModule, MatCardModule, MatProgressBarModule, CommonModule, HighchartsChartModule],
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

  Highcharts: typeof Highcharts = Highcharts; // Asocia Highcharts a una propiedad
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Mi gráfico de Highcharts'
    },
    series: [{
      type: 'line',
    }]
  };

  Highcharts2: typeof Highcharts = Highcharts; // Asocia Highcharts a una propiedad
  chartOptions2: Highcharts.Options = {
    title: {
      text: 'Mi gráfico de Highcharts'
    },
    series: [{
      type: 'line',
    }]
  };

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
      this.user = JSON.parse(userData); 
    }
    // Cargar la lista de casas usando Observable 
    this.cservice.getLista().subscribe(
      (data) => {
        this.Lista = data;
        this.cargarLista(); 
        this.calcularPorcentajes(); 
        this.actualizarGrafico();
        this.actualizarGraficoCiudades();
        console.log('Casas cargadas:', this.Lista);
      },
      (error) => {
        console.error('Error al cargar la lista de casas:', error);
      }
    );
  }

  cargarLista(): void {
    if (this.Lista.length > 0) {
      this.dataSource.data = this.Lista; 
      this.changeDetector.detectChanges(); 
    }
  }

  eliminarCasa(id: number): void {
    this.cservice.eliminarCasaPorId(id).subscribe(
      () => {
        // Eliminamos la casa de la lista localmente
        this.Lista = this.Lista.filter(casa => casa.id !== id);
        this.cargarLista();
        this.changeDetector.detectChanges();
        window.location.reload();  // Fuerza la detección de cambios si es necesario
      },
      (error) => {
        console.error('Error al eliminar la casa:', error);
      }
    );
  }

  
  actualizarGrafico(): void {
    const provinciaCount = this.Lista.reduce((acc: { [key: string]: number }, casa) => {
      acc[casa.provincia] = (acc[casa.provincia] || 0) + 1;
      return acc;
    }, {});
    const colores = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#8A2BE2', '#FF4500'];
  
    this.chartOptions = {
      chart: {
        type: 'column' 
      },
      title: {
        text: 'Distribución de Casas por Provincia'
      },
      xAxis: {
        categories: Object.keys(provinciaCount), 
        title: {
          text: 'Provincia'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Número de Casas'
        }
      },
      series: [{
        type: 'column',
        name: 'Casas',
        data: Object.values(provinciaCount), // Número de casas por cada provincia
        colorByPoint: true, // Permite asignar un color diferente a cada barra
        colors: colores // Asigna los colores personalizados a cada barra
      }]
    };
  }
  
  
  actualizarGraficoCiudades(): void {
    const ciudadCount = this.Lista.reduce((acc: { [key: string]: number }, casa) => {
      acc[casa.ciudad] = (acc[casa.ciudad] || 0) + 1;
      return acc;
    }, {});
    const colores = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#8A2BE2', '#FF4500'];
  
    this.chartOptions2 = {
      chart: {
        type: 'bar' 
      },
      title: {
        text: 'Casas por Ciudad'
      },
      xAxis: {
        categories: Object.keys(ciudadCount), 
        title: {
          text: 'Ciudad'
        }
      },
      yAxis: {
        title: {
          text: 'Número de Casas'
        }
      },
      series: [{
        type: 'bar', // Especifica que esta serie es de tipo 'bar'
        name: 'Casas',
        data: Object.values(ciudadCount), // Número de casas por cada ciudad
        colorByPoint: true, // Asigna un color único a cada barra
        colors: colores // Colores personalizados para las barras
      }]
    };
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
    this.cargarLista();
    window.location.reload();  
  }


  logout() {
    // Eliminar el token o los datos del usuario almacenados en localStorage o sessionStorage
    localStorage.removeItem('user'); 
    sessionStorage.removeItem('user'); 
    this.router.navigate(['/login']); 
  }
}