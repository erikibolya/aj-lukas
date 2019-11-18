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

function isAutoCompleteInFullScreenMode(autocomplete) {
    return autocomplete.classList.contains("autocomplete--fullscreen");
}

function isAutoCompleteInWindow(autocomplete) {
    return autocomplete.classList.contains("autocomplete--inwindow");
}

function showAutocompleteInFullscreen(autocomplete) {
    autocomplete.classList.add("autocomplete--fullscreen");
}

function hideAutocompleteFromFullscreen(autocomplete) {
    autocomplete.classList.remove("autocomplete--fullscreen");
}

function resetBodyScrollPosition() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
}

function saveBodyScrollPosition() {
    scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
}

function restoreBodyScrollPosition() {
    if (scrollPosition !== 0) {
        document.documentElement.scrollTop = document.body.scrollTop = scrollPosition;
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

for (var i = 0, max = autocompletes.length; i < max; i++) {
    let element = autocompletes[i];
    let input = element.querySelector(".autocomplete__input");
    let selector = "#" + input.id;

    let placeholder = input.getAttribute("data-placeholder");

    let maxItemRender = input.hasAttribute("data-max-item-render") ? parseInt(input.getAttribute("data-max-item-render")) : 20;

    let dataPreview = input.hasAttribute("data-preview") ? input.getAttribute("data-preview") : false;
    let addLocation = input.hasAttribute("data-add-location") && ("geolocation" in navigator) ? input.getAttribute("data-add-location") : false;

    let initialHint = input.hasAttribute("data-initial-hint") ? input.getAttribute("data-initial-hint") : "Initial Hint";
    let dataNoResult = input.hasAttribute("data-noresult") ? input.getAttribute("data-noresult") : "";
    let dataUrl = input.getAttribute("data-url");

    let options = {
        silent: false,
//        choices: predata,
        maxItemCount: 1,
        paste: true,
        searchFloor: -1,
        searchChoices: false,
        shouldSort: false,
        position: 'auto',
        placeholder: true,
        placeholderValue: placeholder,
        loadingText: 'Loading...',
        itemSelectText: '',
        noResultsText: dataNoResult,
        noChoicesText: dataNoResult,
        callbackOnCreateTemplates: function (template) {
            return {
                choice: function (classes, data, itemSelectText) {
                    const role = data.groupId > 0 ? 'role="treeitem"' : 'role="option"';
                    const icons = {
                        "location": '<svg class="svgicon svgicon--textcolor svgicon--small" viewBox="0 0 18.00098 18.00098"><path class="svg__path" d="M12.81531,9A3.04113,3.04113,0,0,0,10,7.00055l-.00049-.00006a2.9997,2.9997,0,0,0,0,5.999L10,12.99945A2.97073,2.97073,0,0,0,12.81531,9ZM11,11.721a1.97627,1.97627,0,0,1-1,.2785l-.00049.00006A1.97646,1.97646,0,0,1,9,11.7215,1.99958,1.99958,0,0,1,8.27832,11a1.93583,1.93583,0,0,1-.00006-2A1.99991,1.99991,0,0,1,9,8.27844a1.97642,1.97642,0,0,1,.99951-.278L10,8.00055A1.97622,1.97622,0,0,1,11,8.279,2.00074,2.00074,0,0,1,11.72083,9a1.93622,1.93622,0,0,1-.00007,2A2.00038,2.00038,0,0,1,11,11.721Z" transform="translate(-0.99951 -0.99951)"/><path class="svg__path" d="M16.78174,9A6.85594,6.85594,0,0,0,11,3.21826V.99951H9V3.21814A6.85607,6.85607,0,0,0,3.21722,9H.99951v2H3.2171A6.8562,6.8562,0,0,0,9,16.7829v2.21759h2V16.78278A6.85607,6.85607,0,0,0,16.78186,11h2.21863V9ZM11,15.772a5.84532,5.84532,0,0,1-1,.09186H9.99951a5.86341,5.86341,0,0,1,0-11.72662H10A5.86063,5.86063,0,0,1,11,15.772Z" transform="translate(-0.99951 -0.99951)"/></svg>'
                    };
                    const hasCustomProperties = data.hasOwnProperty("customProperties") && data.customProperties !== null;
                    const hasIcon = hasCustomProperties && data.customProperties.hasOwnProperty("type");
                    const hasDescription = hasCustomProperties && data.customProperties.hasOwnProperty("description");
                    const icon = hasIcon ? "<span class='" + classes.item + "__ico " + "'>" + icons[data.customProperties.type] + "</span>" : "";
                    const description = hasDescription ? "<span class='" + classes.item + "__description " + "'>" + data.customProperties.description + "</span>" : "";
                    const label = "<span class='" + classes.item + "__label " + "'>" + data.label + "</span>";
                    const itemDisabled = data.disabled ? classes.itemDisabled : "";
                    const itemSelectable = !data.disabled ? classes.itemSelectable : "";
                    const placeholder = data.placeholder ? classes.placeholder : "";
                    return template('<div class="' + classes.item + ' ' + classes.itemChoice + ' ' + itemDisabled + ' ' + itemSelectable + ' ' + placeholder + '" data-select-text="' + itemSelectText + '" data-choice data-id="' + data.id + '" data-value="' + data.value + '" ' + (data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable') + ' id="' + data.elementId + '\" ' + role + '> ' + icon + ' <span class="' + classes.item + '__content">' + label + ' ' + description + "</span></div>");
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
                        return template("<div class=\"".concat(globalClasses.item, " ").concat(dataHighlighted, " ").concat(itemSelectable, " ").concat(placeholder, "\"data-itemdata-id=\"").concat(data.id, "\"data-value=\"").concat(data.value, "\"").concat(ariaSelected).concat(ariaDisabled, "><span class=\"choices__text\">").concat(data.label, "</span></div>"));
                    }
                }
            };
        },
        callbackOnInit: function () {
            this.input.element.placeholder = placeholder;
            this.input.element.classList.add("choices__input--singleselect");

        }
    };

    let instance = new Choices(input, options);
    let inputCloned = instance.input.element;
    let currentSearch = "";
    let alreadyHave = [];

    input.addEventListener('search', function (event) {
        currentSearch = event.detail.value.trim();
        if (currentSearch === "") {
            if (dataPreview !== false) {
                let data = getDefaultData(dataPreview, alreadyHave);
                if (addLocation !== false) {
                    data.unshift({value: -1, label: addLocation, customProperties: {type: "location"}});
                }
                instance.setChoices(data, 'value', 'label', true);
            } else {
                instance.clearChoices();
            }

        } else {
            let data = getSearchData(currentSearch, alreadyHave, maxItemRender, dataUrl); //nahradit voláním na api
            instance.setChoices(data, 'value', 'label', true);
        }
    }, false);
    input.addEventListener('addItem', function (event) {
        if (event.detail.value === -1) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords);
            }, function (error) {
                console.log(error);
            });

        } else {
            inputCloned.value = event.detail.label;
            alreadyHave = [event.detail.value];

            instance.hideDropdown();
        }


//        instance.setChoices(getSearchData(currentSearch, alreadyHave, 20), 'value', 'label', true);
    }, false);

