const nums = process.argv.slice(2).map(item => +item);
const summ = nums.reduce((acc, cur) => acc + cur, 0);
console.log(summ);