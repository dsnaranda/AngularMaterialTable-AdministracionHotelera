import { Injectable } from '@angular/core';
import { casa } from '../entidades/casa';
import { HttpClient } from '@angular/common/http';  // Asegúrate de que HttpClient esté importado
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasaService {

  private apiUrl = 'http://localhost:3000/api/casas';
  private addapi = 'http://localhost:3000/api/addcasa';

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de casas
  getLista(): Observable<casa[]> {
    return this.http.get<casa[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de casas:', error);
        throw 'Error al obtener la lista de casas';  // Lanza un error para que sea manejado
      })
    );
  }

  // Método para obtener una casa por ID
  getCasaId(id: number): Observable<casa> {
    return this.http.get<casa>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener la casa con ID ${id}:`, error);
        throw `Error al obtener la casa con ID ${id}`;
      })
    );
  }

  // Método para agregar una nueva casa
  agregarCasa(nuevaCasa: casa): Observable<casa> {
    return this.http.post<casa>(this.addapi, nuevaCasa).pipe(
      catchError((error) => {
        console.error('Error al agregar la casa:', error);
        throw 'Error al agregar la casa';
      })
    );
  }

  // Método para actualizar una casa
  updateCasa(casaActualizada: casa): Observable<casa> {
    return this.http.put<casa>(`${this.apiUrl}/${casaActualizada.id}`, casaActualizada).pipe(
      catchError((error) => {
        console.error('Error al actualizar la casa:', error);
        throw 'Error al actualizar la casa';
      })
    );
  }



  // Método para eliminar una casa por ID
  eliminarCasaPorId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la casa:', error);
        throw 'Error al eliminar la casa';
      })
    );
  }

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>('/api/login', { correo, password }).pipe(
      catchError(error => {
        console.error('Error en el inicio de sesión:', error);
        throw 'Error en el inicio de sesión';
      })
    );
  }
  

  // Método para enviar una aplicación de casa
  submitApplication(nombre: string, apellido: string, mail: string): Observable<any> {
    const application = { nombre, apellido, mail };
    return this.http.post<any>(`${this.apiUrl}/application`, application).pipe(
      catchError((error) => {
        console.error('Error al enviar la aplicación:', error);
        throw 'Error al enviar la aplicación';
      })
    );
  }
}