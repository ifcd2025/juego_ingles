const listaAnimalesOriginal = ["anteater","bulldog","butterfly","cat","chameleon","clown-fish","crocodile","duck","frog","giraffe","kangaroo","lion","monkey","octopus","ostrich","pig","rabbit","racoon","ray","shark","sheep","spider","squirrel","swan","tiger","toucan","turtle"];
let listaActual;

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
    listaActual = barajar([...listaAnimalesOriginal]);
    const main = document.getElementById("imagenes");
    main.textContent = "";
    for(const dibujo of listaActual) {
        const div = document.createElement("div");
        main.appendChild(div);
        div.classList.add("rounded-3", "dibujo", "border", "border-1", "shadow");
        div.style.backgroundImage = `url(imagenes/animales/${dibujo}.svg)`;
        div.style.backgroundSize = "contain";
        div.dataset.nombre = dibujo;
    }
    generarNombre();
    aciertos = 0;
    fallos = 0;
    tiempo = 0;
    document.getElementById("aciertos").textContent = aciertos;
    document.getElementById("tiempo").textContent = 0;
    document.getElementById("fallos").textContent = fallos;
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
        document.getElementById("imagenes").removeEventListener("click", comprobarDibujo );
        // Usar html en lugar de text
        Swal.fire({
        title: "Has ganado",
        html: `<div>Enhorabuena</div><div>Aciertos: ${aciertos}</div><div>Fallos: ${fallos}</div><div>Tiempo: ${tiempo}</div>`,
        icon: "success"
        })
        .then(() =>
            Swal.fire({
                title: "¿Jugar de nuevo?",
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
                   inicializar();
                }
            })
        )
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
                inicializar();
            }
        })
}

Swal.fire({
  title: "Aprende inglés",
  text: "Selecciona el animal que coincida con el nombre",
  icon: "info"
}).then(() => {
    inicializar();
});

document.getElementById("reiniciar").addEventListener("click", reiniciar);
