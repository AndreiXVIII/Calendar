<DOCTYPE HTML>
<html>
<head>
	<meta charset = "utf-8">
	<title> Календарь </title>	
	<style>
		#calendar-wrapper {
			text-align: center;
		}
		#calendar {
			display: inline-block;
			text-align: center;
		}
		#calendar td, #calendar th {
			padding: 10px;
			border: 1px solid black;
		}
		#calendar .nav, #calendar .info {
			text-align: center;
		}
		#calendar a {
			color: blue;
			font-size: 25px;
			text-decoration: none;
		}
		#calendar a:hover {
			color: red;
		}
	</style>
</head>
<body>
	<div id="calendar-wrapper">
		<div id="calendar">
			<div class="info" id="display"> </div>
			<table>
				<thead>
					<tr>
						<th> пн </th>
						<th> вт </th>
						<th> ср </th>
						<th> чт </th>
						<th> пт </th>
						<th> сб </th>
						<th> вс </th>
					</tr>
				</thead>
				<tbody id="parent">
				</tbody>
			</table>
			<div class="nav">
				<a href="#" id="prev"> &larr; </a>	
				<a href="#" id="next"> &rarr; </a>	
			</div>
		</div>
	</div>
<script>
	let parent = document.getElementById('parent');
	let display = document.getElementById('display');
	let prev = document.getElementById('prev');
	let next = document.getElementById('next');

	let date = new Date();	
	let year = date.getFullYear();
	let month = date.getMonth();

	//создает календарь
	function createCalendar(year, month) {
		let firstDay = getNumFirstDay(year, month);
		let lastDay = getNumLastDay(year, month);
		let emptyCellAtTheBeginning = howMuchToInsertAtTheBeginning(firstDay);
		let emptyCellAtTheEnd = howMuchToInsertAtTheEnd(lastDay);

		let calendarDaysArray = [];
		calendarDaysArray = daysInTheMonth();
		calendarDaysArray = unshiftToArrayOfDaysOfTheMonth(calendarDaysArray, emptyCellAtTheBeginning, '');
		calendarDaysArray = pushToArrayOfDaysOfTheMonth(calendarDaysArray, emptyCellAtTheEnd, '');
		calendarDaysArray = chunkArray(calendarDaysArray, 7);
		calendarDaysArray = transferToCalendar(calendarDaysArray, parent);

		showYearAndMonth(year, month, display);
	}

	//вызов функции, создающей календарь
	createCalendar(year, month);

	//возвращает массив с количеством дней в месяце
	function daysInTheMonth() {
		let arr = [];
		let lastDay = getLastDayOfMonth(year, month);
		
		for (let i = 1; i <= lastDay; i++) {
			arr.push(i);
		}
		return arr;	
	}

	//возвращает число последнего дня месяца  
	function getLastDayOfMonth(year, month) {
		let date = new Date(year, month + 1, 0);
		let lastDay = date.getDate();
		return lastDay;
	}

	//какой был день недели первого числа текущего месяца
	function getNumFirstDay(year, month) {
		let date = new Date(year, month, 1);
		let first = date.getDay();
		first = checkForTheDayOfTheWeek(first);
		return first; 
	}

	//какой последний день недели текущего месяца
	function getNumLastDay(year, month) {
		let date = new Date(year, month + 1, 0);
		let last = date.getDay();
		last = checkForTheDayOfTheWeek(last);
		return last;
	}

	//проверка на воскресенье, и меняем ему порядковый номер с 0 на 7
	function checkForTheDayOfTheWeek(numDay) {
		if (numDay == 0) {
			return 7;
		}
		return numDay;
	}

	//сколько вставляем пустых ячеек перед первым числом месяца
	function howMuchToInsertAtTheBeginning(num) {
		let emptyCell = num;
		return emptyCell - 1;
	}

	//сколько вставляем пустых ячеек после последнего числа месяца
	function howMuchToInsertAtTheEnd(num) {
		let emptyCell = num;
		return 7 - emptyCell;
	}

	//вставляем в начало массива пустые ячейки
	function unshiftToArrayOfDaysOfTheMonth(array, cells, elem) {
		for (let i = 0; i < cells; i++) {
			array.unshift(elem);
		}
		return array;
	}

	//вставляем в конец массива пустые ячейки
	function pushToArrayOfDaysOfTheMonth(array, cells, elem) {
		for (let i = 0; i < cells; i++) {
			array.push(elem);
		}
		return array;
	}

	//разбиваем массив на двумерный массив
	function chunkArray(arr, num) {
		let result = [];
		let chunk = [];
		let iterCount = arr.length / num;

		for (let i = 0; i < iterCount; i++) {
			chunk = arr.splice(0, num);
			result.push(chunk);
		}
		return result;
	}

	//вставляем эелементы массива в таблицу
	function transferToCalendar(arr, parent) {
		parent.innerHTML = '';
		for (let i = 0; i < arr.length; i++) {
			let tr = document.createElement('tr');
			for (let j = 0; j < arr[i].length; j++) {
				let td = document.createElement('td');
				td.innerHTML = arr[i][j];
				tr.appendChild(td);
			}
			parent.appendChild(tr);
		}
		return parent;
	}

	//показывает информацию, какой месяц и год выводится над календарем
	function showYearAndMonth(year, month, display) {
		let monthList = [
							'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
							'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
						];
		display.innerHTML = monthList[month] + ' ' + year;
	}

	//предыдущий месяц
	prev.onclick = function() {
		year = prevYear(year, month);
		month = prevMonth(month);

		createCalendar(year, month);
		highlightOfTheCurrentDay(year, month);
	}

	//следующий месяц
	next.onclick = function() {
		year = nextYear(year, month);
		month = nextMonth(month);

		createCalendar(year, month);
		highlightOfTheCurrentDay(year, month);
	}

	function prevYear(year, month) {
		if (month == 0) {
			return year - 1;
		}
		else {
			return year;
		}
	}

	function prevMonth(month) {
		if (month == 0) {
			return month = 11;
		} 
		else {
			return month - 1;
		}
	}

	function nextYear(year, month) {
		if (month == 11) {
			return year + 1;
		}
		else {
			return year;
		}
	}

	function nextMonth(month) {
		if (month == 11) {
			return month = 0;
		}
		else {
			return month + 1;
		}
	}

	//подсветка текущего дня
	function highlightOfTheCurrentDay(year, month) {
		let date = new Date();
		let today = date.getDate();
		let days = parent.getElementsByTagName('td');

		if (year == date.getFullYear() && month == date.getMonth()) {
			for (let i = 1; i <= days.length; i++) {
				if (today == days[i].innerHTML) {
					days[i].style.backgroundColor = '#01FFFF';
					break;
				}
			}
		}
	}

	highlightOfTheCurrentDay(year, month);

</script>
</body>
</html>