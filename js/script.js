$(document).ready(function () {
  $(".header-text-sl").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    speed: 350,
    autoplay: true,
    autoplaySpeed: 3000,
  });
});
// burger-btn
$(".header-burger").on("click", function (e) {
  e.preventDefault;
  $(this).toggleClass("header-burger__active");
});
$(".header-burger").click(function (e) {
  // Ищем кнопку, при нажатии на которою будет открываться наше меню
  e.preventDefault; // Для того что бы отменить дефолтный href, что бы не отбрасывало на вверх
  $(".header-head__navigation").toggleClass("show"); // добавляем класс с дисплей блок
});
$(".header-burger").click(function (e) {
  // Ищем кнопку, при нажатии на которою будет открываться наше меню
  e.preventDefault; // Для того что бы отменить дефолтный href, что бы не отбрасывало на вверх
  $(".burger-back").toggleClass("show"); // добавляем класс с дисплей блок
});
$(".header-burger").click(function (e) {
  // Ищем кнопку, при нажатии на которою будет открываться наше меню
  e.preventDefault; // Для того что бы отменить дефолтный href, что бы не отбрасывало на вверх
  $(".header-head__package").toggleClass("show"); // добавляем класс с дисплей блок
});
// ---------------------------------------------------------------------
// content.html
// sliders
$(function () {
  var $propertiesForm = $(".mall-category-filter");
  var $body = $("body");

  $body.on("click", ".js-mall-filter", function () {
    var $input = $(this).find("input");
    $(this).toggleClass("mall-filter__option--selected");
    $input.prop("checked", !$input.prop("checked"));
    $propertiesForm.trigger("submit");
  });
  $body.on("click", ".js-mall-clear-filter", function () {
    var $parent = $(this).closest(".mall-property");

    $parent.find(':input:not([type="checkbox"])').val("");
    $parent.find('input[type="checkbox"]').prop("checked", false);
    $parent
      .find(".mall-filter__option--selected")
      .removeClass("mall-filter__option--selected");

    var slider = $parent.find(".mall-slider-handles")[0];
    if (slider) {
      slider.noUiSlider.updateOptions({
        start: [slider.dataset.min, slider.dataset.max],
      });
    }
    $propertiesForm.trigger("submit");
  });

  $propertiesForm.on("submit", function (e) {
    e.preventDefault();

    $.publish("mall.category.filter.start");
    $(this).request("categoryFilter::onSetFilter", {
      loading: $.oc.stripeLoadIndicator,
      complete: function (response) {
        $.oc.stripeLoadIndicator.hide();
        if (response.responseJSON.hasOwnProperty("queryString")) {
          history.replaceState(
            null,
            "",
            "?" + response.responseJSON.queryString
          );
        }
        $("[data-filter]").hide();
        if (response.responseJSON.hasOwnProperty("filter")) {
          for (var filter of Object.keys(response.responseJSON.filter)) {
            $('[data-filter="' + filter + '"]').show();
          }
        }
        $.publish("mall.category.filter.complete");
      },
      error: function () {
        $.oc.stripeLoadIndicator.hide();
        $.oc.flashMsg({
          text: "Fehler beim Ausführen der Suche.",
          class: "error",
        });
        $.publish("mall.category.filter.error");
      },
    });
  });

  $(".mall-slider-handles").each(function () {
    var el = this;
    noUiSlider
      .create(el, {
        start: [el.dataset.start, el.dataset.end],
        connect: true,
        tooltips: true,
        range: {
          min: [parseFloat(el.dataset.min)],
          max: [parseFloat(el.dataset.max)],
        },
        pips: {
          mode: "range",
          density: 20,
        },
      })
      .on("change", function (values) {
        $('[data-min="' + el.dataset.target + '"]').val(values[0]);
        $('[data-max="' + el.dataset.target + '"]').val(values[1]);
        $propertiesForm.trigger("submit");
      });
  });
});

window.setTimeout(function () {
  $(".preloader").addClass("hide");
}, 3500);
