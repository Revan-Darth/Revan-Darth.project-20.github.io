// Burger
	const menuBurger = document.querySelector('.menu__burger');
	const menuBody = document.querySelector('.header__nav');
	if(menuBurger) {
		menuBurger.addEventListener('click', function (e) {
			document.body.classList.toggle('lock');
			menuBurger.classList.toggle('active');
			menuBody.classList.toggle('active');
		});
	}
// Filter
	const filterBtnOpen = document.querySelector('.catalog__filter-btn--open');
	const filterBtnClose = document.querySelector('.catalog__filter-btn--close');
	const filterMenu = document.querySelector('.catalog__sidebar');
	if(filterBtnOpen) {
		filterBtnOpen.addEventListener('click', function (e) {
			document.body.classList.add('lock');
			filterBtnOpen.classList.add('_active');
			filterMenu.classList.add('_active');
		});
	}
	if(filterBtnClose) {
		filterBtnClose.addEventListener('click', function (e) {
			document.body.classList.remove('lock');
			filterBtnClose.classList.remove('_active');
			filterMenu.classList.remove('_active');
		});
	}

// Tabs
	const tabsBtn = document.querySelectorAll('.photos-tabs__nav-btn');
	const tabsItems = document.querySelectorAll('.photos-tabs__item');

	tabsBtn.forEach(onTabClick);

	function onTabClick(item) {
		item.addEventListener('click', function() {
			let currentBtn = item;
			let tabId = currentBtn.getAttribute('data-tab');
			let currentTab = document.querySelector(tabId);

			if ( ! currentBtn.classList.contains('_active') ) {
				tabsBtn.forEach(function(item) {
					item.classList.remove('_active')
				});

				tabsItems.forEach(function(item) {
					item.classList.remove('_active')
				});

				currentBtn.classList.add('_active');
				currentTab.classList.add('_active');
			}
		});
	}


// Spolers
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных спойлеров
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных спойлеров
		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}

		// Получение спойлеров с медиа запросами
		const spollersMedia = Array.from(spollersArray).filter(function(item, index, self) {
			return item.dataset.spollers.split(",")[0];
		});

		// Инициализация спойлеров с медиа запросами
		if (spollersMedia.length > 0 ) {
			const breakpointsArray = [];
			spollersMedia.forEach( item => {
				const params      = item.dataset.spollers;
				const breakpoint  = {};
				const paramsArray = params.split(",");
				breakpoint.value  = paramsArray[0];
				breakpoint.type   = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item   = item;
				breakpointsArray.push(breakpoint);
			});

			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});

			// Работаем с каждым брейкопоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray 	  = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType 	  = paramsArray[2];
				const matchMedia 	  = window.matchMedia(paramsArray[0]);

				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Событие 
				matchMedia.addListener(function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}

		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}

		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}

		function setSpollerAction(e) {
			const el = e.target;
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_active');
					_slideToggle(spollerTitle.nextElementSibling, 500);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
			if (spollerActiveTitle) {
				spollerActiveTitle.classList.remove('_active');
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			}
		}
	}

	// =======================================================
	// SlideToggle
	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
	

// Range Slider
	const rangeSlider = document.getElementById('range-slider');

	if (rangeSlider) {
		noUiSlider.create(rangeSlider, {
		    start: [4765200, 8871500],
		    step: 25155,
		    connect: true,
		    range: {
		        'min': [4765200],
		        'max': [14295600]
		    }
		});

		const inputFirst = document.getElementById('range-slider_input-first');
		const inputSecond = document.getElementById('range-slider_input-second');
		const inputs = [inputFirst, inputSecond]

		rangeSlider.noUiSlider.on('update', function(values, handle) {
			inputs[handle].value = Math.round(values[handle])
		})

		const setRangeSlider = (i, value) => {
			let arr = [null, null];
			arr[i] = value;

			console.log(arr);
			rangeSlider.noUiSlider.set(arr);
		}

		inputs.forEach((el, index) => {
			el.addEventListener('change', (e) => {
				console.log(index);
				setRangeSlider(index, e.currentTarget.value);
			});
		});
	}

