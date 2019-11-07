var scrollSupport = hasWebkitOverflowScrollingSupport();
var autocompletes = document.querySelectorAll(".autocomplete--search");
var tagAutocompletes = document.querySelectorAll(".autocomplete--tag");
var breakpoint = 700;
var scrollPosition = 0;


function hasWebkitOverflowScrollingSupport() {
    var testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
    testDiv.style.WebkitOverflowScrolling = 'touch';
    var scrollSupport = window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
    document.body.removeChild(testDiv);
    return scrollSupport;
}

function isBelowBreakpoint(breakpoint) {
    return $(window).width() < breakpoint;
}

function enableNoBounce() {
    if (scrollSupport) {
        iNoBounce.enable();
    }
    $("body").addClass("modal-open");
}

function disableNoBounce() {
    iNoBounce.disable();
    $("body").removeClass("modal-open");
}

function focusAutocompleteInput($element) {
    $element.addClass("autocomplete__input--focus");
    $element.removeClass("autocomplete__input--blur");
}

function blurAutocompleteInput($element) {
    $element.addClass("autocomplete__input--blur");
    $element.removeClass("autocomplete__input--focus");
}

function isAutoCompleteInFullScreenMode($autocomplete) {
    return $autocomplete.hasClass("autocomplete--fullscreen");
}

function isAutoCompleteInWindow($autocomplete) {
    return $autocomplete.hasClass("autocomplete--inwindow");
}

function showAutocomplete($autocomplete) {
    $autocomplete.addClass("autocomplete--fullscreen");
}

function hideAutocomplete($autocomplete) {
    $autocomplete.removeClass("autocomplete--fullscreen");
}

function saveBodyScrollPosition() {
    scrollPosition = $("body").scrollTop();
}

function restoreBodyScrollPosition() {
    if (scrollPosition !== 0) {
        $("body").scrollTop(scrollPosition);
        scrollPosition = 0;
    }
}

disableNoBounce();

$(window).on('shown.bs.modal', function (e) {
    $(e.target).children(".modal-custom-dialog").scrollTop(0);
    enableNoBounce();
});

$(window).on('hidden.bs.modal', function (e) {
    disableNoBounce();
});

$(".autocomplete__input").on("click", function () {
    var input = $(this);
    var atc = input.closest(".autocomplete");
    if (!isAutoCompleteInFullScreenMode(atc)) {
        if (isBelowBreakpoint()) {
            if (isAutoCompleteInWindow(atc)) {
                atc.closest(".modal").addClass("modal--innerwindow");
            } else {
                saveBodyScrollPosition();
            }
            input.blur();
            showAutocomplete(atc);
            input.focus();
            enableNoBounce();
        }
    }
});

$(".autocomplete__input").on("focus", function () {
    focusAutocompleteInput($(this));
});

$(".autocomplete__input").on("blur", function () {
    if (!$(this).closest(".autocomplete").hasClass("autocomplete--fullscreen")) {
        blurAutocompleteInput($(this));
    }
});

$("[data-autocomplete-close]").on("click", function () {
    var atc = $(this).closest(".autocomplete");
    var input = atc.children(".autocomplete__input");

    hideAutocomplete(atc);
    blurAutocompleteInput($(input));

    if (!isAutoCompleteInWindow(atc)) {
        restoreBodyScrollPosition();
        disableNoBounce();
    } else {

        atc.closest(".modal").removeClass("modal--innerwindow");
    }
});

