; (function (fnn) {
	/// <summary>
	/// Object-Oriented Javascript helpers, for making inheritance and extension easier.  Based on Inspired by base2 and Prototype.
	/// <example>
	///		See also:
	///		<ul>
	///			<li>http://phrogz.net/js/classes/OOPinJS.html</li>
	///			<li>http://phrogz.net/js/classes/OOPinJS2.html</li>
	///			<li>http://ejohn.org/blog/simple-javascript-inheritance/</li>
	///		</ul>
	/// </example>
	/// </summary>
	/// <author>zaus http://drzaus.com </author>
	/// <originalauthor>John Resig http://ejohn.org/blog/simple-javascript-inheritance/ </originalauthor>
	/// <license>MIT Licensed.</license>
	
	var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_base\b/ : /.*/;
	// The base Class implementation (does nothing)
	this.Class = function () { };

	// Create a new Class that inherits from this class
	Class._derive = function (prop) {
		/// <summary>
		/// Extend the base class and create a new derived class with the given properties (fields and methods)
		/// </summary>
		/// <param name="prop" type="JSON">object list of properties (fields and methods).  Should include a constructor <code>_init</code>.</param>
		/// <returns>the derived class</returns>

		var _base = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == fnn &&
			  typeof _base[name] == fnn && fnTest.test(prop[name]) ?
			  (function (name, fn) {
			  	return function () {
			  		/// <summary>
			  		/// A method.  Call base method with <code>this._base(...)</code>.
			  		/// </summary>
			  		/// <returns></returns>

			  		var tmp = this._base;

			  		// Add a new ._base() method that is the same method
			  		// but on the super-class
			  		this._base = _base[name];

			  		// The method only need to be bound temporarily, so we
			  		// remove it when we're done executing
			  		var ret = fn.apply(this, arguments);
			  		this._base = tmp;

			  		return ret;
			  	};
			  })(name, prop[name]) :
			  prop[name];
		}

		// The dummy class constructor
		function Class() {
			/// <summary>
			/// All construction is actually done in the _init method; this prevents multiple asynchronous initialization
			/// </summary>
			if (!initializing && this._init)
				this._init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class._derive = arguments.callee;

		return Class;
	};
})("function");


/******************

		/// test

		var Person = Class._derive({
			_init: function (isDancing) {
				/// <summary>
				/// Is this person dancing?
				/// </summary>
				/// <param name="isDancing" type="bool">yes or no</param>

				// declare properties

				/// <field name="dancing" type="bool">is the person dancing</field>
				this.dancing = isDancing;
			},
			dance: function () {
				console.log("Am I dancing? ", this.dancing);
				return this.dancing;
			}
		});
		var Ninja = Person._derive({
			_init: function () {
				this._base(false);
			},
			dance: function () {
				// Call the inherited version of dance()
				return this._base();
			},
			swingSword: function () {
				console.log("Swinging a sword!");
				return true;
			}
		});

		var Salesman = Person._derive({
			_init: function (dealership) {
				this.dealership = dealership;
				this._base(false);
			}
			,
			sellCar: function (carName) {
				console.log("I'm trying to sell you a ", carName," at ", this.dealership);
				var result = Math.random() > 0.5;
				console.log("Did it work?", result);
				return result;
			}
		});

		var Dancer = Person._derive({
			tutu: 'pink'
		});

		console.log("Person---");
		var p = new Person(true);
		p.dance(); // => true

		console.log("Ninja---");
		var n = new Ninja();
		n.dance(); // => false
		n.swingSword(); // => true

		// Should all be true
		console.log("instance of checking", p instanceof Person && p instanceof Class && n instanceof Ninja && n instanceof Person && n instanceof Class);

		console.log("Salesman---");
		var seller = new Salesman('toyota');
		seller.dance();
		seller.sellCar("prius");

		console.log("Salesman 2---");
		var seller = new Salesman('chevy');
		seller.dance();
		seller.sellCar("camaro");

		console.log("Dancer 1---");
		var d = new Dancer(false);
		d.dance();
		console.log('d is wearing a ', d.tutu, ' tutu');

		console.log("Dancer 2---");
		var d2 = new Dancer(true);
		d2.tutu = "green";
		d2.dance();
		console.log('d is wearing a ', d2.tutu, ' tutu');

*/