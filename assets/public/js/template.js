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






