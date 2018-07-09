'use strict';

(function () {

	/**
	 * Получаем случайно число из интервала [min, max]
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}
	 */
	var getRandomNumberFromInterval = function (min, max) {
		var number = Math.floor((Math.random() * (max + 1 - min) + min));
		return number;
	};

	/**
	 * Получаем случайный rgb цвет
	 * @return {String} 
	 */
	var getRandomColor = function () {
		var color = `rgb(${getRandomNumberFromInterval(0, 255)}, ${getRandomNumberFromInterval(0, 255)}, ${getRandomNumberFromInterval(0, 255)})`;
		return color;
	};

	/**
	 * Получаем случайный элемент массива
	 * @param  {Array} array
	 * @return {Any}
	 */
	var getRandomArrayElement = function (array) {
		var index = getRandomNumberFromInterval(0, array.length - 1);
		return array[index];
	};

	var menu = document.querySelector('.menu');
	var menuItems = document.querySelectorAll('.menu__item');

	/**
	 * Находим элемент с активным классом и удаляем активный класс
	 */
	var removeActiveClass = function () {
		menuItems.forEach( (item) => {
			if (item.classList.contains('menu__item--active')) {
				item.classList.remove('menu__item--active');
			}
		});
	};
	var isDifficult = false;

	/**
	 * Устанавливаем сложность игры в зависимости от нажатой кнопки
	 * @param {target} target [description]
	 */
	var setDifficulty = function (target) {
		if (target.classList.contains('menu__item--hard')) {
				isDifficult = true;
		}		

		if (target.classList.contains('menu__item--easy')) {
				isDifficult = false;
		}
	};

	/**
	 * Добавляем активный класс на тот уровень сложности, который выбран
	 */
	var setActiveDifficulty = function () {
		
		if (isDifficult) {
		var menuItemHard = document.querySelector('.menu__item--hard');
		if (!menuItemHard.classList.contains('menu__item--active')) {
			menuItemHard.classList.add('menu__item--active');
		}
		} else {
			var menuItemEasy = document.querySelector('.menu__item--easy');
			if (!menuItemEasy.classList.contains('menu__item--active')) {
				menuItemEasy.classList.add('menu__item--active');	
			}
		}
	};

	menu.addEventListener('click', (clickEvt) => {
		var target = clickEvt.target;
		if (target.tagName.toLowerCase() === 'li') {
			removeActiveClass();
			target.classList.add('menu__item--active');
			setDifficulty(target);
			startGame(false);
		}
	});

	/**
	 * Проверяем есть ли сообщение, возвращаем true/falses
	 * @return {Boolean}
	 */
	var checkNode = function () {
		var currentErrorNode = document.querySelector('.menu__item--error');
		return currentErrorNode ? true : false;
	};

	/**
	 * Если есть окно с ошибкой, то удаляем его
	 */
	var removeNode = function () {
		var currentErrorNode = document.querySelector('.menu__item--error');
		if (checkNode()) {
			menu.removeChild(currentErrorNode);
			currentErrorNode.removeEventListener('click', NodeClickHandler);
		}
	};

	/**
	 * При клике на сообщение ошибки перезапускаем игру
	 */
	var NodeClickHandler = function () {
		startGame(false);
	};
	/**
	 * Отрисовываем текст message на экран в меню. При клике на него, начинаем игру заново
	 * @param  {String} message

	 */
	var showMessage = function (message) {
		removeNode();
		var Message = message;
		var Node = document.createElement('li');
		Node.classList.add('menu__item');
		Node.classList.add('menu__item--error');
		Node.textContent = Message;
		Node.style.marginRight = '50px';

		menu.insertBefore(Node, document.querySelector('.menu__item:nth-child(2)'));
		Node.addEventListener('click', NodeClickHandler);
	};


	var squares = document.querySelectorAll('.square');

	/**
	 * Раскрашиваем квадраты
	 */
	var setSquareColors = function (isIdentical, identicalColor) {
		if (isIdentical) {
			squares.forEach( (square) => {
				square.style.backgroundColor = identicalColor;
			});
		} else {
			squares.forEach( (square) => {
				square.style.backgroundColor = getRandomColor();
			});
		}
	};

	var pageHeader = document.querySelector('.page-header');
	var defaultPageHeaderColor = pageHeader.style.backgroundColor;
	/**
	 * Показываем все скрытые квадраты
	 */
	var showAllSquares = function (isWin, headerColor) {
		if (isWin) {
			pageHeader.style.backgroundColor = headerColor;
		}
		squares.forEach( (square) => {
			if (square.classList.contains('square--fadeout')) {
				square.classList.remove('square--fadeout');
			}
		});
	};

	/*Вешаем на контейнер обработчик клика. Если текущий квадрат не соответствует угадываемую
	цвету, то мы его скрываем и показываем текст с ошибкой, при клике на который начинается игра
	заново*/
	var containerClickHandler = function (evt)  {
		if (isDifficult && checkNode()) {
			container.removeEventListener('click', containerClickHandler);
		} else {
				var target = evt.target;
				if (target.tagName.toLowerCase() === 'td') {
					var squareColor = target.style.backgroundColor;
					if (squareColor !== currentColor) {
						target.classList.add('square--fadeout');
						var errorMessage = 'Try again!';
						showMessage(errorMessage);
					} else {
						var successMessage = 'Correct!';
						showMessage(successMessage);
						showAllSquares(true, squareColor);
						setSquareColors(true, squareColor);
					}
				}
			}
		};

	var container = document.querySelector('.container');
	var currentColor; 
	/**
	 * Получаем коллекцию из квадратов и раскрашиваем их в случайные цвета. Если не isFirst,
	 * то удаляем то, что могло быть сделано в процессе игры(классы, непрозрачность возвращаем)
	 * @param  {Boolean} isFirst
	 */
	var startGame = function (isFirst) {
		if (!isFirst) {
			showAllSquares();
			removeNode();
			pageHeader.style.backgroundColor = defaultPageHeaderColor;
			setActiveDifficulty();
		}
		setSquareColors();
		container.addEventListener('click', containerClickHandler);
		/*Сохраняем  цвет случайного квадрата в переменную и записываем его в заголовок. Этот цвет надо
		угадать*/
		var pickedElement = getRandomArrayElement(squares);
		currentColor = pickedElement.style.backgroundColor;
		var currentColorHeader = document.querySelector('.current-color');
		currentColorHeader.innerText = currentColor;
	};

	/*Начинаем игру*/
	startGame(true);

	/*При клике на newColors возвращаем все в начало и меняем цвета*/
	var newColors = document.querySelector('.new-colors');
	newColors.addEventListener('click', () => {
		startGame(false);
	});



})();