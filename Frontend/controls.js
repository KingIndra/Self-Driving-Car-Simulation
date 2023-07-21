class Controls{
    constructor(type){
        this.forward=true;
        this.left=false;
        this.right=false;
        this.reverse=false;
        this.maxSpeed = null;
        this.type = type

        switch(type){
            case "KEYS":
                // this.forward=true;
                this.#addSpeedListner();
                this.#addControlListner();
                this.#addKeyboardListeners();
                this.#addOrentatinListner();
                break;
            case "AI":
                this.#addSpeedListner();
                this.#addControlListner();
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }

        this.c = 0;
        this.c_for_speed = 1;
    }

    #addOrentatinListner() {
        const handleOrientation = (event) => {
            let gama = event.gamma, objOrientation
            if(gama<0) objOrientation = { left:true, right:false }
            else if(gama>0) objOrientation = { left:false, right:true }
            else objOrientation = { left:false, right:false }
            this.left = objOrientation.left, this.right = objOrientation.right
        }
        window.addEventListener("deviceorientation", handleOrientation)
    }

    #addControlListner() {
        const handleControl = (event) => {
            let button = event.target
            if(button.tagName !== "BUTTON") button = button.parentElement
            const iconAi = '<i class="fa-solid fa-robot">'
            const iconKeys = '<i class="fa-solid fa-gamepad">'
            if(this.c%2 === 0) {
                button.innerHTML = iconKeys
            } else {
                button.innerHTML = iconAi
            } 
            this.c++
            if(this.type === "AI") {
                this.type = "KEYS"
            } else if(this.type === "KEYS") {
                this.type = "AI"
            }
        }
        const button = document.getElementById("changeMode")
        button.addEventListener("click", handleControl)
    }

    #addSpeedListner() {
        const handleControl = (event) => {
            let button = event.target
            if(button.tagName !== "BUTTON") button = button.parentElement;

            let speed = Number(button.getAttribute('speed'))

            if(this.c_for_speed%3 == 0) {
                speed -= 2
                this.c_for_speed++
            } else {
                speed++
                this.c_for_speed++
            }
            button.setAttribute("speed", speed)

            switch(speed) {
                case 3:
                    button.innerHTML = '<i class="fa-solid fa-3"></i>'
                    break
                case 4:
                    button.innerHTML = '<i class="fa-solid fa-4"></i>'
                    break
                case 5:
                    button.innerHTML = '<i class="fa-solid fa-5"></i>'
                    break
            }

            this.maxSpeed = speed
        }
        const button = document.getElementById("changeSpeed")
        button.addEventListener("click", handleControl)
    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    if(this.type!="AI") this.left=true;
                    break;
                case "ArrowRight":
                    if(this.type!="AI") this.right=true;
                    break;
                case "1":
                    this.maxSpeed = 1;
                    break;
                case "2":
                    this.maxSpeed = 2;
                    break;
                case "3":
                    this.maxSpeed = 3;
                    break;
                case "4":
                    this.maxSpeed = 4;
                    break;
                case "5":
                    this.maxSpeed = 5;
                    break;
                case "6":
                    this.maxSpeed = 6;
                    break;
                case "7":
                    this.maxSpeed = 7;
                    break;
                case "8":
                    this.maxSpeed = 8;
                    break;
                case "9":
                    this.maxSpeed = 9;
                    break;
                case "0":
                    this.forward = false;
                    break;
                // case "ArrowUp":
                //     this.forward=true;
                //     break;
                // case "ArrowDown":
                //     this.reverse=true;
                //     break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    if(this.type!="AI") this.left=false;
                    break;
                case "ArrowRight":
                    if(this.type!="AI") this.right=false;
                    break;
                case "0":
                    this.forward = true;
                    break;
                // case "ArrowUp":
                //     this.forward=false;
                //     break;
                // case "ArrowDown":
                //     this.reverse=false;
                //     break;
            }
        }
    }
}