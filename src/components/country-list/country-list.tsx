import React, { useMemo } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import {
  getPopulationForYear,
  getCo2ForYear,
  createYearDataMap,
} from '../../utils/data-transformers';
import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = React.memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const yearMaps = useMemo(
      () => new Map(countries.map((c) => [c.id, createYearDataMap(c.data)])),
      [countries]
    );

    const searchedAndFilteredCountries = useMemo(() => {
      return countries.filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      });
    }, [countries, searchQuery, selectedRegion]);

    const filteredCountries = useMemo(() => {
      return [...searchedAndFilteredCountries].sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(yearMaps.get(a.id)!, selectedYear) || 0;
          const popB = getPopulationForYear(yearMaps.get(b.id)!, selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
    }, [searchedAndFilteredCountries, sortField, sortOrder, selectedYear, yearMaps]);

    return (
      <div className={styles.countryList}>
        {filteredCountries.map((country) => {
          const countryYearMap = yearMaps.get(country.id);
          const population = countryYearMap
            ? getPopulationForYear(countryYearMap, selectedYear)
            : undefined;
          const co2 = countryYearMap ? getCo2ForYear(countryYearMap, selectedYear) : undefined;
          return (
            <CountryCard
              key={country.id}
              country={country}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
              population={population}
              co2={co2}
            />
          );
        })}
      </div>
    );
  }
);
