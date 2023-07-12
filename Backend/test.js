

var x = new Array(10000).fill(0)

for (let i = 0; i < x.length; i++) {
  x[i] = new Array(10000).fill(0)
}

console.log(x.length)