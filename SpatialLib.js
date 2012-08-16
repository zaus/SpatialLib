/** requires oojs.js */
; var SpatialLib = {}; (function (lib, undefined) {
	/// <summary>
	/// Spatial calculations libray; based on http://upshots.org/javascript/javascript-point-class
	/// </summary>
	/// <param name="lib">local namespace</param>

	// alert for requirements
	if (!Class && !Class._derive) alert("You must include the oojs library `oojs.js` in order to use SpatialLib.");
	

	var _extend = function(a, b, c) {
		/// <summary>
		/// like jQuery.extend -- merge b into a, and optionally c into a (for "cloning")
		/// </summary>
		/// <param name="a" type="Array|JSON">primary list, this will be modified</param>
		/// <param name="b" type="Array|JSON">secondary list, this will be merged</param>
		/// <param name="c" type="Array|JSON">optional tertiary, used for cloning (and so <paramref name="a" /> should be empty object {})</param>
		/// <returns>extended object</returns>

		for(var i in b) {
			if( b.hasOwnProperty(i) ) {
				a[i] = b[i];
			}
		}
		if( undefined !== c ) {
			return _extend(a, c);
		}
		return a;
	};


	lib.Point = Class._derive({
		//#region ---------- setup ------------

		_init: function (x, y) {
			/// <summary>
			/// Create a new Point
			/// </summary>
			/// <param name="x">horizontal coordinate</param>
			/// <param name="y">vertical coordinate</param>

			this.x = x || 0;
			this.y = y || 0;
		}
		,
		clone: function () {
			/// <summary>
			/// Duplicate
			/// </summary>
			/// <returns>completely new instance</returns>
			return new lib.Point(this.x, this.y);
		}
		,
		toString: function () {
			/// <summary>
			/// Human-readable
			/// </summary>
			/// <returns>human-readable string</returns>
			return "(x=" + this.x + ", y=" + this.y + ")";
		}
		,
		//#endregion ---------- setup ------------

		distance: function (p, y) {
			/// <summary>
			/// Return the distance between this and either another Point or the given coordinates
			/// </summary>
			/// <param name="p" type="Point|int">either another Point, or if y also provided, then this is the x-coord</param>
			/// <param name="y" type="int">(optional) the y-coord of the second point.  If provided, then <paramref name="p" /> is the x-coord.</param>
			/// <returns type="int">the distance between both points</returns>

			var w,h;
			// if we have 1 argument, assume it's a point
			if( y === undefined ) {
				w = this.x - p.x;
				h = this.y - p.y;
			}
				// if we have 2 args, assume they're x,y coordinates
			else {
				w = this.x - p;
				h = this.y - y;
			}

			return Math.sqrt(w * w + h * h);
		}
		,
		magnitude: function () {
			/// <summary>
			/// Treating this like a Vector, calculate the length (i.e. distance from origin (0,0))
			/// </summary>
			/// <returns>the size of this Point like a Vector</returns>
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
		,
		aspect: function () {
			/// <summary>
			/// Get the ratio between the x and y values
			/// </summary>
			return this.x / this.y;
		}
		,
		reverse: function() {
			/// <summary>
			/// Flip the x and y coordinates
			/// </summary>
			/// <returns>this, for chaining</returns>

			var t = this.x;
			this.x = this.y;
			this.y = t;

			return this; // chain
		}
		,

		//#region ---------- math ------------
		equals: function (p) {
			/// <summary>
			/// Check if this point is co-existant with another
			/// </summary>
			/// <param name="p" type="Point">the other point to check</param>
			/// <returns>True if equal, false if not</returns>

			return this.x == p.x && this.y == p.y;
		}
		,
		shift: function (p, y) {
			/// <summary>
			/// Add the given offset (as either another Point or values)
			/// </summary>
			/// <param name="p" type="Point|int">either another Point, or a single scalar, or if y also provided, then this is the x-coord</param>
			/// <param name="y" type="int">(optional) the y-coord of the second point.  If provided, then <paramref name="p" /> is the x-coord.</param>

			// if we have 1 argument, check it's a point
			if( p instanceof lib.Point ) {
				this.x += p.x;
				this.y += p.y;
			}
			// 1 arg, assume number, 
			else if (y === undefined) {
				this.x += p;
				this.y += p;
			}
			// 2 args? then they're values
			else {
				this.x += p;
				this.y += y;
			}

			return this; // chain
		}
		,
		scale: function (p, y) {
			/// <summary>
			/// Multiply by the given offset (as either another Point or values)
			/// </summary>
			/// <param name="p" type="Point|int">either another Point, or a single scalar, or if y also provided, then this is the x-coord</param>
			/// <param name="y" type="int">(optional) the y-coord of the second point.  If provided, then <paramref name="p" /> is the x-coord.</param>

			// if first arg is a Point, use it
			if( p instanceof lib.Point ) {
				this.x *= p.x;
				this.y *= p.y;
			}
			// 1 arg, assume number, 
			else if (y === undefined) {
				this.x *= p;
				this.y *= p;
			}
			// 2 args? then they're values
			else {
				this.x *= p;
				this.y *= y;
			}

			return this; // chain
		}

		//#endregion ---------- math ------------
	});

	lib.Size = lib.Point._derive({
		toString: function(){
			/// <summary>
			/// Human-readable; alias
			/// </summary>
			/// <returns>human-readable string</returns>
			return "(w=" + this.x + ", h=" + this.y + ")";
		}
	});

	lib.Vector = lib.Point._derive({
		clone: function () {
			/// <summary>
			/// Duplicate
			/// </summary>
			/// <returns>completely new instance</returns>
			return new lib.Vector(this.x, this.y);
		}
		,
		normalize: function (thickness) {
			/// <summary>
			/// Normalize (stretch) this Vector onto a new scale, with an optional scalar (default 1)
			/// </summary>
			/// <param name="thickness" type="int">(default: 1) scale normalized value by this factor</param>
			var f = this.magnitude();
			this.x = this.x / f * (thickness || 1);
			this.y = this.y / f * (thickness || 1);

			return this; // chain
		}
		,
		dot_product: function(p2) {
			/// <summary>
			/// Dot product two vectors
			/// </summary>
			/// <remarks>See http://www.vitutor.com/geometry/vec/vector_projection.html</remarks>
			/// <param name="p2" type="Point">another vector to project on to</param>
			return this.x * p2.x + this.y * p2.y;
		}
		,
		project: function (a) {
			/// <summary>
			/// Project this vector onto another vector, get the scalar value of the projection
			/// </summary>
			/// <remarks>See http://www.vitutor.com/geometry/vec/vector_projection.html</remarks>
			/// <param name="a" type="Point">(default: unit vector) another vector to project on to</param>
			/// <returns>The scalar projection of the two vectors</returns>
			if( undefined === a ) a = new lib.Point(1,1);

			return a.dot_product(this) / a.magnitude();
		}
		,
		projection: function(a) {
			/// <summary>
			/// Project this vector onto another vector; get the vector
			/// <example>b onto a = (a.b)/|a| * b/|b|, where this is b</example>
			/// </summary>
			/// <remarks>See http://www.vitutor.com/geometry/vec/vector_projection.html</remarks>
			/// <param name="a" type="Point">(default: unit vector) another vector to project on to</param>
			/// <returns>The vector projection of the two vectors</returns>
			
			var scalar = this.project(a) / a.magnitude();
			
			var result = a.clone().scale( scalar ); // (a.b)/|a| * a/|a| = {(a.b)/|a|}/|a| * a = a_scalar_proj / a_mag * a
			this.x = result.x;
			this.y = result.y;

			return this; // chain
		}
	});

	lib.Rectangle = Class._derive({
		_init: function (x, y, w, h) {
			/// <summary>
			/// Initialize either from two points or two sets of coordinates
			/// </summary>
			/// <param name="x" type="Point|int">either position Point or horizontal coordinate</param>
			/// <param name="y" type="Point|int">either dimensions or vertical coordinate</param>
			/// <param name="w">horizontal dimension</param>
			/// <param name="h">vertical dimension</param>

			// initialize with two points
			if (x instanceof lib.Point && y instanceof lib.Point) {
				this.origin = new lib.Point(x.x, x.y);
				this.dimensions = new lib.Size(y.x, y.y);
			}
			// otherwise, we're given coords
			else {
				this.origin = new lib.Point(x, y);
				this.dimensions = new lib.Size(w, h);
			}
		}
		,
		clone: function () {
			/// <summary>
			/// Duplicate
			/// </summary>
			/// <returns>completely new instance</returns>
			return new lib.Rectangle(this.x(), this.y(), this.w(), this.h());
		}
		,
		equals: function (/* lib.Rectangle */ rect) {
			/// <summary>
			/// Check if two shapes are equivalent
			/// </summary>
			/// <param name="rect" type="Rectangle>the item for comparison</param>
			/// <returns>True if they share the origin and dimensions</returns>
			if (!rect instanceof lib.Rectangle) return false;
			return this.dimensions.equals(rect.dimensions) && this.origin.equals(rect.origin);
		}
		,
		equalDimensions: function (item) {
			/// <summary>
			/// Check if the item shares the same dimensions
			/// </summary>
			/// <param name="item" type="Rectangle|Size|Point>the item with a size to compare</param>
			/// <returns>True if this shares the same dimensions as the item</returns>

			if (item instanceof lib.Rectangle) {
				return this.dimensions.equals(item.dimensions);
			}
			else if (item instanceof lib.Point) {
				return this.dimensions.equals(item);
			}
			// all else fails
			return false;
		}
		,
		//#region -------- accessors ----------

		x: function (val) {
			/// <summary>
			/// GET/SET Origin.X - starting horizontal position
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the horizontal position</returns>
			if( undefined === val ) return this.origin.x;
			this.origin.x = val;
		}
		,
		y: function (val) {
			/// <summary>
			/// GET/SET Origin.Y - starting vertial position
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the vertical position</returns>
			if( undefined === val ) return this.origin.y;
			this.origin.y = val;
		}
		,
		x2: function(val) {
			/// <summary>
			/// GET/SET OuterBound.X - ending horizontal position
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the horizontal position</returns>
			if( undefined === val ) return this.origin.x + this.dimensions.x;
			this.dimensions.x = val - this.origin.x;
		}
		,
		y2: function(val) {
			/// <summary>
			/// GET/SET OuterBound.Y - ending vertical position
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the vertical position</returns>
			if( undefined === val ) return this.origin.y + this.dimensions.y;
			this.dimensions.y = val - this.origin.y;
		}
		,
		w: function (val) {
			/// <summary>
			/// Dimensions.Width - horizontal size
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the horizontal dimension</returns>
			if( undefined === val ) return this.dimensions.x;
			this.dimensions.x = val;
		}
		,
		h: function (val) {
			/// <summary>
			/// Dimensions.Height - vertical size
			/// </summary>
			/// <param name="val" type="int">if provided, set the value</param>
			/// <returns>the vertical dimension</returns>
			if( undefined === val ) return this.dimensions.y;
			this.dimensions.y = val;
		}
		,
		center: function () {
			/// <summary>
			/// Return the center of the shape
			/// </summary>
			/// <returns>the center coordinates of the shape</returns>

			return new lib.Point((this.x() + this.x2()) / 2, (this.y() + this.y2()) / 2);
		}
		,
		//#endregion -------- accessors ----------

		toString: function () {
			return "[Origin: " + this.origin.toString() + "; Size: " + this.dimensions.toString() + "]";
		}
		,

		aspect: function () {
			/// <summary>
			/// Get the aspect (w/h) of this shape
			/// </summary>
			/// <returns>the ration between w and h</returns>
			return this.dimensions.aspect();
		}
		,
		contains: function(item) {
			/// <summary>
			/// Does this shape contain the given item(s) (Point or Rect)
			/// </summary>
			/// <param name="item" type="Point|Rect|Array">the item(s) to check</param>
			/// <returns>True if the item is within the boundaries</returns>

			// what kind?
			if (item instanceof lib.Point) {
				// need to save this to a variable or returns undefined???
				return (
					this.x() <= item.x && item.x <= this.x2()
					&&
					this.y() <= item.y && item.y <= this.y2()
				);
			}// is Point
			else if (item instanceof lib.Rectangle) {
				
				return (
					// inner
					this.x() <= item.x() && item.x() <= this.x2()
					&&
					this.y() <= item.y() && item.y() <= this.y2()
					&&
					// outer
					this.x() <= item.x2() && item.x2() <= this.x2()
					&&
					this.y() <= item.y2() && item.y2() <= this.y2()
					);

			}// is Rectangle

			// or if we have a list of items, check that they're all contained
			else if (item instanceof Array) {
				var result = true;
				for (var i in item) {
					//UnitTests.log("contains rect - loop", i, item[i], resultContains);
					result = result && this.contains(item[i]);
					//UnitTests.log("  contains rect - after loop", i, item[i], resultContains);

				}
				return result;
			}// is Array
			
			return undefined;
		}// .contains
		,


		//#region -------- adjusting ----------

		scale: function (options) {
			/// <summary>
			/// Scale the shape, either just the dimensions or also the origin
			/// </summary>
			/// <param name="options" type="number|JSON">If given as a number, scale the dimensions.  If JSON, merge with default options (scaleOrigin, width, height, both).</param>
			/// <param name="scaleOrigin" type="bool">if true, also scale the starting point of this shape</param>
			/// <param name="width" type="number">scale the width/x values by this number</param>
			/// <param name="height" type="number">scale the height/y values by this number</param>
			/// <param name="both" type="number">scale all values by this number</param>
			/// <returns>this shape, for chaining</returns>

			// just scale dimensions, not origin
			if (typeof options == "number") {
				this.dimensions.scale(options);
				return this; // chain and quit
			}

			// otherwise, assume options is a JSON of options, so merge with defaults
			options = _extend({}, {
				"scaleOrigin": false // only scale the dimensions, unless instructed otherwise
				, "width": 1 // scale just the width/x values
				, "height": 1 // scale just the height/y values
				, "both": 1 // scale them both the same number
			}, options);

			// scale each dimension individually and together (if necessary)
			this.dimensions.scale(options.width, options.height);
			if( 1 != options.both ) this.dimensions.scale(options.both);

			// are we also scaling the starting point?
			if (true === options.scaleOrigin) {
				this.origin.scale(options.width, options.height);
				if( 1 != options.both ) this.origin.scale(options.both);
			}

			return this; // chain
		}
		,
		shift: function (options) {
			/// <summary>
			/// Shift the shape by the given coordinates/value; optionally only shift the origin while locking the outer vertex
			/// </summary>
			/// <param name="options" type="number|JSON">If given as a number, shift the shape.  If JSON, merge with default options (lockOuter, x, y, both).</param>
			/// <param name="lockOuter" type="bool">if true, keep the opposite vertex in the same position</param>
			/// <param name="x" type="number">shift the width/x values by this number</param>
			/// <param name="y" type="number">shift the height/y values by this number</param>
			/// <param name="both" type="number">shift all values by this number</param>
			/// <returns>this shape, for chaining</returns>

			// just shift the origin, not doing anything else
			if (typeof options == "number") {
				this.origin.shift(options);
				return this; // chain and quit
			}

			// otherwise, assume options is a JSON of options, so merge with defaults
			options = _extend({}, {
				"lockOuter": false // when shifting the origin, keep the opposite vertex in the same position
				, "x": 1 // shift just the width/x values
				, "y": 1 // shift just the height/y values
				, "both": 1 // shift them both the same number
			}, options);

			// scale each dimension individually and together (if necessary)
			this.origin.shift(options.x, options.y);
			if (1 != options.both) this.origin.shift(options.both);

			// are we supposed to lock the outer point?  if so, shift the dimensions to keep the same point
			if (true === options.lockOuter) {
				this.dimensions.shift(-options.x, -options.y);
				if (1 != options.both) this.dimensions.shift(-options.both);
			}

			return this; // chain
		}
		,

		fitTo: function (/*lib.Point*/ bounds, /*bool*/ fitOriginIfRect, /*bool*/ returnFactor) {
			/// <summary>
			/// Scale shape to fit within bounds, preserving aspect ratio.
			/// </summary>
			/// <param name="bounds" type="Point|Rectangle">the bounding shape; if <paramref name="fitOrigin"> is given, will also set origin.</param>
			/// <param name="fitOriginIfRect" type="bool">(default: true) if the bounds are a rectangle, also match the origins</param>
			/// <param name="returnFactor" type="bool">if True, return the scaling factor; otherwise, just scale this shape and chain</param>
			/// <returns></returns>

			// if we're given another rect
			if (bounds instanceof lib.Rectangle) {
				// also fit origin if NOT explicitly told NOT to 
				if (false !== fitOriginIfRect) {
					this.origin = bounds.origin.clone();
				}
				// continue as though it were a point
				bounds = bounds.dimensions;
			}

			// equal? stop and "fail"?

			var scaleFactor;
			if (this.equalDimensions(bounds)) {
				scaleFactor = 1;
				return returnFactor ? scaleFactor : this;
			}

			if (this.aspect() > bounds.aspect()) {
				scaleFactor = bounds.x / this.w();
			}
			else {
				scaleFactor = bounds.y / this.h();
			}

			// do we just want the factor?
			if (returnFactor) return scaleFactor;

			// otherwise, scale and return
			this.scale(scaleFactor);

			return this; // chain
		}//	fn	.fitTo

		//#endregion -------- adjusting ----------

	});



	lib.Rectangle.getBounds = function (list) {
		/// <summary>
		/// Given a list of shapes, find the outermost bounding vertices containing all the shapes
		/// </summary>
		/// <param name="list" type="Array{Rectangle}">the list of shapes to bound</param>
		/// <returns>the new boundary shape</returns>

		// if we're not given a list
		if (! list instanceof Array) {
			if (! list instanceof lib.Rectangle) {
				return false; // error
			}

			return list; // if we just have one Rectangle, it's bounded by itself
		}// is !Array

		// loop, find the min/max vertex from the list
		var
			minX = Number.POSITIVE_INFINITY
			, minY = Number.POSITIVE_INFINITY
			, maxX = Number.NEGATIVE_INFINITY
			, maxY = Number.NEGATIVE_INFINITY
		;
		for (var i in list) {
			var item = list[i];

			// min -- technically, we only care if `trim`
			if (item.x() < minX) minX = item.x();
			if (item.y() < minY) minY = item.y();

			// max
			if (item.x2() > maxX) maxX = item.x2();
			if (item.y2() > maxY) maxY = item.y2();
		}

		// here we would check if "trim", and if not return (0,0) for the origin
		// instead of (minX, minY)
		// or we would have ignored the "min" checking above

		return new lib.Rectangle(minX, minY, maxX-minX, maxY-minY);
	};

	lib.Rectangle.fitTo = function (list, container) {
		/// <summary>
		/// Fit the list of shapes to a new coordinate plane bounded by the given container
		/// </summary>
		/// <param name="list">the list of shapes</param>
		/// <param name="container">new coordinate plane</param>
		/// <returns>true if it worked, false if not</returns>

		// if we're not given a list
		if (!list instanceof Array) {
			if (!list instanceof lib.Rectangle) {
				return false; // error
			}

			// turn single Rectangle into array so rest works
			list = [list];
		}// is !Array

		var bounds = lib.Rectangle.getBounds(list);
		// fit the bounds to the container to get the ratio
		var fitScale = bounds.fitTo(container, false, true);

		// now loop to resize each shape
		for (var i in list) {
			list[i]
				// move so that we're flush with new origin
				.shift({ x: -bounds.x(), y: -bounds.y() })
				// also scale origin to fit new coordinate system
				.scale({ scaleOrigin: true, both: fitScale });
		}

		return true;
	};

})(SpatialLib);