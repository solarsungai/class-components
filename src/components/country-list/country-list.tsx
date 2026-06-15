import React, { useMemo } from 'react';
import { List } from 'react-window';
import type { Country } from '../../types';
import { Row } from '../row/row';
import {
  getPopulationForYear,
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
        <List
          rowComponent={Row}
          rowCount={filteredCountries.length}
          rowHeight={295}
          rowProps={{ filteredCountries, yearMaps, selectedYear, selectedColumns }}
          className={styles.virtualList}
        />
      </div>
    );
  }
);
