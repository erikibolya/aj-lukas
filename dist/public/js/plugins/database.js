var dataLocation = regions.concat(towns);
var dataProfessions = professions;
var dataCategories = categories;
var dataAll = professions.concat(categories.concat(companies));


//var data = [...professions, ...categories, ...companies];
//var data = [...comp];
//var id = 204;
//var comp = [];
//for (let i = 0, max = companies.length; i < max; i++) {
//    comp.push({
//        id: companies[i].value,
//        text: companies[i].label
//    });
//}
//console.log(comp);

function getSearchData(query, alreadyHave, limit, url) {
    query = query.trim();
    if (query === "") {
        return [];
    }
    var options = {
        keys: ['label'],
        includeScore: true,
        tokenize: true,
        location: 0,
        threshold: 0
    };

    let data = [];
    switch (url) {
        case "location":
            data = dataLocation;
            break;
        case "professions":
            data = dataProfessions;
            break;
        case "categories":
            data = dataCategories;
            break;
        case "benefits":
            data = benefits;
            break;
        case "otherskills":
            data = otherskills;
            break;
        case "languages":
            data = languages;
            break;
        case "pcskills":
            data = pcskills;
            break;
        case "answers":
            data = answers;
            break;
        default:
            data = dataAll;
            break;
    }

    let newData = data.filter(function (choice) {
        return !alreadyHave.includes(choice.value);
    });
    f1 = new Fuse(newData, options);
    let result = f1.search(query);
    let noResults = result.length === 0;
    let perfectMatch = false;
    let isLargerThanThreshold = true;
    let queryIsDuplicate = alreadyHave.includes(query);

    let final = [];
    for (let i = 0, max = result.length; i < max && i < limit; i++) {
        if (result[i].score === 0) {
            perfectMatch = true;
        }
        final.push(result[i].item);
    }

//    if (queryIsDuplicate) {
//        final.unshift({value: "", label: query, customProperties: {type: "keyword"}});
//    } else if ((noResults || !perfectMatch) && isLargerThanThreshold) {
//        final.unshift({value: query, label: query, customProperties: {type: "keyword"}});
//    }
    return final;
}

function getDefaultData(type, alreadyHave) {
    switch (type) {
        case "categories":
            return categories.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "regions":
            return regions.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "professions":
            return professions.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "languages":
            return languages.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "pcskills":
            return pcskills.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "otherskills":
            return otherskills.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "benefits":
            return benefits.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        case "answers":
            return answers.filter(function (choice) {
                return !alreadyHave.includes(choice.value);
            });
        default:
            return [];
    }
}
