var a = { 
    one:1, 
    two:2 
}, b = a

console.log("one:", a.one, ", two:", b.two)

delete a.one, delete b.two

console.log("one:", a.one, ", two:", b.two)