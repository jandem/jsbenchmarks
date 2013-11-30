// Generated by JSIL v0.7.8 build 14042. See http://jsil.org/ for more information. 

var $asm00 = JSIL.GetAssembly("Vector3, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null");
var $asm01 = JSIL.GetAssembly("mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089");
var $asm02 = JSIL.GetAssembly("JSIL.Meta, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null");

if (typeof (contentManifest) !== "object") { contentManifest = {}; };
contentManifest["Vector3.dll"] = [
    ["Script", "Vector3, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null.js", { "sizeBytes": 9174 }],
];

/* Generated by JSIL v0.7.8 build 14042. See http://jsil.org/ for more information. */ 
var $asm00 = JSIL.DeclareAssembly("Vector3, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null");

/* class Program */ 

(function Program$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm00.Vector3d)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm01.System.Byte)) ();
  };
  var $T02 = function () {
    return ($T02 = JSIL.Memoize($asm01.System.Int32)) ();
  };
  var $T03 = function () {
    return ($T03 = JSIL.Memoize($asm02.JSIL.Runtime.IPackedArray$b1.Of($asm00.Vector3d))) ();
  };
  var $T04 = function () {
    return ($T04 = JSIL.Memoize($asm01.System.Console)) ();
  };
  var $T05 = function () {
    return ($T05 = JSIL.Memoize($asm01.System.Func$b1.Of($asm00.Vector3d))) ();
  };
  var $T06 = function () {
    return ($T06 = JSIL.Memoize($asm01.System.Environment)) ();
  };
  var $IM00 = function () {
    return ($IM00 = JSIL.Memoize($asm02.JSIL.Runtime.IPackedArray$b1.Of($asm00.Vector3d).set_Item)) ();
  };

  function Program_Main () {
    $thisType.ManuallyPackedVectors = JSIL.Array.New($T01(), ((JSIL.GetNativeSizeOf($T00().__Type__) * 8192) | 0));
    var pPackedBytes = JSIL.PinAndGetPointer($thisType.ManuallyPackedVectors);
    var pPackedStructs = pPackedBytes.cast($T00());

    for (var i = 0; i < 8192; i = ((i + 1) | 0)) {
      $thisType.Vectors[i] = new ($T00())((i * 0.5), i, (i * 1.5));
      $thisType.PackedVectors.set_Item(i, $thisType.Vectors[i]);
      pPackedStructs.setElement(i, $thisType.Vectors[i]);
    }
    $T04().WriteLine("Arrays: {0:00000.00}ms", $thisType.Time($T05().New($thisType, $thisType.TestArrays)));
    $T04().WriteLine("ManuallyPackedStructs: {0:00000.00}ms", $thisType.Time($T05().New($thisType, $thisType.TestManuallyPackedStructs)));
    $T04().WriteLine("PackedStructs: {0:00000.00}ms", $thisType.Time($T05().New($thisType, $thisType.TestPackedStructs)));
    $T04().WriteLine("PackedStructPointers: {0:00000.00}ms", $thisType.Time($T05().New($thisType, $thisType.TestPackedStructPointers)));
  };

  function Program_TestArrays () {
    var sum = new ($T00())();

    for (var i = 0; i < 8192; i = ((i + 1) | 0)) {
      sum = $T00().op_Addition(sum, $thisType.Vectors[i]);
    }
    return sum;
  };

  function Program_TestManuallyPackedStructs () {
    var pPackedBytes = JSIL.PinAndGetPointer($thisType.ManuallyPackedVectors);
    var sum = new ($T00())();
    var pCurrent = pPackedBytes.cast($T00());

    for (var i = 0; i < 8192; i = ((i + 1) | 0)) {
      sum = $T00().op_Addition(sum, pCurrent.getProxy());
      pCurrent.addElements(1, true);
    }
    return sum;
  };

  function Program_TestPackedStructPointers () {
    var sum = new ($T00())();
    var pStructs = JSIL.PinAndGetPointer($thisType.PackedVectors);
    var pCurrent = pStructs;

    for (var i = 0; i < 8192; i = ((i + 1) | 0)) {
      sum = $T00().op_Addition(sum, pCurrent.getProxy());
      pCurrent.addElements(1, true);
    }
    return sum;
  };

  function Program_TestPackedStructs () {
    var $temp00;
    $temp00 = JSIL.MakeElementProxy($asm00.Vector3d.__Type__);
    var sum = new ($T00())();

    for (var i = 0; i < 8192; i = ((i + 1) | 0)) {
      sum = $T00().op_Addition(sum, $temp00.retarget($thisType.PackedVectors, i));
    }
    return sum;
  };

  function Program_Time (func) {
    var started = $T06().get_TickCount();
    var sum = new ($T00())();

    for (var i = 0; i < 320; i = ((i + 1) | 0)) {
      sum = func();
    }
    $T04().WriteLine(sum);
    var ended = $T06().get_TickCount();
    return ((ended - started) | 0);
  };

  JSIL.MakeStaticClass("Program", true, [], function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:true , Public:true }, "Main", 
      new JSIL.MethodSignature(null, [], []), 
      Program_Main
    );

    $.Method({Static:true , Public:true }, "TestArrays", 
      new JSIL.MethodSignature($asm00.TypeRef("Vector3d"), [], []), 
      Program_TestArrays
    );

    $.Method({Static:true , Public:true }, "TestManuallyPackedStructs", 
      new JSIL.MethodSignature($asm00.TypeRef("Vector3d"), [], []), 
      Program_TestManuallyPackedStructs
    );

    $.Method({Static:true , Public:true }, "TestPackedStructPointers", 
      new JSIL.MethodSignature($asm00.TypeRef("Vector3d"), [], []), 
      Program_TestPackedStructPointers
    );

    $.Method({Static:true , Public:true }, "TestPackedStructs", 
      new JSIL.MethodSignature($asm00.TypeRef("Vector3d"), [], []), 
      Program_TestPackedStructs
    );

    $.Method({Static:true , Public:true }, "Time", 
      new JSIL.MethodSignature($.Int32, [$asm01.TypeRef("System.Func`1", [$asm00.TypeRef("Vector3d")])], []), 
      Program_Time
    );

    $.Constant({Static:true , Public:false}, "BufferSize", 8192); 
    $.Constant({Static:true , Public:false}, "IterationCount", 320); 
    $.Field({Static:true , Public:true }, "Vectors", $jsilcore.TypeRef("System.Array", [$asm00.TypeRef("Vector3d")]), function ($pi) {
        return JSIL.Array.New($asm00.Vector3d, 8192);
      }); 
    $.Field({Static:true , Public:true }, "PackedVectors", $asm02.TypeRef("JSIL.Runtime.IPackedArray`1", [$asm00.TypeRef("Vector3d")]))
      .Attribute($asm02.TypeRef("JSIL.Meta.JSPackedArray")); 
    $.Field({Static:true , Public:true }, "ManuallyPackedVectors", $jsilcore.TypeRef("System.Array", [$.Byte])); 
    function Program__cctor () {
      $thisType.Vectors = JSIL.Array.New($T00(), 8192);
      $thisType.PackedVectors = JSIL.PackedArray.New($T00(), 8192);
    };


    $.Method({Static:true , Public:false}, ".cctor", 
      new JSIL.MethodSignature(null, [], []), 
      Program__cctor
    );

    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

