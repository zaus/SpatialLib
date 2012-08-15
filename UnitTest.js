; var UnitTests = (function (undefined) {
	var debug = function (method, params) {
		/// <summary>
		/// Paulirish-like console.log wrapper
		/// </summary>
		/// <param name="method" type="string">the name of the method to use: log|warn|error</param>
		/// <param name="params" type="[...]">list your logging parameters</param>
		
		if (typeof undefined === typeof DEBUGMODE || !DEBUGMODE) return;

		if (console && console[method]) {
			if (console[method].apply)
				console[method].apply(console, Array.prototype.slice.call(arguments, 1));
			else
				console[method](Array.prototype.slice.call(arguments, 1));
		}
	}

	var lib = {
		debug : debug // attach
		, log : function(){
			/// <summary>
			/// Logging helper - alias to debug('log', ...)
			/// </summary>
			var args = Array.prototype.slice.call(arguments, 0); // get args
			args.splice(0,0,'log'); // add method
			debug.apply(this, args);
		}
		,
		areEqual : function (a, b, tolerance) {
			/// <summary>equals within tolerance</summary>
			/// <param name="a" type="number">first item to compare</param>
			/// <param name="b" type="number">second item to compare</param>
			/// <param name="tolerance" type="number">(default 0.05) if not exactly equal, difference between must be less than this value</param>
			/// <returns>True if they are equal, or equal within the given tolerance</returns>

			if (a == b) return true;
			tolerance = tolerance || 0.05;

			if ((a - b) / b < tolerance) return true;

			return false;
		}
		,

		/// <field name="_results" type="JSON">the results of tests
		_results: {}
		,
		_addResult: function (name, success, result) {
			/// <summary>
			/// Add the result to the list and report
			/// </summary>
			/// <param name="name">test identifier</param>
			/// <param name="success">1 = success, </param>
			/// <param name="actual">actual value</param>

			this._results[name] = { "success": success, "result" : result };

			// http://blogs.msdn.com/b/cdndevs/archive/2011/05/26/console-log-say-goodbye-to-javascript-alerts-for-debugging.aspx
			var method;
			switch(success) {
				case -1: method = 'error'; break;
				case 0: method = 'info'; break;
				case -2: method = 'warn'; break;
				case 1:
				default: method = 'log'; break;
			}
			debug(method, "Test:", name, " = ", result);
		}
		,
		_getResult: function (name) {
			return this._results[name];
		}
		,
		Test: function (name, testFn) {

			var result = testFn.apply(testFn, Array.prototype.slice.call(arguments, 2));
			this._addResult(name, 0, result);
		}
		,
		AssertEquivalent: function (name, expected, actual) {
			/// <summary>
			/// Check that the actual value matches the expected exactly
			/// </summary>
			/// <param name="name">test identifier</param>
			/// <param name="expected">expected value</param>
			/// <param name="actual">actual value</param>
			/// <returns>Either True or the values</returns>

			var success = expected === actual;
			var result = success ? true : "Expected " + expected + ", received " + actual;

			this._addResult("Assert.Equivalent." + name, success ? 1 : -1, result);

			return success;
		}
		,
		AssertNotEqual: function(name, expected, actual, tolerance) {
			/// <summary>
			/// Check that the actual value does not match the expected
			/// </summary>
			/// <param name="name">test identifier</param>
			/// <param name="expected">expected value</param>
			/// <param name="actual">actual value</param>
			/// <param name="tolerance">if provided, and values are numbers, allow ratio between the two to be less than given tolerance.  Provide `true` to use default value of 0.05</param>
			/// <returns>Either True or the values</returns>

			var success = expected != actual, result;

			if( success ) {
				result = "Pass";
			}
			else {
				var failmsg = "Expected " + expected + ", received " + actual;
				// check for tolerance if requested
				if (tolerance !== undefined && typeof expected == "number" && typeof actual === typeof expected) {
					if (true === tolerance) tolerance = 0.05; // lazy default

					var ratio = Math.abs( (actual - expected) / expected );

					if (ratio < tolerance) {
						success = -1;
						result = failmsg + " (" + ratio*100 + "% off)";
					}
						// within tolerance
					else {
						success = -2;
						result = "Okay, outside tolerance " + tolerance + " (" + (ratio*100) + "%)";
					}
				}
				else {
					success = -1;
					result = failmsg;
				}
			}

			this._addResult("Assert.NotEqual." + name, success, result);

			return success;
		}//	fn	AssertNotEqual
		,
		AssertEqual: function (name, expected, actual, tolerance) {
			/// <summary>
			/// Check that the actual value matches the expected
			/// </summary>
			/// <param name="name">test identifier</param>
			/// <param name="expected">expected value</param>
			/// <param name="actual">actual value</param>
			/// <param name="tolerance">if provided, and values are numbers, allow ratio between the two to be less than given tolerance.  Provide `true` to use default value of 0.05</param>
			/// <returns>Either True or the values</returns>

			var success = expected == actual, result;

			if( success ) {
				result = "Pass";
			}
			else {
				var failmsg = "Expected " + expected + ", received " + actual;
				// check for tolerance if requested
				if (tolerance !== undefined && typeof expected == "number" && typeof actual === typeof expected) {
					if (true === tolerance) tolerance = 0.05; // lazy default

					var ratio = Math.abs( (actual - expected) / expected );

					if (ratio > tolerance) {
						success = -1;
						result = failmsg + " (" + ratio*100 + "% off)";
					}
						// within tolerance
					else {
						success = -2;
						result = "Okay, within tolerance " + tolerance + " (" + (ratio*100) + "%)";
					}
				}
				else {
					success = -1;
					result = failmsg;
				}
			}

			this._addResult("Assert.Equal." + name, success, result);

			return success;
		}//	fn	AssertEqual
	};

	return lib; // expose
})();