const listaDibujosOriginal =[
    { tipo: "animales", dibujos: ["anteater","bulldog","butterfly","cat","chameleon","clown-fish","crocodile","duck","frog","giraffe","kangaroo","lion","monkey","octopus","ostrich","pig","rabbit","racoon","ray","shark","sheep","spider","squirrel","swan","tiger","toucan","turtle"]},
    { tipo: "cuerpo", dibujos: ["brain", "ear", "eye", "eyebrow", "eyelashes", "finger", "foot", "hair", "hand", "head", "heart", "kidney", "leg", "lips", "liver", "lungs", "nose"]},
    { tipo: "deportes", dibujos:  ["badminton", "basketball", "bowling", "boxing", "diving", "football", "golf", "gymnastics", "handball", "ice hockey", "ping pong", "running", "sailing", "shooting", "swimming", "tennis", "volleyball", "waterpolo"]},
    { tipo: "equipos", dibujos: ["calculator", "clock", "computer", "fridge", "keyboard", "laptop", "microphone", "mouse", "printer", "radio", "telephone", "television"]},    { tipo: "fruta_vegetales", dibujos: ["apple", "avocado", "banana", "carrot", "cherry", "eggplant", "garlic", "graps", "kiwi", "lemon", "onion", "orange", "peach", "pepper", "pineapple", "plum", "pumpkin", "strawberry", "tomato", "watermelon"]},
    { tipo: "profesiones", dibujos: ["carpenter", "chef", "chemist", "clown", "cycling", "dancer", "doctor", "farmer", "fencing", "fisherman", "hairdresser", "maid", "nurse", "painter", "police", "postman", "sailor", "skiing", "stewardess", "surgeon", "teacher", "waiter"]},
    { tipo: "ropa", dibujos: ["backpack", "bathrobe", "boot", "cap", "dress", "glasses", "glove", "handbag", "jacket", "scarf", "shirt", "shoe", "short", "skirt", "sock", "suit", "sunglasses", "swinsuit", "t-shirt", "tie", "trousers", "watch"]},
    { tipo: "vehiculos", dibujos: ["airplane", "ambulance", "bicycle", "bus", "car", "excavator", "helicopter", "hot air balloon", "motorcycle", "sailboat", "ship", "taxi", "tram", "truck", "zeppelin"]}
];

let listaActual;
let nivelActual = 0;
let palabraElegida;
let aciertos = 0;
let fallos = 0;
let tiempo = 0;
let reloj = null;
const sonidoAcierto = new Audio("sonidos/acierto.mp3");
const sonidoFallo = new Audio("sonidos/fallo.mp3");


function barajar(array) { // Algoritmo Fisher–Yates
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}

function inicializar() {
    document.getElementById("imagenes").addEventListener("click", comprobarDibujo );
    // uso [... para crea un array nuevo]
    listaActual = barajar([...listaDibujosOriginal[nivelActual].dibujos]);
    const main = document.getElementById("imagenes");
    main.textContent = "";
    for(const dibujo of listaActual) {
        const div = document.createElement("div");
        main.appendChild(div);
        div.classList.add("rounded-3", "dibujo", "border", "border-1", "shadow");
        div.style.backgroundImage = `url('imagenes/${listaDibujosOriginal[nivelActual].tipo}/${dibujo}.svg')`;
        div.style.backgroundSize = "contain";
        div.dataset.nombre = dibujo;
    }
    generarNombre();

    const buenos = document.querySelector(".bien");
    for(const e in buenos) {
        e.classList.remove("bien");
    }
    clearInterval(reloj);
    reloj = setInterval(() => { tiempo++; document.getElementById("tiempo").textContent = tiempo} , 1000);
}

function generarNombre() {
    palabraElegida = listaActual[Math.floor(Math.random() * listaActual.length)];
    const elementoPalabraElegida = document.getElementById("palabraElegida")
    elementoPalabraElegida.textContent = palabraElegida; 
    elementoPalabraElegida.classList.remove("animacionPalabraElegida");
    elementoPalabraElegida.offsetWidth;
    elementoPalabraElegida.classList.add("animacionPalabraElegida");

}

function comprobarDibujo(evt) {
    const seleccionado = evt.target;
    if(seleccionado.dataset.nombre != undefined && seleccionado.classList.contains("bien") == false) {
        if(seleccionado.dataset.nombre === palabraElegida) {
            seleccionado.classList.add("bien");
            seleccionado.classList.remove("mal");
            listaActual.splice(listaActual.findIndex(a => a === palabraElegida), 1);
            aciertos++;
            sonidoAcierto.currentTime = 0;
            sonidoAcierto.play();
            document.getElementById("aciertos").textContent = aciertos;
            comprobarVictoria();
        } else {
            fallos++;
            sonidoFallo.currentTime = 0;
            sonidoFallo.play();
            document.getElementById("fallos").textContent = fallos;
            seleccionado.classList.remove("mal");
            seleccionado.offsetWidth;
            seleccionado.classList.add("mal");
        }
        generarNombre();
    }
}

function comprobarVictoria() {
    if(listaActual.length == 0) {
        const imagenes = document.getElementById("imagenes");
        imagenes.classList.remove("animacionVictoria");
        imagenes.offsetWidth
        imagenes.classList.add("animacionVictoria");
        imagenes.removeEventListener("click", comprobarDibujo );
        // Usar html en lugar de text
        Swal.fire({
            title: "Has pasado el nivel " + (nivelActual  + 1),
            html: `<div>Enhorabuena</div><div>Aciertos: ${aciertos}</div><div>Fallos: ${fallos}</div><div>Tiempo: ${tiempo}</div>`,
            icon: "success"
        })
        .then(() => {
            imagenes.classList.remove("animacionVictoria");
            nivelActual++;
            if(nivelActual == listaDibujosOriginal.length) {
                Swal.fire({
                    title: "Has completado el juego",
                    icon: "success",
                    html: "<div>Enhorabuena</div>"
                })
            } else {
                inicializar()
            }
        })
    }
}

function reiniciar() {
     Swal.fire({
            title: "¿Reiniciar partida?",
            //text: "You won't be able to revert this!", Opcional
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            theme: "dark"
            }).then((result) => {
            if (result.isConfirmed) {
                barajar(listaDibujosOriginal);
                nivelActual = 0;
                aciertos = 0;
                fallos = 0;
                tiempo = 0;
                document.getElementById("aciertos").textContent = aciertos;
                document.getElementById("tiempo").textContent = 0;
                document.getElementById("fallos").textContent = fallos;
                inicializar();
            }
        })
}

Swal.fire({
  title: "Aprende inglés",
  text: "Selecciona el dibujo que coincida con el nombre",
  icon: "info"
}).then(() => {
    inicializar();
});

barajar(listaDibujosOriginal);
document.getElementById("reiniciar").addEventListener("click", reiniciar);
