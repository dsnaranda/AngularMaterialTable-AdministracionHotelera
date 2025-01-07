import { Component, inject, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';
import { casa } from '../../entidades/casa';
import { CasaService } from '../../servicios/casa.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AggEditComponent } from '../agg-edit/agg-edit.component';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AggEditComponent],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent implements AfterViewInit, OnInit{

  selectedCasa: casa|null= null;
  isOpen: boolean = false;
  Lista: casa[] = [];
  oservice: CasaService = inject(CasaService);
  displayedColumnsBase: string[] = ['id', 'nombre', 'ciudad', 'provincia', 'foto', 'unidades','wifi', 'lavanderia'];
  displayedColumns: string[] = [...this.displayedColumnsBase, 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    if (this.Lista.length > 0) {
      this.dataSource.data = this.Lista;
      this.changeDetector.detectChanges();
    } 
    this.ngAfterViewInit();
  }

  constructor(private cservice: CasaService, private changeDetector: ChangeDetectorRef) {
    this.Lista = this.oservice.getLista();
  }

  ngOnInit(): void {
    this.Lista = this.cservice.getLista();
    this.cargarLista();
  }

  eliminarCasa(id: number): void {
    this.cservice.eliminarCasaPorId(id);  
    this.Lista = this.cservice.getLista();  
    this.cargarLista(); 
  }
  

  editCasa(cservice: casa) {
    this.selectedCasa = cservice;  
    this.isOpen = true;
  }

  onCloseModal(){
    this.isOpen=false;
    this.selectedCasa = null;
    this.cargarLista(); 
  }
}