for (var i = 0, max = autocompletes.length; i < max; i++) {
    let element = autocompletes[i];
    let input = element.querySelector(".autocomplete__input");
    let placeholder = input.getAttribute("data-placeholder");
    let selector = "#" + input.id;
    let dataset = input.getAttribute("data-dataset");
    let noresult = input.getAttribute("data-noresult");
    let autocompelte = new autoComplete({
        placeHolder: placeholder, // Place Holder text                 | (Optional)
        selector: selector, // Input field selector              | (Optional)
        threshold: 0, // Min. Chars length to start Engine | (Optional)
        debounce: 300, // Post duration for engine to start | (Optional)
        searchEngine: "strict", // Search Engine type/mode           | (Optional)
        highlight: true,
        maxResults: 60,
        trigger: [],
        data: {
            src: function () {
//                const source = fetch("/public/js/plugins/" + dataset);
//                const data = source.json();
//                return data;
            }
        },
        sort: function (a, b) {
            return 0;
        },
        resultsList: {
            render: true,
            container: function (source) {
                source.id = selector + "-results";
                source.setAttribute("class", "autocomplete__results");
                $(source).on("click touchmove", function () {
                    $(input).blur();
                });
            },
            destination: document.querySelector(selector),
            position: "afterend",
            element: "div"
        },
        resultItem: {
            content: function (data, source) {
                source.innerHTML = data.match;
                source.classList.add("autocomplete__result");
            },
            element: "div",
        },
        onSelection: function (feedback) {
            alert("ha");
            const selection = feedback.selection.value;
            // Render selected choice to selection div
            $element = $(element);
            $input = $(input);
            blurAutocompleteInput($input);

            hideAutocomplete($element);

            if (!isAutoCompleteInWindow($element)) {
                disableNoBounce();
                restoreBodyScrollPosition();
            } else {
                $element.closest(".modal").removeClass("modal--innerwindow");
            }

            document.querySelector(selector).value = selection;
//            console.log(document.querySelector(selector + "-results"));
//            document.querySelector(selector + "-results").innerHTML = "";

        },

    });
    console.log(autocompelte);


}

