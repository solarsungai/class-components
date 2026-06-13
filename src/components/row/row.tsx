import type { RowComponentProps } from 'react-window';
import type { Country, YearData } from '../../types';
import {
  getPopulationForYear,
  getCo2ForYear,
} from '../../utils/data-transformers';
import { CountryCard } from '../country-card/country-card';

type MyRowProps = {
  filteredCountries: Country[];
  yearMaps: Map<string, Map<number, YearData>>;
  selectedYear: number;
  selectedColumns: string[];
}

export const Row = ({ index, style, filteredCountries, yearMaps, selectedYear, selectedColumns }: RowComponentProps<MyRowProps>) => {
    const country = filteredCountries[index]; 
      const countryYearMap = yearMaps.get(country.id);
      const population = countryYearMap
        ? getPopulationForYear(countryYearMap, selectedYear)
        : undefined;
      const co2 = countryYearMap ? getCo2ForYear(countryYearMap, selectedYear) : undefined;
  
      return (
        <div style={{ ...style, paddingBottom: '16px' }}>
          <CountryCard
            key={country.id}
            country={country}
            selectedYear={selectedYear}
            selectedColumns={selectedColumns}
            population={population}
            co2={co2}
          />
        </div>
      );
}