// Phone Mask
	document.addEventListener('DOMContentLoaded', function () {
		var phoneInputs = document.querySelectorAll('input[data-tel-input]');

		var getInputNumbersValue = function (input) {
			// Return stripped input value — just numbers
			return input.value.replace(/\D/g, '');
		}

		var onPhonePaste = function (e) {
			var input = e.target,
				inputNumbersValue = getInputNumbersValue(input);
			var pasted = e.clipboardData || window.clipboardData;

			if (pasted) {
				var pastedText = pasted.getData('Text');
				if (/\D/g.test(pastedText)) {
					// Attempt to paste non-numeric symbol — remove all non-numeric symbols,
	            	// formatting will be in onPhoneInput handler
	            	input.value = inputNumbersValue;
	            	return;
	            }
			}
		}

		var onPhoneInput = function (e) {
			var input = e.target,
			inputNumbersValue = getInputNumbersValue(input),
			selectionStart = input.selectionStart,
			formattedInputValue = "";

			if (!inputNumbersValue) {
				return input.value = '';
			}

			if (input.value.length != selectionStart) {
				// Editing in the middle of input, not last symbol
				if (e.data && /\D/g.test(e.data)) {
					// Attempt to input non-numeric symbol
					input.value = inputNumbersValue;
				}
				return;
			}
			if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
				if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
				var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
				formattedInputValue = input.value = firstSymbols + " ";
				if (inputNumbersValue.length > 1) {
					formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
				}
				if (inputNumbersValue.length >= 5) {
					formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
				}
				if (inputNumbersValue.length >= 8) {
					formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
				}
				if (inputNumbersValue.length >= 10) {
					formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
				}
			} else {
				formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
			}
			input.value = formattedInputValue;
		}
		var onPhoneKeyDown = function (e) {
			// Clear input after remove last symbol
			var inputValue = e.target.value.replace(/\D/g, '');
			if (e.keyCode == 8 && inputValue.length == 1) {
				e.target.value = '';
			}
		}
		for (var phoneInput of phoneInputs) {
				 phoneInput.addEventListener('keydown', onPhoneKeyDown);
				 phoneInput.addEventListener('input', onPhoneInput, false);
				 phoneInput.addEventListener('paste', onPhonePaste, false);
		}
	});

// Popup 
	const popupLinks = document.querySelectorAll('.popup-link');
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll('.lock-padding'); // Добавлять элементу, который багается при Lock'е

	let unlock = true;
	const timeout = 200; // Время выполнения transition, как и в CSS

	if (popupLinks.length > 0) {
		for (let index = 0; index < popupLinks.length; index++){
			const popupLink = popupLinks[index];
			popupLink.addEventListener('click', function (e){
				const popupName = popupLink.getAttribute('href').replace('#', '');
				const curentPopup = document.getElementById(popupName);
				popupOpen(curentPopup);
				e.preventDefault();
			});
		}
	}
	const popupCloseIcon = document.querySelectorAll('.popup__close');
	if (popupCloseIcon.length > 0){
		for (let index = 0; index < popupCloseIcon.length; index++){
			const el = popupCloseIcon[index];
			el.addEventListener('click', function (e) {
				popupClose(el.closest('.popup'));
				e.preventDefault();
			});
		}
	}
	function popupOpen(curentPopup) {
		if (curentPopup && unlock){
			const popupActive = document.querySelector('.popup.open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			curentPopup.classList.add('open');
			curentPopup.addEventListener('click', function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}
	function popupClose(popupActive, doUnlock = true) {
		if (unlock) {
			popupActive.classList.remove('open');
			if (doUnlock){
				bodyUnLock();
			}
		}
	}
	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
		if (lockPadding.length > 0){
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = lockPaddingValue;
			}
		}
		body.style.paddingRight = lockPaddingValue;
		body.classList.add('lock');
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	function bodyUnLock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				for (let index = 0; index < lockPadding.length; index++) {
					const el = lockPadding[index];
					el.style.paddingRight = '0px';
				}
			}
			body.style.paddingRight = '0px';
			body.classList.remove('lock');
		}, timeout);
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	document.addEventListener('keydown', function (e) {
		if (e.which === 27) {
			const popupActive = document.querySelector('.popup.open');
			popupClose(popupActive);
		}
	});

	(function () {
		if (!Element.prototype.closest) {
			Element.prototype.closest = function (css) {
				var node = this;
				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}
	})();
	(function () {
		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector;
		}
	})();

