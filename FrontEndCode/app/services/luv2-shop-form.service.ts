import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = environment.luv2shopApiUrl + "/countries";
  private statesUrl = environment.luv2shopApiUrl + "/states";

  constructor(private httpClient: HttpClient) { }


  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }


  getStates(theCountryCode: string): Observable<State[]> {
    // Search URL
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }


  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Month" dropdown list
    // Start at current month and loop until month 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // wrap the object as an observable
    return of(data);
  }


  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // Build an array for "Year" dropdown list
    // Start at current year and loop for the next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    // Wrap the object as an observable
    return of(data);
  }
}


interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}


interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}