for (var i = 0, max = tagAutocompletes.length; i < max; i++) {
    let element = tagAutocompletes[i];
    let input = element.querySelector(".autocomplete__input");
    let placeholder = input.getAttribute("data-placeholder");
    let preview = input.hasAttribute("data-preview");
    let placeholderFilled = input.getAttribute("data-placeholder-filled");
    let selector = "#" + input.id;
    let dataset = input.getAttribute("data-dataset");
    let noresult = input.getAttribute("data-noresult");

    let predata = [];
    console.log(preview);
    if (preview) {
        predata = categories;
    }

    let options = {
        silent: false,
        choices: predata,
        removeItemButton: true,
        duplicateItemsAllowed: true,
        paste: true,
        searchFloor: -1,
        searchChoices: false,
        shouldSort: false,
        position: 'auto',
        placeholder: true,
        placeholderValue: placeholder,
        loadingText: 'Loading...',
        itemSelectText: '',
        noResultsText: noresult,
        addItemText: function (value) {
            return "Press Enter to add <b>" + value + "</b>";
        },
        callbackOnCreateTemplates: function (template) {
            return {
                choice: function (classes, data, itemSelectText) {
                    const role = data.groupId > 0 ? 'role="treeitem"' : 'role="option"';
                    const icons = {
                        "company": '<svg class="svgicon svgicon--textcolor svgicon--small" viewBox="0 0 20 20"><path class="svgicon__path" d="M16.3,0.3H3.8c-0.3,0-0.5,0.2-0.5,0.5v18.5c0,0.3,0.2,0.5,0.5,0.5h4.6h3.4h4.5c0.3,0,0.5-0.2,0.5-0.5V0.8 C16.8,0.5,16.5,0.3,16.3,0.3z M8.9,18.8v-5.1h2.4v5.1H8.9z M15.8,18.8h-3.5v-5.6c0-0.3-0.2-0.5-0.5-0.5H8.4c-0.3,0-0.5,0.2-0.5,0.5 v5.6H4.3V1.3h11.5V18.8z"></path><path class="svgicon__path" d="M6.2,4.5h0.6C6.9,4.5,7,4.4,7,4.3V3.7c0-0.1-0.1-0.2-0.2-0.2H6.2C6.1,3.5,6,3.6,6,3.7v0.6 C6,4.4,6.1,4.5,6.2,4.5z"></path><path class="svgicon__path" d="M13.2,4.5h0.6c0.1,0,0.2-0.1,0.2-0.2V3.7c0-0.1-0.1-0.2-0.2-0.2h-0.6c-0.1,0-0.2,0.1-0.2,0.2v0.6 C13,4.4,13.1,4.5,13.2,4.5z"></path><path class="svgicon__path" d="M9.7,4.5h0.6c0.1,0,0.2-0.1,0.2-0.2V3.7c0-0.1-0.1-0.2-0.2-0.2H9.7c-0.1,0-0.2,0.1-0.2,0.2v0.6 C9.5,4.4,9.6,4.5,9.7,4.5z"></path><path class="svgicon__path" d="M6.2,7.5h0.6C6.9,7.5,7,7.4,7,7.3V6.7c0-0.1-0.1-0.2-0.2-0.2H6.2C6.1,6.5,6,6.6,6,6.7v0.6 C6,7.4,6.1,7.5,6.2,7.5z"></path><path class="svgicon__path" d="M13.2,7.5h0.6c0.1,0,0.2-0.1,0.2-0.2V6.7c0-0.1-0.1-0.2-0.2-0.2h-0.6c-0.1,0-0.2,0.1-0.2,0.2v0.6 C13,7.4,13.1,7.5,13.2,7.5z"></path><path class="svgicon__path" d="M9.7,7.5h0.6c0.1,0,0.2-0.1,0.2-0.2V6.7c0-0.1-0.1-0.2-0.2-0.2H9.7c-0.1,0-0.2,0.1-0.2,0.2v0.6 C9.5,7.4,9.6,7.5,9.7,7.5z"></path><path class="svgicon__path" d="M6.2,10.5h0.6c0.1,0,0.2-0.1,0.2-0.2V9.7c0-0.1-0.1-0.2-0.2-0.2H6.2C6.1,9.5,6,9.6,6,9.7v0.6 C6,10.4,6.1,10.5,6.2,10.5z"></path><path class="svgicon__path" d="M13.2,10.5h0.6c0.1,0,0.2-0.1,0.2-0.2V9.7c0-0.1-0.1-0.2-0.2-0.2h-0.6c-0.1,0-0.2,0.1-0.2,0.2v0.6 C13,10.4,13.1,10.5,13.2,10.5z"></path><path class="svgicon__path" d="M9.7,10.5h0.6c0.1,0,0.2-0.1,0.2-0.2V9.7c0-0.1-0.1-0.2-0.2-0.2H9.7c-0.1,0-0.2,0.1-0.2,0.2v0.6 C9.5,10.4,9.6,10.5,9.7,10.5z"></path></svg>',
                        "category": '<svg class="svgicon svgicon--textcolor svgicon--small" viewBox="0 0 20 20"><path class="svgicon__path" d="M19,4.979H8.252L7.431,3.263C7.347,3.089,7.172,2.979,6.979,2.979H1.916c-0.195,0-0.373,0.114-0.455,0.292 l-0.916,2C0.516,5.336,0.5,5.407,0.5,5.479v11.042c0,0.276,0.224,0.5,0.5,0.5h18c0.276,0,0.5-0.224,0.5-0.5V5.479 C19.5,5.203,19.276,4.979,19,4.979z M18.5,16.021h-17V5.588l0.737-1.609h4.428l0.822,1.716C7.57,5.869,7.745,5.979,7.938,5.979H18.5 V16.021z"/></svg>',
                        "profession": '<svg class="svgicon svgicon--textcolor svgicon--small" viewBox="0 0 20 20"><path class="svgicon__path" d="M9.983,5.545c1.459,0,2.646-1.188,2.646-2.647S11.442,0.25,9.983,0.25c-1.46,0-2.648,1.188-2.648,2.647 S8.523,5.545,9.983,5.545z M9.983,1.25c0.907,0,1.646,0.739,1.646,1.647s-0.738,1.647-1.646,1.647 c-0.909,0-1.648-0.739-1.648-1.647S9.075,1.25,9.983,1.25z"/><path class="svgicon__path" d="M14.074,6.844l-0.82-0.937c-0.095-0.108-0.231-0.17-0.376-0.17h-2.861H9.983H7.122 c-0.144,0-0.281,0.062-0.376,0.17L5.925,6.844c-0.08,0.091-0.124,0.208-0.124,0.33l0,5.993c0,0.206,0.126,0.391,0.317,0.466 l1.338,0.524v5.093c0,0.134,0.053,0.262,0.148,0.355c0.094,0.093,0.22,0.145,0.352,0.145c0.002,0,0.004,0,0.006,0L10,19.727 l2.038,0.023c0.002,0,0.004,0,0.006,0c0.132,0,0.258-0.052,0.352-0.145c0.095-0.094,0.148-0.222,0.148-0.355v-5.093l1.337-0.524 c0.191-0.075,0.317-0.26,0.317-0.466V7.174C14.198,7.053,14.154,6.936,14.074,6.844z M13.198,12.826l-0.654,0.257v-3.046 c0-0.276-0.224-0.5-0.5-0.5s-0.5,0.224-0.5,0.5v8.707l-1.027-0.012v-4.535c0-0.276-0.224-0.5-0.5-0.5 c-0.006,0-0.011,0.003-0.017,0.004c-0.006-0.001-0.011-0.004-0.017-0.004c-0.276,0-0.5,0.224-0.5,0.5v4.535l-1.027,0.012v-8.707 c0-0.276-0.224-0.5-0.5-0.5s-0.5,0.224-0.5,0.5v3.046l-0.655-0.257l0-5.464l0.547-0.625h2.634h0.034h2.634l0.547,0.625V12.826z"/></svg>'
                    };
                    const isKeyword = data.customProperties.type === "keyword";
                    const icon = (!isKeyword) ? "<span class='" + classes.item + "__ico " + classes.item + "__ico--" + data.customProperties.type + "'>" + icons[data.customProperties.type] + "</span>" : "";
                    const itemDisabled = data.disabled ? classes.itemDisabled : "";
                    const itemSelectable = !data.disabled ? classes.itemSelectable : "";
                    const placeholder = data.placeholder ? classes.placeholder : "";
                    return template("<div class=\"".concat(classes.item, " ").concat(classes.itemChoice, " ").concat(itemDisabled, " ").concat(itemSelectable, " ").concat(placeholder, "\" data-select-text=\"").concat(itemSelectText, "\" data-choice data-id=\"").concat(data.id, "\" data-value=\"").concat(data.value, "\" ").concat(data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable', " id=\"").concat(data.elementId, "\" ").concat(role, "> ").concat(icon, " ").concat(isKeyword ? 'hledat "' + data.label + '"' : data.label, " </div>"));
                },
                containerOuter: function (classes, direction, isSelectElement, isSelectOneElement, searchEnabled, passedElementType) {
                    const tabIndex = isSelectOneElement ? 'tabindex="0"' : '';
                    let role = isSelectElement ? 'role="listbox"' : '';
                    let ariaAutoComplete = '';
                    if (isSelectElement && searchEnabled) {
                        role = 'role="combobox"';
                        ariaAutoComplete = 'aria-autocomplete="list"';
                    }
                    return template("<div class=\"".concat(classes.containerOuter, "\" onblur=\"alert(\"blurred\");\" data-type=\"").concat(passedElementType, "\" ").concat(role, " ").concat(tabIndex, " ").concat(ariaAutoComplete, " aria-haspopup=\"true\" aria-expanded=\"false\" dir=\"").concat(direction, "\"></div>"));
                },
                item: function (globalClasses, data, removeItemButton) {
                    const ariaSelected = data.active ? 'aria-selected="true"' : '';
                    const ariaDisabled = data.disabled ? 'aria-disabled="true"' : '';
                    const dataHighlighted = data.highlighted ? globalClasses.highlightedState : "";
                    const placeholder = data.placeholder ? globalClasses.placeholder : "";
                    if (removeItemButton) {
                        const itemSelectable = !data.disabled ? globalClasses.itemSelectable : "";
                        const svg = '<svg class="choices__svg svgicon svgicon--cross" viewBox="0 0 20 20"><path class="svg__path" d="m 14.243,12.8285 c 0.391,0.391 0.391,1.023 0,1.414 -0.391,0.391 -1.023,0.391 -1.414,0 l -2.8290002,-2.828 -2.829,2.828 c -0.391,0.391 -1.023,0.391 -1.414,0 -0.391,-0.391 -0.391,-1.023 0,-1.414 l 2.829,-2.828 -2.829,-2.829 c -0.391,-0.391 -0.391,-1.023 0,-1.414 0.391,-0.391 1.023,-0.391 1.414,0 l 2.829,2.8290001 L 12.829,5.7575 c 0.391,-0.391 1.023,-0.391 1.414,0 0.391,0.391 0.391,1.023 0,1.414 l -2.829,2.829 z" /></svg>'
                        return template("<div class=\"".concat(globalClasses.item, " ").concat(dataHighlighted, " ").concat(itemSelectable, " ").concat(placeholder, "\" data-item data-id=\"").concat(data.id, "\" data-value=\"").concat(data.value, "\" data-custom-properties='").concat(data.customProperties, "' data-deletable ").concat(ariaSelected, " ").concat(ariaDisabled, "> <span class=\"choices__text\"> ").concat(data.label, " </span> <button type=\"button\" class=\"").concat(globalClasses.button, "\" data-button aria-label=\"Remove item: '").concat(data.value, "'\"> ").concat(svg, " </button> </div>"));
                    } else {
                        const itemSelectable = !data.highlighted ? globalClasses.itemSelectable : "";
                        return template("<divclass=\"".concat(globalClasses.item, " ").concat(dataHighlighted, " ").concat(itemSelectable, " ").concat(placeholder, "\"data-itemdata-id=\"").concat(data.id, "\"data-value=\"").concat(data.value, "\"").concat(ariaSelected).concat(ariaDisabled, "><span class=\"choices__text\">").concat(data.label, "</span></div>"));
                    }
                }
            };
        }
    };

    let instance = new Choices(input, options);
    let currentSearch = "";

    input.addEventListener('search', function (event) {
        currentSearch = event.detail.value;
        let alreadyHave = instance.getValue(true);
        console.log(event);
        instance.setChoices(getSearchData(currentSearch, alreadyHave, 20), 'value', 'label', true);
    }, false);
    input.addEventListener('addItem', function (event) {
        currentSearch = "";
        console.log(event.detail);
        let alreadyHave = instance.getValue(true);
        if (event.detail.value === "") {
            instance.removeActiveItemsByValue("");
        }
        if (alreadyHave.length > 0) {
            let plac = event.target.parentNode.querySelector(".choices__input--cloned");
            plac.setAttribute("placeholder", placeholderFilled);
        } else {
            let plac = event.target.parentNode.querySelector(".choices__input--cloned");
            plac.setAttribute("placeholder", placeholder);
        }
//        console.log(event.detail);
        instance.hideDropdown();
        instance.setChoices(getSearchData(currentSearch, alreadyHave, 20), 'value', 'label', true);
    }, false);
    input.addEventListener('removeItem', function (event) {
        let alreadyHave = instance.getValue(true);
        if (alreadyHave.length > 0) {
            let plac = event.target.parentNode.querySelector(".choices__input--cloned");
            plac.setAttribute("placeholder", placeholderFilled);
        } else {
            let plac = event.target.parentNode.querySelector(".choices__input--cloned");
            plac.setAttribute("placeholder", placeholder);
        }
        instance.setChoices(getSearchData(currentSearch, alreadyHave, 20), 'value', 'label', true);
    }, false);
    input.addEventListener('blur', function (event) {
        console.log("hail");
        let alreadyHave = instance.getValue(true);
//        console.log("focusout instance");
//        console.log(instance);
//        console.log("focusout value:" + event.detail.input.value);
//        console.log("focusout already have: " + alreadyHave);
        if (event.detail.input.value !== "") {
            let alreadyHave = instance.getValue(true);
            event.detail.input.value = "";
            currentSearch = "";
            instance.setChoices(getSearchData(currentSearch, alreadyHave, 20), 'value', 'label', true);
        }
    }, false);

}