/* struct Vector3d */ 

(function Vector3d$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm01.System.Double)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm01.System.Void)) ();
  };
  var $T02 = function () {
    return ($T02 = JSIL.Memoize($asm01.System.String)) ();
  };

  function Vector3d__ctor (x, y, z) {
    this.x = +x;
    this.y = +y;
    this.z = +z;
  };

  function Vector3d_Dot (b) {
    return +(((this.x * b.x) + (this.y * b.y)) + (this.z * b.z));
  };

  function Vector3d_Magnitude () {
    return +Math.sqrt((((this.x * this.x) + (this.y * this.y)) + (this.z * this.z)));
  };

  function Vector3d_Normalize () {
    var d = +(1 / this.Magnitude());
    return new $thisType((this.x * d), (this.y * d), (this.z * d));
  };

  function Vector3d_op_Addition (a, b) {
    return new $thisType((a.x + b.x), (a.y + b.y), (a.z + b.z));
  };

  function Vector3d_op_Subtraction (a, b) {
    return new $thisType((a.x - b.x), (a.y - b.y), (a.z - b.z));
  };

  function Vector3d_op_UnaryNegation (a) {
    return new $thisType(-a.x, -a.y, -a.z);
  };

  function Vector3d_toString () {
    return $T02().Format("<{0:00000000.00}, {1:00000000.00}, {2:00000000.00}>", this.x, this.y, this.z);
  };

  JSIL.MakeType({
      BaseType: $asm01.TypeRef("System.ValueType"), 
      Name: "Vector3d", 
      IsPublic: true, 
      IsReferenceType: false, 
      MaximumConstructorArguments: 3, 
    }, function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:false, Public:true }, ".ctor", 
      new JSIL.MethodSignature(null, [
          $.Double, $.Double, 
          $.Double
        ], []), 
      Vector3d__ctor
    );

    $.Method({Static:false, Public:true }, "Dot", 
      new JSIL.MethodSignature($.Double, [$.Type], []), 
      Vector3d_Dot
    );

    $.Method({Static:false, Public:true }, "Magnitude", 
      new JSIL.MethodSignature($.Double, [], []), 
      Vector3d_Magnitude
    );

    $.Method({Static:false, Public:true }, "Normalize", 
      new JSIL.MethodSignature($.Type, [], []), 
      Vector3d_Normalize
    );

    $.Method({Static:true , Public:true }, "op_Addition", 
      new JSIL.MethodSignature($.Type, [$.Type, $.Type], []), 
      Vector3d_op_Addition
    );

    $.Method({Static:true , Public:true }, "op_Subtraction", 
      new JSIL.MethodSignature($.Type, [$.Type, $.Type], []), 
      Vector3d_op_Subtraction
    );

    $.Method({Static:true , Public:true }, "op_UnaryNegation", 
      new JSIL.MethodSignature($.Type, [$.Type], []), 
      Vector3d_op_UnaryNegation
    );

    $.Method({Static:false, Public:true , Virtual:true }, "toString", 
      new JSIL.MethodSignature($.String, [], []), 
      Vector3d_toString
    );

    $.Field({Static:false, Public:true , ReadOnly:true }, "x", $.Double); 
    $.Field({Static:false, Public:true , ReadOnly:true }, "y", $.Double); 
    $.Field({Static:false, Public:true , ReadOnly:true }, "z", $.Double); 
    return function (newThisType) { $thisType = newThisType; }; 
  });

})();



function runTestCase (timeout, dateNow) {
  JSIL.ThrowOnUnimplementedExternals = true;
  timeout(15);
  var started = dateNow();
  var testAssembly = JSIL.GetAssembly("Vector3, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null", true);
  testAssembly.Program.Main();
  var ended = dateNow();
  return (ended - started);
}