var currentTest = -1;

function runSingleTest() {
    var info = testList[currentTest];
    var frame = document.getElementById("testframe");
    frame.src = "tests/" + info.filename;
}

function run() {
    init();
    currentTest = 0;
    runSingleTest();
}

function finishTest(res) {
    var results = document.getElementById("results");
    var cell = results.rows[currentTest].cells[1];
    if (cell.textContent !== "-")
	alert("FinishTest called twice.");
    cell.textContent = res;

    if (currentTest == testList.length - 1) {
	document.getElementById("testframe").src = "";
	return;
    }

    currentTest++;
    setTimeout(runSingleTest, 5);
}

function init() {
    var results = document.getElementById("results");
    results.innerHTML = "";

    for (var i=0; i<testList.length; i++) {
	var info = testList[i];

	var row = results.insertRow(i);
	var cell = row.insertCell(0);

	var link = document.createElement("a");
	link.href = "tests/" + info.filename;
	link.textContent = info.name;
	link.className = "testname";
	cell.appendChild(link);

	cell = row.insertCell(1);
	cell.textContent = "-";
    }
}

window.onload = init;