//    input.addEventListener('change', function (event) {
//        alert("change");
//        let cloned = event.target.parentNode.querySelector(".choices__input--cloned");
//        cloned.value = event.detail.label;
//    }, false);
//    input.addEventListener('blur', function (event) {
//
//        if (event.detail.input.value.trim() !== alreadyHave) {
//
//            event.detail.input.value = "";
//            currentSearch = "";
//            alreadyHave = "";
//            instance.clearChoices();
//            instance.setChoices(getSearchData(currentSearch, 20, true), 'value', 'label', true);
//        }
//    }, false);

    inputCloned.addEventListener('focus', function (event) {
        if (dataPreview !== false) {
            alreadyHave = (instance.getValue(true) == null) ? [] : [instance.getValue(true)];
            let data = getDefaultData(dataPreview, alreadyHave);
            if (addLocation !== false) {
                data.unshift({value: -1, label: addLocation, customProperties: {type: "location"}});
            }
            instance.setChoices(data, 'value', 'label', true);
        } else {
            instance.clearChoices();
        }

    }, false);




}

for (var i = 0, max = tagAutocompletes.length; i < max; i++) {
    let element = tagAutocompletes[i];
    let input = element.querySelector(".autocomplete__input");
    let closeButton = element.querySelector("[data-autocomplete-close]");
    let selector = "#" + input.id;
    let placeholder = input.getAttribute("data-placeholder");
    let placeholderAdd = input.getAttribute("data-placeholder-add");
    let maxItem = input.hasAttribute("data-max-item") ? parseInt(input.getAttribute("data-max-item")) : -1;
    let maxItemText = input.getAttribute("data-max-item-text");
    let maxItemRender = input.hasAttribute("data-max-item-render") ? parseInt(input.getAttribute("data-max-item-render")) : 20;
    let addTag = input.hasAttribute("data-add-tag") ? input.getAttribute("data-add-tag") : false;
    let dataPreview = input.hasAttribute("data-preview") ? input.getAttribute("data-preview") : false;
    let initialHint = input.hasAttribute("data-initial-hint") ? input.getAttribute("data-initial-hint") : "Initial Hint";
    let dataNoResult = input.hasAttribute("data-noresult") ? input.getAttribute("data-noresult") : "";
    let dataUrl = input.getAttribute("data-url");
    let options = {
        removeItemButton: true,
        searchFloor: -1,
        searchChoices: false,
        maxItemCount: maxItem,
        shouldSort: false,
        placeholder: true,
        placeholderValue: placeholder,
        duplicateItemsAllowed: false,
        itemSelectText: '',
        noResultsText: dataNoResult,
        noChoicesText: dataNoResult,
        maxItemText: maxItemText,
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
                    const hasCustomProperties = ("customProperties" in data) && data.customProperties !== null;
                    const isKeyword = hasCustomProperties && ("type" in data.customProperties) && data.customProperties.type === "keyword";
                    const icon = hasCustomProperties && (!isKeyword) ? "<span class='" + classes.item + "__ico " + "'>" + icons[data.customProperties.type] + "</span>" : "";
                    const itemDisabled = data.disabled ? classes.itemDisabled : "";
                    const itemSelectable = !data.disabled ? classes.itemSelectable : "";
                    const placeholder = data.placeholder ? classes.placeholder : "";
                    return template('<div class="' + classes.item + ' ' + classes.itemChoice + ' ' + itemDisabled + ' ' + itemSelectable + ' ' + placeholder + '" data-select-text="' + itemSelectText + '" data-choice data-id="' + data.id + '" data-value="' + data.value + '" ' + (data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable') + ' id="' + data.elementId + '\" ' + role + '> ' + icon + ' ' + ((isKeyword && (addTag !== false)) ? addTag + ' "' + data.label + '"' : data.label) + " </div>");
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
        ,
        callbackOnInit: function () {
//            if (dataPreview !== false) {
//                this.setChoices(getDefaultData(dataPreview, []), 'value', 'label', true);
//            }
        }
    };
    let instance = new Choices(input, options);
    let inputCloned = instance.input.element;
    let currentSearch = "";
    let alreadyHave = instance.getValue(true);
    console.log(alreadyHave);
    input.addEventListener('search', function (event) {
        currentSearch = event.detail.value.trim();
//        console.log("searching");
//        console.log("currentSearch: " + currentSearch);
        if (currentSearch === "") {
//            console.log("currentSearch is empty");
            if (dataPreview !== false) {
                instance.config.noChoicesText = dataNoResult;
                alreadyHave = instance.getValue(true);
                instance.setChoices(getDefaultData(dataPreview, alreadyHave), 'value', 'label', true); //nahradit voláním na api
            } else {
                instance.config.noChoicesText = initialHint;
                instance.clearChoices();
            }

        } else {
            instance.config.noChoicesText = dataNoResult;
            let data = getSearchData(currentSearch, alreadyHave, maxItemRender, dataUrl); //nahradit voláním na api
//        console.log("can add tags: " + addTags);
            if (addTag) {
                if (alreadyHave.includes(currentSearch)) {
                    data.unshift({value: "", label: currentSearch, customProperties: {type: "keyword"}});
                } else {
                    data.unshift({value: currentSearch, label: currentSearch, customProperties: {type: "keyword"}});
                }
            }
//            console.log(instance.config.noChoicesText);
            instance.setChoices(data, 'value', 'label', true);
        }
    }, false);
    input.addEventListener('addItem', function (event) {
        currentSearch = "";
        alreadyHave = instance.getValue(true);
        if (event.detail.value === "") {
            instance.removeActiveItemsByValue("");
        }

        if (alreadyHave.length === maxItem) {
            inputCloned.setAttribute("placeholder", "");
        } else {
            inputCloned.setAttribute("placeholder", placeholderAdd);
        }

        if (dataPreview !== false) {
            instance.config.noChoicesText = dataNoResult;
            alreadyHave = instance.getValue(true);
            instance.setChoices(getDefaultData(dataPreview, alreadyHave), 'value', 'label', true); //nahradit voláním na api
        } else {
            instance.config.noChoicesText = initialHint;
            instance.clearChoices();
        }
        instance.hideDropdown();
        if (isAutoCompleteInFullScreenMode(element)) {
            instance.config.removeItems = true;
            hideAutocompleteFromFullscreen(element);
            if (!isAutoCompleteInWindow(element)) {
                disableNoBounce();
                hideAutocompleteFromFullscreen(element);
                restoreBodyScrollPosition();
            } else {
                element.closest(".modal").removeClass("modal--innerwindow");
            }
        }
    }, false);
    input.addEventListener('removeItem', function (event) {
        currentSearch = instance.input.element.value;
        alreadyHave = instance.getValue(true);
        if (alreadyHave.length === 0) {
            inputCloned.setAttribute("placeholder", placeholder);
        } else {
            inputCloned.setAttribute("placeholder", placeholderAdd);
        }

        if (currentSearch === "") {
            if (dataPreview !== false) {
                instance.config.noChoicesText = dataNoResult;
                alreadyHave = instance.getValue(true);
                instance.setChoices(getDefaultData(dataPreview, alreadyHave), 'value', 'label', true); //nahradit voláním na api
            } else {
                instance.config.noChoicesText = initialHint;
                instance.clearChoices();
            }
        } else {
            instance.config.noChoicesText = dataNoResult;
            let data = getSearchData(currentSearch, alreadyHave, maxItemRender, dataUrl); //nahradit voláním na api
            if (addTag) {
                if (alreadyHave.includes(currentSearch)) {
                    data.unshift({value: "", label: currentSearch, customProperties: {type: "keyword"}});
                } else {
                    data.unshift({value: currentSearch, label: currentSearch, customProperties: {type: "keyword"}});
                }
            }
            instance.setChoices(data, 'value', 'label', true);
        }

    }, false);
    inputCloned.addEventListener('blur', function (event) {
//        console.log("bluring");
        event.target.value = "";
        currentSearch = "";
        if (dataPreview !== false) {
            instance.config.noChoicesText = dataNoResult;
            alreadyHave = instance.getValue(true);
            instance.setChoices(getDefaultData(dataPreview, alreadyHave), 'value', 'label', true);
        } else {
            instance.config.noChoicesText = initialHint;
            instance.clearChoices();
        }

    }, false);
    inputCloned.addEventListener('focus', function () {
        if (!isAutoCompleteInFullScreenMode(element)) {
            if (isBelowBreakpoint(breakpoint)) {
                if (isAutoCompleteInWindow(element)) {
                    element.closest(".modal").addClass("modal--innerwindow");
                } else {
                    saveBodyScrollPosition();
                    resetBodyScrollPosition();
                }
                instance.config.removeItems = false;
                inputCloned.blur();
                showAutocompleteInFullscreen(element);
                inputCloned.focus();
                enableNoBounce();
                return;
            }
        }
        if (dataPreview !== false) {
            instance.config.noChoicesText = dataNoResult;
            alreadyHave = instance.getValue(true);
            let data = getDefaultData(dataPreview, alreadyHave);
            instance.setChoices(data, 'value', 'label', true);
        } else {
            if (alreadyHave.length === maxItem) {
                instance.config.noChoicesText = maxItemText;
            } else {
                instance.config.noChoicesText = initialHint;
            }

            instance.clearChoices();
        }
    }, false);

    $(closeButton).on("click", function () {
        instance.config.removeItems = true;
        if (!isAutoCompleteInWindow(element)) {
            disableNoBounce();
            hideAutocompleteFromFullscreen(element);
            restoreBodyScrollPosition();
        } else {
            element.closest(".modal").removeClass("modal--innerwindow");
        }
    });
}




