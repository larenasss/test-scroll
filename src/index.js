import "./scss/index.scss";
import noUiSlider from 'nouislider';

document.addEventListener('DOMContentLoaded', function () {
    (function () {
        function ScrollBox(container, nameEvent) {
            this.nameEvent = nameEvent;
            this.viewport = container.querySelector('.js-scroll-child');
            this.content = this.viewport.querySelector('.js-content-scroll');
            this.viewportHeight = this.viewport.offsetHeight;
            this.contentHeight = this.content.scrollHeight;
            this.max = this.viewport.clientHeight - this.contentHeight;
            this.ratio = this.viewportHeight / this.contentHeight;
            this.scrollerHeightMin = 25;
            this.step = 20;
            this.pressed = false;
        }

        const fn = ScrollBox.prototype;

        fn.init = function () {
            if (this.viewportHeight >= this.contentHeight) return;
            this.createScrollbar();
            this.registerEventsHandler();
        };

        fn.createScrollbar = function () {
            let scrollbar = document.createElement('div'),
                scroller = document.createElement('div');

            scrollbar.className = 'scrollbar';
            scroller.className = 'scroller';

            scrollbar.appendChild(scroller);
            this.viewport.appendChild(scrollbar);

            this.scroller = this.viewport.querySelector('.scroller');
            this.scrollerHeight = parseInt(this.ratio * this.viewportHeight);
            this.scrollerHeight = (this.scrollerHeight < this.scrollerHeightMin) ? this.scrollerHeightMin : this.scrollerHeight;
            this.scroller.style.height = this.scrollerHeight + 'px';
            this.scrollerMaxOffset = this.viewportHeight - this.scroller.offsetHeight;
        };

        fn.registerEventsHandler = function (e) {
            this.content.addEventListener('scroll', () => {
                this.scroller.style.top = (this.content.scrollTop * this.ratio) + 'px';
            });

            this.scroller.addEventListener('mousedown', e => {
                this.start = e.clientY;
                this.pressed = true;
            });
            /*
            document.addEventListener('mousemove', this.drop.bind(this));
            document.addEventListener('mouseup', () => this.pressed = false);
            */
        };

        fn.scroll = function (e) {
            e.preventDefault();
            let dir = -Math.sign(e.deltaY);
            let step = (Math.abs(e.deltaY) >= 3) ? this.step * dir : 0;

            this.content.style.top = (this.content.offsetTop + step) + 'px';
            if (this.content.offsetTop > 0) this.content.style.top = '0px';
            if (this.content.offsetTop < this.max) this.content.style.top = this.max + 'px';

            this.scroller.style.top = (-this.content.offsetTop * this.ratio) + 'px';
        };

        fn.drop = function (e) {
            e.preventDefault();
            if (this.pressed === false) return;

            let shiftScroller = this.start - e.clientY;
            this.scroller.style.top = (this.scroller.offsetTop - shiftScroller) + 'px';

            if (this.scroller.offsetTop <= 0) this.scroller.style.top = '0px';
            let totalHeight = this.scroller.offsetHeight + this.scroller.offsetTop;
            if (totalHeight >= this.viewportHeight) this.scroller.style.top = this.scrollerMaxOffset + 'px';

            let shiftContent = this.scroller.offsetTop / this.ratio;
            this.content.style.top = -shiftContent + 'px';
            this.start = e.clientY;
        };

        const containers = document.querySelectorAll('[data-control]');
        for (const container of containers) {
            let nameEvent = container.getAttribute('data-control');
            let scrollbox = new ScrollBox(container, nameEvent);
            scrollbox.init();
        }
    })();
    (function () {
        // Главный чекбокс
        function activateMaincheckbox() {
            const checkbox = $(".js-alert-complete");
            const alert = $(".js-alert");
            checkbox.on("change", function () {
                if (checkbox.checked) {
                    alert.addClass("alert-success");
                    alert.removeClass("alert-secondary");
                } else {
                    alert.addClass("alert-success");
                    alert.removeClass("alert-secondary");
                }
            });
        }

        function activateChangeBlock() {
            const btnChange = $("button[data-change], a[data-change]");
            
            btnChange.on('click', function (event) {
                
                event.preventDefault();
                const parent = $(this).closest("div[data-change='change-parent'], li[data-change='change-parent'], ul[data-change='change-parent']");
                const changeBlock = parent.find('div[data-change], li[data-change], ul[data-change]');
                const idBtn = $(this).attr("data-change");
                changeBlock.each(function (i, block) {
                    const jBlock = $(block);
                    const idBlock = jBlock.attr("data-change");
                    if (idBlock == idBtn) {
                        jBlock.show(20);
                    } else {
                        jBlock.hide(20);
                    }
                });
            });
        }

        //////////////////////////////////
        /// Функция табов (активируются через дата атрибуты)
        function activateTabs() {
            const tabButtons = $('button[data-tab], a[data-tab]');

            tabButtons.on('click', function (event) {
                event.preventDefault();
                const parent = $(this).closest("div[data-tab='tab-parent'], li[data-tab='tab-parent'], ul[data-tab='tab-parent']");
                const tabBlocks = parent.find('div[data-tab], li[data-tab], ul[data-tab]');
                const idBtn = $(this).attr("data-tab");
                tabBlocks.each(function (i, block) {
                    const jBlock = $(block);
                    const idBlock = jBlock.attr("data-tab");

                    if (idBlock == idBtn) {
                        jBlock.slideToggle();
                    } else {
                        jBlock.hide(20);
                    }
                });
                return;
            });
        }

        /////////////////////////////////////////
        ////// Группа чекбоксов
        function activateGroupCheckbox() {
            let mainCheckboxList = $('input[data-checkbox-main]');

            mainCheckboxList.on('change', function () {
                let parentCheckboxList = $(this).closest('div[data-checkbox-parent]').find('input[data-checkbox]');

                if ($(this).prop('checked')) {
                    parentCheckboxList.each(function (i, checkbox) {
                        checkbox.checked = true;
                    });
                } else {
                    parentCheckboxList.each(function (i, checkbox) {
                        checkbox.checked = false;
                    });
                }
            });

            let parentCheckboxList = $('input[data-checkbox]');

            parentCheckboxList.on('change', function () {
                let currentParentCheckbox = $(this).closest('div[data-checkbox-parent]');
                let currentMainCheckbox = currentParentCheckbox.find('input[data-checkbox-main]');
                let currentChildListCheckboxChecked = currentParentCheckbox.find('input[data-checkbox]:checked');

                if (!currentChildListCheckboxChecked.length) {
                    currentMainCheckbox.prop('checked', false);
                    return false;
                }

                if ($(this).prop('checked')) {
                    currentMainCheckbox.prop('checked', true);
                }
            });
        }

        /////////////////////////////////////////
        ////// Модальные окна
        function activateModal() {
            const btnOpen = $('button[data-modal-open], a[data-modal-open]');
            const btnClose = $('button[data-modal-close], a[data-modal-close]');
            const modalList = $('div[data-modal-id]');

            btnOpen.on('click', function (event) {
                event.preventDefault();
                console.log($(this))
                const currentModalId = $(this).attr("data-modal-open");
                modalList.each(function (i, item) {
                    const jItem = $(item);
                    const modalId = jItem.attr("data-modal-id");
                    if (currentModalId == modalId) {
                        jItem.addClass("d-block");
                        setTimeout(() => jItem.addClass("show"), 200);
                    } else {
                        jItem.removeClass("d-block");
                        jItem.removeClass("show");
                    }
                });
            });

            btnClose.on('click', function (event) {
                event.preventDefault();
                const currentModalId = $(this).attr("data-modal-close");
                modalList.each(function (i, item) {
                    const jItem = $(item);
                    const modalId = jItem.attr("data-modal-id");
                    if (currentModalId == modalId) {
                        setTimeout(() => jItem.removeClass("d-block"), 200);
                        jItem.removeClass("show");
                    } 
                });
            });
        }

        ///////////////////////
        activateMaincheckbox();
        activateChangeBlock();
        activateTabs();
        activateGroupCheckbox();
        activateModal();

        /////////////////////////////////////////
        /// Слайдер
        const slider = document.querySelector("#slider");

        noUiSlider.create(slider, {
            start: 40,
            connect: 'lower',
            range: {
                'min': 2000,
                '50%': 7500,
                'max': 13000
            },
            pips: {
                mode: 'range',
                density: 3
            }
        });

        slider.noUiSlider.on('update', function (values, handle) {
            document.querySelector("#slider-value").value = Math.floor(values[handle]);
        });

        $('.dropdown-menu_card li, .dropdown-menu_card').on("click", function (e) {
            e.stopPropagation();
        });
    })();
});

