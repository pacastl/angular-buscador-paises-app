import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl:string ='https://restcountries.com/v3.1';

  // Almacenamos la información para conservarla al cambiar de ruta
  public cacheStore:CacheStore={
    // Guardamos el valor de la barra de busqueda y los países que ha obtenido de la búsqueda
    byCapital: {term:'',countries:[]},
    byCountries: {term: '',countries:[]},
    byRegion:{region: '',countries:[]}
  }

  constructor(private http:HttpClient) {
    // cuando el servicio se carga, recuperamos la info guardada aunque se haya recargado la página
    this.loadFromLocalStorage();
  }

  // Para guardar la info aunque recargue la pagina
  private saveToLocalStorage(){
    // Solo podemos guardar strings
    localStorage.setItem( 'cacheStore', JSON.stringify( this.cacheStore ));
  }
  // Para recuperar la info cuando recargue la pagina
  private loadFromLocalStorage() {
    if ( !localStorage.getItem('cacheStore') ) return;

    this.cacheStore = JSON.parse( localStorage.getItem('cacheStore')! );
  }


  private getCountriesRequest(url:string):Observable<Country[]>{
    return this.http.get<Country[]>(url)
    .pipe(
      catchError( ()=> of([]) ),
      // delay(1000),
    );
  }

  searchCountryByAlphaCode(code:string):Observable<Country | null>{
    const url= `${this.apiUrl}/alpha/${code}`;

    return this.http.get<Country[]>( url )
    .pipe(
      map( countries => countries.length > 0 ? countries[0]: null ),
      catchError( () => of(null) )
      );
  }



  searchCapital(term:string):Observable<Country[]>{
    // Sin subscribe la petición No se ejecuta, solo está definida
    const url= `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCapital = { term:term,countries:countries}),
      tap( () => this.saveToLocalStorage() ),
      );
  }

  searchCountry(term:string):Observable<Country[]>{
    const url=`${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap( countries => this.cacheStore.byCountries = { term:term,countries:countries}),
      tap( () => this.saveToLocalStorage() ),
      );

  }

  searchRegion(region:Region):Observable<Country[]>{
    const url =`${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url)
     .pipe(
      tap( countries => this.cacheStore.byRegion = { region:region,countries:countries}),
      tap( () => this.saveToLocalStorage() ),
      );

  }
}

