import { ordinalSuffixOf } from '../TextUtils'

test('returns correctly', () => {
  const nums: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
  const suffixNums: string[] = ['0th','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st','32nd'];
  expect(nums.map(n => ordinalSuffixOf(n))).toStrictEqual(suffixNums);
});

test('returns a different array', () => {
  const nums: number[] = [0,1,2];
  const suffixNums: string[] = ['0th','1st','2d'];
  expect(nums.map(n => ordinalSuffixOf(n))).not.toStrictEqual(suffixNums);
});
