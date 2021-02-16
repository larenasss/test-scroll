import "./scss/index.scss";
import noUiSlider from 'nouislider';

document.addEventListener('DOMContentLoaded', function() {
  (function() {
    function ScrollBox(container, nameEvent) {
      // имя события прокрутки
      this.nameEvent = nameEvent;
      // родительский элемент в котором находится контент и скроллбар
      this.viewport = container.querySelector('.js-scroll-child');
      // элемент с контентом
      this.content = this.viewport.querySelector('.js-content-scroll');
      // высоты полученных элементов
      this.viewportHeight = this.viewport.offsetHeight;
      this.contentHeight = this.content.scrollHeight;
      // возможная максимальная прокрутка контента, имеет отрицательное
      // значение, т.к. контент позиционируется относительно верхнего
      // края вьюпорта и при прокрутке расположен над ним
      this.max = this.viewport.clientHeight - this.contentHeight;
      // соотношение между высотами вьюпорта и контента
      this.ratio = this.viewportHeight / this.contentHeight;
      // минимальная высота ползунка скроллбара
      this.scrollerHeightMin = 25;
      // шаг прокручивания контента при наступлении события 'wheel'
      this.step = 20;
      // флаг нажатия на левую кнопку мыши
      this.pressed = false;
    }
     
    // для сокращения записи, создадим переменную, которая будет ссылаться
    // на прототип 'ScrollBox'
    const fn = ScrollBox.prototype;
  
    fn.init = function() {
      // если высота контента меньше или равна высоте вьюпорта,
      // выходим из функции
      if (this.viewportHeight >= this.contentHeight) return;
      // формируем полосу прокрутки и ползунок
      this.createScrollbar();
      // устанавливаем обработчики событий
      this.registerEventsHandler();
    };
  
    fn.createScrollbar = function() {
      // создаём новые DOM-элементы DIV из которых будет
      // сформирован скроллбар
      let scrollbar = document.createElement('div'),
        scroller = document.createElement('div');
     
      // присваиваем созданным элементам соответствующие классы
      scrollbar.className = 'scrollbar';
      scroller.className = 'scroller';
     
      // вставляем созданные элементы в document
      scrollbar.appendChild(scroller);
      this.viewport.appendChild(scrollbar);
     
      // получаем DOM-объект ползунка полосы прокрутки, вычисляем и
      // устанавливаем его высоту
      this.scroller = this.viewport.querySelector('.scroller');
      this.scrollerHeight = parseInt(this.ratio * this.viewportHeight);
      this.scrollerHeight = (this.scrollerHeight < this.scrollerHeightMin) ? this.scrollerHeightMin : this.scrollerHeight;
      this.scroller.style.height = this.scrollerHeight + 'px';
      // вычисляем максимально возможное смещение ползунка от верхней границы вьюпорта
      // это смещение зависит от высоты вьюпорта и высоты самого ползунка
      this.scrollerMaxOffset = this.viewportHeight - this.scroller.offsetHeight;
    };
  
    fn.registerEventsHandler = function(e) {
      // вращение колёсика мыши
  
        this.content.addEventListener('scroll', () => {
          this.scroller.style.top = (this.content.scrollTop * this.ratio) + 'px';
        });
  
     
      // нажатие на левую кнопку мыши
      this.scroller.addEventListener('mousedown', e => {
        // координата по оси Y нажатия левой кнопки мыши
        this.start = e.clientY;
        // устанавливаем флаг, информирующий о нажатии левой кнопки мыши
        this.pressed = true;
      });
     
      // перемещение мыши
      document.addEventListener('mousemove', this.drop.bind(this));
     
      // отпускание левой кнопки мыши
      document.addEventListener('mouseup', () => this.pressed = false);
    };
  
    fn.scroll = function(e) {
      e.preventDefault();
      // направление вращения колёсика мыши
      let dir = -Math.sign(e.deltaY);
      // шаг прокручивания контента, в зависимости от прокручивания
      // колёсика мыши
      let	step = (Math.abs(e.deltaY) >= 3) ? this.step * dir : 0;
     
      // управляем позиционированием контента
      this.content.style.top = (this.content.offsetTop + step) + 'px';
      // ограничиваем прокручивание контента вверх и вниз
      if (this.content.offsetTop > 0) this.content.style.top = '0px';
      if (this.content.offsetTop < this.max) this.content.style.top = this.max + 'px';
     
      // перемещаем ползунок пропорционально прокручиванию контента
      this.scroller.style.top = (-this.content.offsetTop * this.ratio) + 'px';
    };
  
    fn.drop = function(e) {
      e.preventDefault();
      // если кнопка мыши не нажата, прекращаем работу функции
      if (this.pressed === false) return;
     
      // величина перемещения мыши
      let shiftScroller = this.start - e.clientY;
      // изменяем положение бегунка на величину перемещения мыши
      this.scroller.style.top = (this.scroller.offsetTop - shiftScroller) + 'px';
     
      // ограничиваем перемещение ползунка по верхней границе вьюпорта
      if (this.scroller.offsetTop <= 0) this.scroller.style.top = '0px';
      // ограничиваем перемещение ползунка по нижней границе вьюпорта
      // сумма высоты ползунка и его текущего отступа от верхней границы вьюпорта
      let	totalHeight = this.scroller.offsetHeight + this.scroller.offsetTop;
      if (totalHeight >= this.viewportHeight) this.scroller.style.top = this.scrollerMaxOffset + 'px';
     
      // расстояние, на которую должен переместиться контент
      // это расстояние пропорционально смещению ползунка
      let	shiftContent = this.scroller.offsetTop / this.ratio;
      // прокручиваем контент на величину пропорциональную перемещению ползунка,
      // она имеет обратный знак, т.к. ползунок и контент прокручиваются
      // в противоположных направлениях
      this.content.style.top = -shiftContent + 'px';
     
      // устанавливаем координату Y начала движения мыши равной текущей координате Y
      this.start = e.clientY;
    };
    
    // выбираем все блоки на странице, в которых может понадобиться
    // прокрутка контента
    const containers = document.querySelectorAll('[data-control]');
    // перебираем полученную коллекцию элементов
    for (const container of containers) {
      // имя события, используемого для прокручивания контента
      let nameEvent = container.getAttribute('data-control');
      // с помощью конструктора 'ScrollBox' создаём экземпляр объекта,
      // в котором будем прокручивать контент
      let scrollbox = new ScrollBox(container, nameEvent);
      // создание скроллбара, исходя из полученных в конструкторе высот
      // контента и вьюпорта текущего блока, регистрация обработчиков событий
      scrollbox.init();
    }

    const checkbox = document.querySelector(".js-alert-complete");
    const alert = document.querySelector(".js-alert");
    checkbox.addEventListener("change", function() {
      if(checkbox.checked) {
        alert.classList.add("alert-success");
        alert.classList.remove("alert-secondary");
      } else {
        alert.classList.remove("alert-success");
        alert.classList.add("alert-secondary");
      }
    });
    
    function showAndHideBlock(show, hide) {
      if(!show || !hide) return;
      $(show).show(20);
      $(hide).hide(20);
    }

    function toogleBlock(btn) {
      $(btn).closest(".js-toogle-parent").siblings(".js-toogle-block").slideToggle(200);
    }

    $(".js-btn-show-form").on("click", function() {
      const contentHide = $(this).closest(".js-show-content");
      const contentShow = contentHide.next(".js-show-form");
      
      showAndHideBlock(contentShow, contentHide);
    });

    $(".js-btn-hide-form").on("click", function() {
      const contentHide = $(this).closest(".js-show-form");
      const contentShow = contentHide.prev(".js-show-content");
      
      showAndHideBlock(contentShow, contentHide);
    });

    $(".js-btn-save-form").on("click", function() {
      const contentHide = $(this).closest(".js-show-form");
      const contentShow = contentHide.prev(".js-show-content");
      
      showAndHideBlock(contentShow, contentHide);
    });

    $(".js-btn-toogle-block").on("click", function() {
      toogleBlock($(this));
    });

    var slider = document.getElementById('slider');

    noUiSlider.create(slider, {
      start: 40,
      connect: 'lower',
      range: {
          'min': 2000,
          'max': 13000
      },
    });

  })();
  
});

