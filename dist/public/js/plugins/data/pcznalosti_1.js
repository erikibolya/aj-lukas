var pcknowledge = ["PHP", "Axure", "Corel", "Adobe ilustrator", "Angular", "Bash", "C", "C++", "Java", "JavaScript", "jQuery", "React", "MySQL", "SAP", "AJAX", "HTML", "CSS", "Magento", "REST"];

var n = [];

for (var i = 0, max = pcknowledge.length; i < max; i++) {
    n.push({
        "value": i,
        "label": pcknowledge[i]
    });
}
console.log(n);