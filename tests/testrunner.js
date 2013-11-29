var __testResult;

function loadHandler() {
    var t = new Date;
    runTest();
    t = new Date - t;

    if (__testResult)
	t = __testResult;

    if (window.top !== window.self) {
	window.top.finishTest(t);
    } else {
	var res = document.createElement("div");
	res.textContent = t + " ms.";
	document.body.insertBefore(res, document.body.firstChild);
    }
}
function reportTestResult(t) {
    __testResult = t;
}
