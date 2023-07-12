var url = "http://127.0.0.1:8000/"


LEN = 1000
const input = new Array(LEN).fill(0)
const output = new Array(LEN).fill(0)

for (let i = 0; i < LEN; i++) {
  input[i] = new Array(LEN).fill(0)
  output[i] = new Array(LEN).fill(0)
}

console.log("done")

data = {
    "input":input, 
    "output":output
}

fetch(url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(json => {
    const w = json.w
    const b = json.b
    console.log(w.length, b.length)
    // console.log(w)
    // console.log(b)
})