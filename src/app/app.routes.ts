import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { DetallesComponent } from './componentes/detalles/detalles.component';
import { AdministracionComponent } from './componentes/administracion/administracion.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    title: 'Pagina Inicio',
  },
  {
    path: 'administracion',
    component: AdministracionComponent,
    title: 'Administración',
  },
  {
    path: 'detalles/:id',
    component: DetallesComponent,
    title: 'Pagina detalle',
  }

];
export default routes;
