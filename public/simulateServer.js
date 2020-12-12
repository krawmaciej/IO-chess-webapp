const testFunc = (move) => {
	const letters = ["a","b","c","d","e","f","g","h"];
	const numbers = ["7","6","5","4","3","2","1","0"];
	
	const text = {
		from: document.getElementById('from').value,
		to: document.getElementById('to').value
	};
	
	const proper = {
		fromLetter: letters.indexOf(text.from.substr(0,1).toLowerCase()),
		fromNumber: numbers[parseInt(text.from.substr(1,1))-1],
		toLetter: letters.indexOf(text.to.substr(0,1).toLowerCase()),
		toNumber: numbers[parseInt(text.to.substr(1,1))-1],
	};
	
	const properMove = {
		from: document.getElementById(proper.fromNumber + '_' + proper.fromLetter),
		to: document.getElementById(proper.toNumber + '_' + proper.toLetter)
	};
	
	//console.log(properMove);
	
	moviePieceWithoutChecking(properMove);
	
	document.getElementById('from').value = text.to;
	document.getElementById('to').value = "";
}
