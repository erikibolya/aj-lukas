jQuery(document).ready(function ($) {

    $('input:radio[name=jobLocation]').change(function () {
        var input = $(this);
        if (this.value == 'work') {
            $(".show-content__wrapper").find(".show-content__content").show();
            $(".travel-input__wrapper").find(".travel-input__content").hide();
        } else if (this.value == 'remote') {
            $(".show-content__wrapper").find(".show-content__content").hide();
            $(".travel-input__wrapper").find(".travel-input__content").show();
        } else {
            $(".show-content__wrapper").find(".show-content__content").hide()
            $(".travel-input__wrapper").find(".travel-input__content").hide();
        }
    });

    setTimeout(function () {
        if (window.pageYOffset !== 0)
            return;
        window.scrollTo(0, window.pageYOffset + 1);

    }, 1000);

    checkedRadios();
});


$('input:radio[name=jobLocation]').change(function () {
    var input = $(this);
    if (this.value == 'work') {
        $(".show-content__wrapper").find(".show-content__content").show();
    } else {
        $(".show-content__wrapper").find(".show-content__content").hide();
    }
});

//změnit na nativní pomocí css?
$(".btn-collapse-toggle").click(function () {
    var children = $(this).find(".svgicon");

    if (children.hasClass("svgicon--flip-v")) {
        children.each(function () {
            children.removeClass("svgicon--flip-v");
        });
    } else {
        children.each(function () {
            children.addClass("svgicon--flip-v");
        });
    }
});



//změnit?
$(".custom-radio__wrapper").click(function () {
    var parent = $(this);
    radioWrapper = parent;
    var input = $(this).find("input.form-check-input");
    var checkedClass = "custom-radio__wrapper--checked";
    input.prop("checked", true);
    parent.siblings().removeClass(checkedClass);
    if (input.is(':checked')) {
        parent.addClass(checkedClass);
    }
});

//změnit?
function checkedRadios() {
    var input = $("input.form-check-input");
    var parentClass = ".custom-radio__wrapper";
    var checkedClass = "custom-radio__wrapper--checked";

}

//$(".switch__wrapper").click(function () {
//    var parent = $(this);
//    radioWrapper = parent;
//    var input = $(this).find("input.switch__state");
//    var checkedClass = "switch__wrapper--checked";
//
//    if (input.is(':checked')) {
//        input.prop("checked", false);
//        parent.removeClass(checkedClass);
//    } else {
//        input.prop("checked", true);
//        parent.addClass(checkedClass);
//    }
//})






//selectboxy všechny
$('[data-selectric]').selectric({
    maxHeight: 210,
    onChange: function (element) {
        $(element).change();
    }
});

//selectbox s vlajkama
$('[data-selectric-flags]').selectric({
    customClass: {
        prefix: 'selectric-flag'
    },
    optionsItemBuilder: function (data) {
        let flag = "public/svg/flags/" + data.element[0].getAttribute("data-ico") + ".svg";
        return "<span class='selectric-flag-itemwrapper'><img class='selectric-flag-img' src='" + flag + "'><span class='selectric-flag-text'>{text}</span></span>";
    },
    labelBuilder: function (data) {
        let placeholder = data.element[0].getAttribute("data-placeholder");
        let flag = "public/svg/flags/" + data.element[0].getAttribute("data-ico") + ".svg";
        return "<span class='selectric-flag-labelwrapper'><img class='selectric-flag-img' src='" + flag + "'></span>";
    }
});


//selectbox disable stav, pokud se zvolí určitá možnost
$("[data-disable-on-select]").on("change", function (event, element, instance) {
    let targetValue = $(this).attr("data-disable-on-select");
    let targetID = $(this).attr("data-disable-target");
    if ($(this).val() === targetValue) {
        $("#" + targetID).attr("disabled", "disabled").selectric('refresh');
        return;
    } else {
        $("#" + targetID).removeAttr("disabled").selectric('refresh');
    }

});

//selectric změna přidružených polí podle selectu
$("[data-contact]").on("change", function (event) {
    let targetPhone = $(this).attr("data-phone-target");
    let targetEmail = $(this).attr("data-email-target");
    let currentVal = $(this).val();
    let items = event.target;
    for (let i = 0, max = items.length; i < max; i++) {
        if (items[i].value === currentVal) {
            $("#" + targetPhone).val(items[i].getAttribute("data-phone"));
            $("#" + targetEmail).val(items[i].getAttribute("data-email"));
            return;
        }
    }
});


$(".menu__toggler").click(function () {
    $(".menu__list").slideToggle("fast");
})



