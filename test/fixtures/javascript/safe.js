
function sumArray (array) {
  let result = 0
  for (let element of array) {
    result += element
  }
  return result
}

let arr = [1, 2, 20, 30]

console.log(sumArray(arr))
