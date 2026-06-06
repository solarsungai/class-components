import { createSlice  } from '@reduxjs/toolkit';
import countries from '../constants/countries';

const countriesSlice = createSlice({
  name: 'countries',
  initialState: countries as string[],
  reducers: {},
});

export default countriesSlice.reducer;