import { createSlice } from '@reduxjs/toolkit';

export type SubmissionType = {
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  image: string;
  terms: boolean;
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState: [] as SubmissionType[],
  reducers: {
    addSubmission: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addSubmission } = submissionsSlice.actions;
export default submissionsSlice.reducer;
