// Variables Globales
var timer = null;

var nRows = 20;
var nCols = 10;
var Velocidad = 'normal';
var aCuadros = [];
var piezaActiva = null;
var sombraRow = null;

var teclas = { 
	ctrl: 17,
	esc: 27,
	espacio: 32,
	iz: 37,
	ar: 38,
	de: 39,
	ab: 40
};

var colaPiezas = ['', '', ''];
var Hold = { tipo: '', nPos: 0, color: ''};

var LINEAS = 0;
var PUNTOS = 0;
var NIVEL = 1
var nivelmax = 8;
var retraso = {
	normal: [0, 800, 500, 400, 300, 200, 100, 50, 20],
	rapido: [0, 80,   50,  40,  30,  20,  10,  2,  2]
};

var aTipos = ['i','j','l','o','s','t','z']; // Tipos de tetriminos
var anchura = 4; // Anchura/altura maxima de todos los tetriminos

var tetriminos = {
	i: { cuadros:4, canTipos:2, color:1, posiciones:
		[{x: [1,1,1,1], y: [0,1,2,3], clase: ['ro','lro','lro','lo'], rows:[1],		  width:3, offsetX: -1},
		 {x: [0,1,2,3], y: [2,2,2,2], clase: ['do','udo','udo','uo'], rows:[0,1,2,3], width:0, offsetX: 0}]},
	j: { cuadros:4, canTipos:4, color:2, posiciones: 
		[{x: [0,1,1,1], y: [0,0,1,2], clase: ['do','uro','lro','lo'], rows:[0,1],	width:2, offsetX: 0},
		 {x: [0,0,1,2], y: [1,2,1,1], clase: ['dro','lo','udo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [1,1,1,2], y: [0,1,2,2], clase: ['ro','lro','dlo','uo'], rows:[1,2],	width:2, offsetX: -1},
		 {x: [0,1,2,2], y: [1,1,0,1], clase: ['do','udo','ro','ulo'], rows:[0,1,2],	width:1, offsetX: 0}]},
	l: { cuadros:4, canTipos:4, color:3, posiciones: 
		[{x: [0,1,2,2], y: [1,1,1,2], clase: ['do','udo','uro','lo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [1,1,1,2], y: [0,1,2,0], clase: ['dro','lro','lo','uo'], rows:[1,2],	width:2, offsetX: -1},
		 {x: [0,0,1,2], y: [0,1,1,1], clase: ['ro','dlo','udo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [0,1,1,1], y: [2,0,1,2], clase: ['do','ro','lro','ulo'], rows:[0,1],	width:2, offsetX: 0}]},
	o: { cuadros:4, canTipos:1, color:4, posiciones: 
		[{x: [1,1,2,2], y: [1,2,1,2], clase: ['rdo','ldo','ruo','luo'], rows:[1,2],	width:1, offsetX: -1}]},
	s: { cuadros:4, canTipos:2, color:5, posiciones: 
		[{x: [0,1,1,2], y: [1,1,2,2], clase: ['do','uro','dlo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [1,1,2,2], y: [1,2,0,1], clase: ['dro','lo','ro','ulo'], rows:[1,2],	width:2, offsetX: -1}]},
	t: { cuadros:4, canTipos:4, color:6, posiciones: 
		[{x: [0,1,1,2], y: [1,0,1,1], clase: ['do','ro','udlo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [0,1,1,1], y: [1,0,1,2], clase: ['do','ro','ulro','lo'], rows:[0,1],	width:2, offsetX: 0},
		 {x: [0,1,1,2], y: [1,1,2,1], clase: ['do','udro','lo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [1,1,1,2], y: [0,1,2,1], clase: ['ro','dlro','lo','uo'], rows:[1,2],	width:2, offsetX: -1}]},
	z: { cuadros:4, canTipos:2, color:7, posiciones: 
		[{x: [0,1,1,2], y: [2,1,2,1], clase: ['do','dro','ulo','uo'], rows:[0,1,2],	width:1, offsetX: 0},
		 {x: [1,1,2,2], y: [0,1,1,2], clase: ['ro','dlo','uro','lo'], rows:[1,2],	width:2, offsetX: -1}]}
	};


var EstadoJuego = -1; // -1: nada, 0: en pausa, 1: jugando



function precargar() {
	get('cmdcargar').className = 'boton';
	del(get('loading'));
}



function cargar() {
	// Array del area
	var row;
	var col;
	for (row = 0; row < nRows; row++) {
		aCuadros.push([]);
		for (col = 0; col < nCols; col++) {
			aCuadros[row].push('');
		}
	}

	// Tabla para visualizar el juego
	var div = get('divjuego');
	var tabla = dom('table');
	var tbody = dom('tbody');
	tabla.className = 'celdas';
	tabla.id = 'juego';
	ins(div, tabla);
	ins(tabla, tbody);

	var tr; 
	var td;

	for (row = 0; row < nRows; row++) {
		tr = dom('tr');
		ins(tbody, tr);
		for (col = 0; col < nCols; col++) {
			td = dom('td');
			ins(tr, td);
			td.id = 'row'+row+'col'+col;
		}
	}

	// Pieza en espera
	var tdhold = get('tdhold');
	tabla = dom('table');
	tbody = dom('tbody');
	tabla.className = 'celdas';
	tabla.id = 'tablehold';
	ins(tdhold, tabla);
	ins(tabla, tbody);

	for (row = 0; row < anchura; row++) {
		tr = dom('tr');
		ins(tbody, tr);
		for (col = 0; col < anchura; col++) {
			td = dom('td');
			ins(tr, td);
			td.id = 'hold_row'+row+'col'+col;
		}
	}

	// Siguientes Piezas
	var tdnext = get('tdnext');
	var tipo;
	var nPos;
	var color;

	for (var n = 0; n < colaPiezas.length; n++) {
		tabla = dom('table');
		tbody = dom('tbody');
		tabla.className = 'celdas';
		tabla.id = 'next'+n;
		ins(tdnext, tabla);
		ins(tabla, tbody);

		for (row = 0; row < anchura; row++) {
			tr = dom('tr');
			ins(tbody, tr);
			for (col = 0; col < anchura; col++) {
				td = dom('td');
				ins(tr, td);
				td.id = 'next_'+n+'_row'+row+'col'+col;
			}
		}

		colaPiezas[n] = piezaAleatoria();
		tipo = colaPiezas[n].tipo;
		nPos = colaPiezas[n].nPos;
		color= colaPiezas[n].color;
		mostrarPieza(true, 0, 0, tipo, nPos, color, 'next_'+n+'_', false);
	}


	get('txtlineas').value = 0;
	get('txtpuntos').value = 0;
	get('txtnivel').value  = 1;
	get('tablatodo').className = '';

	del(get('tablecomienzo'));
	EstadoJuego = 1;

	var pieza = piezaAleatoria();
	piezaActiva = nuevaPieza(pieza.tipo, pieza.nPos, pieza.color);

	mostrarSombra(true);
	piezaActiva.mostrar(true);

	document.onkeydown = KeyCheck;
}




function piezaAleatoria() {
	var pieza = {};
	var tipo = aleatorio(aTipos);
	var canTipos = tetriminos[tipo].canTipos;
	var nPos = Math.floor( canTipos * Math.random() );
	var color =  tetriminos[tipo].color;

	pieza.tipo = tipo;
	pieza.nPos = nPos;
	pieza.color = color;
	return pieza;
}



function nuevaPieza(tipo, nPos, color) {
	var pieza = {};
	pieza.tipo = tipo;
	pieza.nPos = nPos;
	pieza.width = tetriminos[tipo].posiciones[nPos].width;
	pieza.row = tetriminos[tipo].posiciones[nPos].offsetX;
	pieza.col = 4;
	pieza.color = color;

	pieza.mostrar = function(lMostrar) {
		mostrarPieza(lMostrar, pieza.row,  pieza.col,  pieza.tipo, pieza.nPos,  pieza.color, '', false);
	};
	pieza.rotar = function() { rotarPieza(pieza) };
	pieza.mover = function(nCuadros) { moverPieza(nCuadros) };

	if (!posicionValida(pieza.row, pieza.col, tipo, nPos)) {
		piezaGameOver = new Object();
		piezaGameOver.col = pieza.col;
		piezaGameOver.tipo =  pieza.tipo;
		piezaGameOver.nPos =  pieza.nPos;

		return null;
	}

	Velocidad = 'normal';
	timer = setTimeout(bajar, retraso[Velocidad][NIVEL]);
	return pieza;
}



function mostrarPieza(lMostrar, row, col, tipo, nPos, color, cPrefijoTD, lSombra) {
	var rowCuadro;
	var colCuadro;
	var clase;
	var cuadro;
	for (var n = 0; n < tetriminos[tipo].cuadros; n++) {
		rowCuadro = row + tetriminos[tipo].posiciones[nPos].x[n];
		colCuadro = col + tetriminos[tipo].posiciones[nPos].y[n];
		if (lSombra) {
			clase = 'sombra';
		}else{
			clase = tetriminos[tipo].posiciones[nPos].clase[n];
		}

		cuadro = get(cPrefijoTD + 'row' + rowCuadro + 'col' + colCuadro);
		if (cuadro != null) {
			cuadro.className = (lMostrar) ? clase+color : '';
		}
	}
}



function rotarPieza(pieza, r, c) {
	var row  = (r == null) ? pieza.row : r;
	var col  = (c == null) ? pieza.col : c;

	var tipo = pieza.tipo;
	var nPos = pieza.nPos + 1;
	if (nPos == tetriminos[tipo].canTipos) {
		nPos = 0;
	}

	if(!posicionValida(row, col, tipo, nPos)) {

		var width  = pieza.width;
		var widthR = tetriminos[tipo].posiciones[nPos].width;
		if(row < 0) {
			rotarPieza(pieza, 0, col);
			return true;
		}
		if(col < 0) {
			rotarPieza(pieza, row, 0);
			return true;
		}
		if(col+widthR >= nCols) {
			rotarPieza(pieza, row, nCols-1-widthR );
			return true;
		}

		return false;
	}


	mostrarSombra(false);
	pieza.mostrar(false);

	pieza.row = row;
	pieza.col = col;
	pieza.nPos = nPos;

	mostrarSombra(true);
	pieza.mostrar(true);

	return true;
}



function moverPieza(nCuadros) {
	var col  = piezaActiva.col + nCuadros;
	var row  = piezaActiva.row;
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;

	if(!posicionValida(row, col, tipo, nPos)) return;

	mostrarSombra(false);
	piezaActiva.mostrar(false);

	piezaActiva.col = col;

	mostrarSombra(true);
	piezaActiva.mostrar(true);
}



function bajar() {
	var col  = piezaActiva.col;
	var row  = piezaActiva.row;
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;

	if(!posicionValida(row + 1, col, tipo, nPos)) {
		colocar(row, col);
		return;
	}

	piezaActiva.mostrar(false);
	piezaActiva.row = row + 1;
	piezaActiva.mostrar(true);

	timer = setTimeout(bajar, retraso[Velocidad][NIVEL]);
}



function bajarRapido() {
	clearInterval(timer);
	Velocidad = 'rapido';
	timer = setTimeout(bajar, retraso[Velocidad][NIVEL]);
}



function colocar(row, col) {
	var rowCuadro = 0;
	var colCuadro = 0;
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;
	var color = piezaActiva.color;

	for (var n = 0; n < tetriminos[tipo].cuadros; n++) { 
		rowCuadro = tetriminos[tipo].posiciones[nPos].x[n] + row;
		colCuadro = tetriminos[tipo].posiciones[nPos].y[n] + col;
		claseC    = tetriminos[tipo].posiciones[nPos].clase[n];
		aCuadros[rowCuadro][colCuadro] = claseC + color;
	}

	quitarLineas();

	piezaActiva = null;
	piezaActiva = piezaEnCola(); 
	if (piezaActiva == null) {
		gameOver();
		return;
	}

	mostrarSombra(true);
	piezaActiva.mostrar(true);
}



function posicionValida(row, col, tipo, nPos) {
	var cuadros = tetriminos[tipo].cuadros;
	var x = tetriminos[tipo].posiciones[nPos].x;
	var y = tetriminos[tipo].posiciones[nPos].y;
	var colCuadro;
	var rowCuadro;
	for(var n = 0; n < cuadros; n++) {
		rowCuadro = row + x[n];
		colCuadro = col + y[n];
		if (rowCuadro < 0 || rowCuadro >= nRows) return false;
		if (colCuadro < 0 || colCuadro >= nCols) return false;
		if (aCuadros[rowCuadro][colCuadro]) return false;
	}
	return true;
}



function piezaEnCola() {
	var tipo; var nPos; var color;
	for (n = 0; n < colaPiezas.length; n++) {
		tipo = colaPiezas[n].tipo;
		nPos = colaPiezas[n].nPos;
		color= colaPiezas[n].color;
		mostrarPieza(false, 0, 0, tipo, nPos, color, 'next_'+n+'_', false);
	}
	var pieza = colaPiezas.shift();
	colaPiezas.push( piezaAleatoria() );

	for (n = 0; n < colaPiezas.length; n++) {
		tipo = colaPiezas[n].tipo;
		nPos = colaPiezas[n].nPos;
		color= colaPiezas[n].color;
		mostrarPieza(true, 0, 0, tipo, nPos, color, 'next_'+n+'_', false);
	}

	return nuevaPieza(pieza.tipo, pieza.nPos, pieza.color);
}



function drop() {
	if (piezaActiva == null) return;
	clearInterval(timer);
	piezaActiva.mostrar(false);
	var row = piezaActiva.row;
	var col = piezaActiva.col;
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;

	for (var n = row; n < nRows; n++) {
		if (!posicionValida(n, col, tipo, nPos)) {
			piezaActiva.row = n-1;
			piezaActiva.mostrar(true);
			clearInterval(timer);

			colocar((n-1),col);
			break;
		}
	}
}




function cambiarHold() {
	if (Hold.tipo == '') {
		clearInterval(timer);

		Hold.tipo = piezaActiva.tipo;
		Hold.nPos = piezaActiva.nPos;
		Hold.color= piezaActiva.color;


		mostrarSombra(false);
		piezaActiva.mostrar(false);

		piezaActiva = piezaEnCola();

		mostrarSombra(true);
		piezaActiva.mostrar(true);
	}else{
		if(!posicionValida(piezaActiva.row, piezaActiva.col, Hold.tipo, Hold.nPos)) {
			return;
		}

		var tipoH = Hold.tipo;
		var nPosH = Hold.nPos;
		var colorH= Hold.color;

		mostrarSombra(false);
		piezaActiva.mostrar(false);
		mostrarPieza(false, 0, 0, Hold.tipo, Hold.nPos, Hold.color, 'hold_', false);

		Hold.tipo = piezaActiva.tipo;
		Hold.nPos = piezaActiva.nPos;
		Hold.color= piezaActiva.color;

		piezaActiva.tipo = tipoH;
		piezaActiva.nPos = nPosH;
		piezaActiva.color= colorH;

		mostrarSombra(true);
		piezaActiva.mostrar(true);
	}

	mostrarPieza(true, 0, 0, Hold.tipo, Hold.nPos, Hold.color, 'hold_', false);
}



function mostrarSombra(lMostrar) {
	var col  = piezaActiva.col;
	var row  = piezaActiva.row;
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;

	if (lMostrar) {
		for (var n = row; n < nRows; n++) {
			if (!posicionValida(n, col, tipo, nPos)) {
				sombraRow = n-1;
				mostrarPieza(true, sombraRow, col, tipo, nPos, '', '', true);
				break;
			}
		}
	}else{
		mostrarPieza(false, sombraRow, col, tipo, nPos, '', '', true);
	}
}



function quitarLineas() {
	var tipo = piezaActiva.tipo;
	var nPos = piezaActiva.nPos;
	var row  = piezaActiva.row;
	var rowC = 0;
	var lCompleta;
	var lineas = tetriminos[tipo].posiciones[nPos].rows;
	var lineasQuitar = Array(0);
	var clase = '';
	for (var n = 0; n < lineas.length; n++) {
		rowC = row + lineas[n];
		lCompleta = true;
		for (var i = 0; i < nCols; i++) {
			if (aCuadros[rowC][i] == '') {
				lCompleta = false;
			}
		}
		if (lCompleta) {
			for(i = 0; i < nCols; i++) {
				if (rowC+1 < aCuadros.length) {	// Abajo
					aCuadros[rowC+1][i] = aCuadros[rowC+1][i].replace('u','');
				}
				if (rowC-1 > 0) {				// Arriba
					aCuadros[rowC-1][i] = aCuadros[rowC-1][i].replace('d','');
				}
			}
			lineasQuitar.push(rowC);
		}

	}
	for (n = 0; n < lineasQuitar.length; n++) {
		aCuadros.splice(lineasQuitar[n],1);
		aCuadros.unshift(new Array(nCols));
		for (i = 0; i < nCols; i++) {
			aCuadros[0][i] = '';
		}
	}

	if (lineasQuitar.length > 0) {
		var tdid;
		for (var x = 0; x < nRows; x++) {
			for (var y = 0; y < nCols; y++) {
				tdid = 'row'+x+'col'+y;
				get(tdid).className = aCuadros[x][y];
			}
		}
		var nuevasLineas = lineasQuitar.length;
		var nuevosPuntos = nuevasLineas*(nuevasLineas+1)*50;
		LINEAS += nuevasLineas;
		PUNTOS += nuevosPuntos;
		NIVEL = Math.floor((30 + LINEAS)/30);
		if (NIVEL > nivelmax) NIVEL = nivelmax;

		get('txtlineas').value = LINEAS;
		get('txtpuntos').value = PUNTOS;
		get('txtnivel').value  = NIVEL;
	}
}



function pausar(lPausa) {
	if (lPausa) {
		clearInterval(timer);
		EstadoJuego = 0;
		mostrarDialog(get('areahtml'), 'centroDialog');
		var oCentro = get('centroDialog');
		var h2 = dom('h2');
		var boton = dom('input');
		h2.innerHTML = 'Juego en Pausa';
		boton.type = 'submit';
		boton.className = 'boton';
		boton.value = 'Reanudar';
		boton.onclick = function() { pausar(false); };
		ins(oCentro, h2);
		ins(oCentro, boton);
	}else{
		del(get('dialog'));
		bajar();
		EstadoJuego = 1;
	}

}



function gameOver() {
	EstadoJuego = -1;
	clearInterval(timer);

	mostrarDialog(get('areahtml'), 'centroDialog');
	var oCentro = get('centroDialog');
	var h2 = dom('h2');
	var boton = dom('input');
	h2.innerHTML = 'Game Over';
	boton.type = 'submit';
	boton.className = 'boton';

	boton.value = 'Ok';
	boton.onclick = function() { window.history.go(); };
	ins(oCentro, h2);
	ins(oCentro, boton);
}


function KeyCheck(e) {
	var tecla = (window.event) ? event.keyCode : e.keyCode;

	if (EstadoJuego == 1) {

		if (tecla == teclas.ar)		   return piezaActiva.rotar();
		if (tecla == teclas.iz)		   return piezaActiva.mover(-1);
		if (tecla == teclas.de)		   return piezaActiva.mover(1);
		if (tecla == teclas.ab)		   return bajarRapido();
		if (tecla == teclas.espacio) return drop();
		if (tecla == teclas.ctrl)	   return cambiarHold();
		if (tecla == teclas.esc)	   return pausar(true)

	}else

	if (EstadoJuego == 0) {
		if (tecla == teclas.esc) {
			pausar(false);
		}
	}
}



