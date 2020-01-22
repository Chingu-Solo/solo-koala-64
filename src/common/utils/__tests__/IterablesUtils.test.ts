import { shuffle } from '../IterablesUtils'

test('returns array with same length and elements', () => {
  const nums: number[] = [0,1,2,3,4,5,6];
  const shuffledNums: number[] = shuffle(nums);
  expect(shuffledNums.length).toBe(nums.length);
  expect(shuffledNums).toEqual(expect.arrayContaining(nums));
});


test('returns [] if given []', () => {
  const nums: [] = [];
  const shuffledNums = shuffle(nums);
  expect(shuffledNums.length).toBe(0);
});
