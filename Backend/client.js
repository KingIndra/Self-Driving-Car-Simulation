var url = "http://127.0.0.1:8000/items/1?s=varun"

fetch(url)
.then(response => response.json())
.then(json => {
    console.log(json)
})