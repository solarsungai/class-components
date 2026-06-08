import { describe, it, expect } from 'vitest';
import submissionsReducer, { addSubmission } from './submissionsSlice';
import type { SubmissionType } from './submissionsSlice';

const sampleSubmission: SubmissionType = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  gender: 'female',
  country: 'France',
  image: 'data:image/png;base64,abc',
  terms: true,
};

describe('submissionsSlice', () => {
  it('returns empty array as initial state', () => {
    expect(submissionsReducer(undefined, { type: '@@INIT' })).toEqual([]);
  });

  it('addSubmission appends a new submission', () => {
    const state = submissionsReducer([], addSubmission(sampleSubmission));
    expect(state).toHaveLength(1);
    expect(state[0]).toEqual(sampleSubmission);
  });

  it('addSubmission appends to existing submissions', () => {
    const initial = [sampleSubmission];
    const second: SubmissionType = { ...sampleSubmission, name: 'Bob', email: 'bob@example.com' };
    const state = submissionsReducer(initial, addSubmission(second));
    expect(state).toHaveLength(2);
    expect(state[1]).toEqual(second);
  });
});
