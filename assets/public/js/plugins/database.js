var data = [...professions, ...categories, ...companies];
var id = 204
for (let i = 0, max = professions.length; i < max; i++) {
    professions[i].value = id;
    id++;
}
console.log(professions);

function getSearchData(query, alreadyHave, limit) {
    query = query.trim();
    if (query === "") {
        return categories.filter(function (choice) {
            return !alreadyHave.includes(choice.value);
        });
    }
    var options = {
        keys: ['label'],
        includeScore: true,
        tokenize: true,
        location: 0,
        threshold: 0
    };
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
    if (queryIsDuplicate) {
        final.unshift({value: "", label: query, customProperties: {type: "keyword"}});
    } else if ((noResults || !perfectMatch) && isLargerThanThreshold) {
        final.unshift({value: query, label: query, customProperties: {type: "keyword"}});
    }
    return final;
}

