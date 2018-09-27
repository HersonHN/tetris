function dom(foo) { return document.createElement(foo); }
function get(foo) { return document.getElementById(foo); }
function ins(foo, bar) {foo.appendChild(bar); return foo; }
function del(foo) {	var bar = foo.parentNode; bar.removeChild(foo); }
function trim(str) { return str.replace(/^\s*|\s*$/g,'');}
function aleatorio(array) { return array[Math.floor(array.length*Math.random())]; }


function mostrarDialog(oPadre, cIdCentro) {
	if (get('dialog') != null) return;
	
	var table = dom('table');
	var tbody = dom('tbody');
	var tr = dom('tr');
	var td = dom('td');
	var div = dom('div');
	
	div.className = 'oscuro';
	div.id = 'dialog';
	table.className = 'exp';
	td.className = 'exptd'
		
	ins(oPadre, div);
	ins(div, table);
	ins(table, tbody);
	ins(tbody, tr);
	ins(tr, td);
	
	table = dom('table');
	tbody = dom('tbody');
	table.className = 'borde';
	
	ins(td, table);
	ins(table, tbody);
	
	tr = new Array(3);
	td = new Array(9);	
	
	var nombres = 
		['escariz', 'escar',  'escarde',
		 'esciz',   'centro', 'escde',
		 'escabiz', 'escab',  'escabde'];
		
	for (var n = 0; n < 3; n++) {
		tr[n] = dom('tr');
		ins(tbody, tr[n]);
	}
	for (n = 0; n < 9; n++) {
		td[n] = dom('td');
		td[n].className = nombres[n];
		ins(tr[Math.floor(n/3)], td[n]);
	}
	
	td[4].id = cIdCentro;
	
}




