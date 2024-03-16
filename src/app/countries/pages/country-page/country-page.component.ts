import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit{

  public country?:Country;
  constructor(
    private activatedRoute:ActivatedRoute,
    private CountriesService:CountriesService,
    private router:Router,) {

    }
  ngOnInit(): void {
    // params e sun observable y por eos tengo acceso a RXJs -> los pipes
    this.activatedRoute.params
    .pipe(
      // switchMap devuelve un nuevo Observable
      switchMap( ({id}) => this.CountriesService.searchCountryByAlphaCode(id))
    )
    .subscribe( (country) => {
      if(!country){
        // Si la ruta noe xiste redirige al home
        return this.router.navigateByUrl('');
      }
      return this.country=country;
    });
  }

}
