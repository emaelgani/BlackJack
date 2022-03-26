
const miModulo = (() => {
    'use strict'; //evalua el codigo de forma estricta, habilita ciertas restricciones


    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['J', 'Q', 'K', 'A'];

    let puntosJugadores = [];

    //Referencias del html
    const btnNuevo = document.querySelector('#btnNuevo'),
        btnDetener = document.querySelector('#btnDetener'),
        btnPedir = document.querySelector('#btnPedir');

    const puntosHTML = document.querySelectorAll('small'),
        divCartasJugadores = document.querySelectorAll('.divCartas');


    //Función que inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();

        console.log({ numJugadores });

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores[i] = 0;
        }

        puntosHTML.forEach((elem) => elem.innerText = 0);
        divCartasJugadores.forEach((elem) => elem.innerHTML = '');


        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }


    /* Funcion que crea una nueva baraja y la mezcla */
    const crearDeck = () => {

        deck = [];

        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let especial of especiales) {
                deck.push(especial + tipo);
            }
        }
        /* deck = []; */
        return _.shuffle(deck); //Mezcla la baraja y la devuelve, utiliza el archivo underscore.js
    }


    /* Función que me permite tomar una carta */

    const pedirCarta = () => {
        return (deck.length === 0) ? new Error('No hay cartas en la baraja') : deck.pop();
    }

    /* Función que sirve para obtener el valor de una carta determinada */
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;

    }

    //Turno: 0 = jugador, último = computadora
    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerHTML = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);

    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {

            if (puntosComputadora === puntosMinimos) {
                alert('Emapte');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 100);
    }

    //Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        }
        while ((puntosComputadora < puntosMinimos) && (puntosMinimos < 21));

        determinarGanador();
    }



    btnDetener.addEventListener('click', () => {

        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora(puntosJugadores[0]);

    });



    //Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();

        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            console.warn('Perdiste');
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('Ganaste');
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }

    });


    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });



    //La única función que hago pública para que se pueda acceder desde afuera, la renombro como nuevoJuego
    return {
        nuevoJuego: inicializarJuego
    };
})();









