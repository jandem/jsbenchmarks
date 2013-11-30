var jsilConfig = {
    libraryRoot: "TestLibraries/",
    environment: 'spidermonkey_shell'
}; 

load("TestLibraries/JSIL.js");

if (typeof (contentManifest) !== "object") { contentManifest = {}; };
contentManifest["test"] = [
    ["Script", "Vector3.cs.js"],
];

function runMain () { 
  for (var i = 0; i < 3; i++) {
    try { 
      var elapsedTime = runTestCase(timeout, elapsed); 
    } catch (exc) { 
      reportException(exc); 
    } 
  }
}; 

shellStartup();
