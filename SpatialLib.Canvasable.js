; (function (lib, $, undefined) {
	var NS = { css: 'spatial', n: 'SpatialLib.Canvasable' };

	/// <field name="_counter" type="int">counter for unique identifier of each drawable shape</field>
	var _counter = 1
		, debug = function() {
			if (true === DEBUGMODE && console && console.log ) {
				if (console.log.apply)
				console.log.apply(console, Array.prototype.slice.call(arguments, 0));
			else
				console.log(Array.prototype.slice.call(arguments, 0));
			}
		}
		;


	lib.Canvasable = Class._derive({
		_defaults : {
			attachTo: false
			, scale: 1 // px per unit for converting from coordinates to pixels
			, canvas: '#canvas' // default canvas element
			, context: '2d' // default canvas context
			, strokeColor: '#000000' // default drawing color
			, fillColor: '#000000' // default drawing color
			, ink: 'fill' // drawing method - fill or stroke
			, strokeWidth: 3
		}
		,
		_init: function (shape, options) {
			this.options = $.extend({}, this._defaults, options);

			this.Shape = shape; // the thing being drawn
			this.$canvas = $(this.options.canvas); // the jquery object on which to draw the shape
			
			// use scale built in to canvas if requested
			if (true === this.options.scale) {
				// get scale from canvas -- hopefully it was already initialized
				var data = this.$canvas.data(NS.n);
				if( undefined === data ) {
					this.options.scale = this._defaults.scale; // reset
					alert(NS.n + " canvas not initialized, but attempting to use inherent scale.");
				}
				this.options.scale = data.scale;
			}

			// get or create drawn element
			if (this.options.attachTo) {
				this.$el = this.options.attachTo; // canvas object context?
			}
			if (!this.$el || 0 == this.$el.length) {
				this.$el = this.$canvas[0].getContext(this.options.context);
			}

			// attach drawable properties
			this.index = _counter++; // update the index counter

			this.Draw(); // draw to canvas
		}
		,
		Draw: function () {
			debug("rendering index", this.index, this);
			return this.render(); // set appropriate properties on element
		}
		,
		Erase: function() {

		}
		,
		configureContext: function(){
			/// <summary>set context properties</summary>
			this.$el.fillStyle = this.options.fillColor;
			this.$el.strokeStyle = this.options.strokeColor;
			this.$el.lineWidth = this.options.strokeWidth;
			this.$el.save();
		}

	});

	lib.Canvasable.canvasInit = function (selector, size, resetBaseScale) {
		/// <summary>
		/// Get the canvas element and set up properties
		/// </summary>
		/// <param name="selector" type="CssSelector">the DOM element to select</param>
		/// <param name="size" type="int">horizontal size (in relative units), determines drawing unit scale</param>
		/// <param name="resetBaseScale" type="bool">if True, set the base scale for all future Drawable objects (assumes they'll use this canvas)</param>
		/// <returns>the configured canvas</returns>

		var $canvas = $(selector);

		var canvasWidth = $canvas.width()
			, canvasHeight = $canvas.height()
			, drawingScale = canvasWidth / size
			, heightSize = canvasHeight / drawingScale
			;

		$canvas.data(NS.n, {
			scale: drawingScale
			, units: size
		});

		// set for all future drawable
		if (true === resetBaseScale) {
			SpatialLib.Canvasable.prototype._defaults.scale = drawingScale;
			SpatialLib.Canvasable.prototype._defaults.canvas = $canvas;
		}
		

		// add features
		var $origin = $('<em class="' + NS.css + '-axes ' + NS.css + '-origin">(<span class="x">0</span>,<span class="y">0</span>)</em>');
		var $outer = $('<em class="' + NS.css + '-axes ' + NS.css + '-outer">(<span class="x">' + size + '</span>,<span class="y">' + heightSize + '</span>)</em>');
		$canvas.parent().append($origin).append($outer);

		// set properties
		$canvas.data(NS.n + '.init', true); // so we can check if it's a drawable canvas
		$canvas.addClass(NS.css + '-canvas');

		return $canvas;
	}


	lib.CanvasablePolygon = lib.Canvasable._derive({
		_defaults: $.extend({}, lib.Canvasable.prototype._defaults, {
				'close': true
				, 'pointSize': false
			})
		/*
		,
		_init: function(shapes, options) {
			// add some extra defaults
			var defaults = $.extend(this._defaults, {
				'close': true
			});

			// continue as before
			_super._init(shapes, options);
		}
		*/
		,
		ink: function(){
			switch(this.options.ink){
				case 'fill':
					return this.$el.fill();
					break;
				case 'stroke':
					return this.$el.stroke();
					break;
			}
		}
		,
		render: function(){
			// no shapes?  don't do anything
			if( ! (this.Shape instanceof Array && this.Shape.length > 0) ) return false;
			// is first shape a point?  assumes rest will be the same
			if( ! this.Shape[0] instanceof lib.Point ) return false;

			var scaled = function(shape, scale){
				/// <summary>Helper function to scale points</summary>
				return shape.clone().scale(scale);
			}

			// start polygon
			this.$el.beginPath();
			// move to starting point
			var points = [];
			var scaledShape = scaled(this.Shape[0], this.options.scale);
			this.$el.moveTo( scaledShape.x, scaledShape.y );

			// shape is actually the collection
			for(var s in this.Shape) {
				scaledShape = scaled(this.Shape[s], this.options.scale);
				// if we're adding a point at the vertex too, gotta remember the point
				if( false !== this.options.pointSize ) points.push( scaledShape );
				this.$el.lineTo( scaledShape.x, scaledShape.y );
			}

			if( this.options.close ) this.$el.closePath();
			this.ink();
			
			// now, if we're adding points to the vertexes, do it
			for( var p in points ) {
				this.$el.beginPath();
				this.$el.arc( points[p].x-this.options.pointSize, points[p].y-this.options.pointSize, this.options.pointSize, 0, 2*Math.PI);
				this.$el.fill();
			}

		}
	});

	lib.CanvasableRect = lib.Canvasable._derive({
		ink: function(){
			/// <summary>Do the ink method that actually renders the shape</summary>
			
			switch(this.options.ink){
				case 'fill':
					return this.$el.fillRect.apply(this.$el, Array.prototype.slice.call(arguments, 0));
					break;
				case 'stroke':
					return this.$el.strokeRect.apply(this.$el, Array.prototype.slice.call(arguments, 0));
					break;
			}
		}
		,
		render: function () {
			// set properties according to shape
			this.configureContext();

			var scaledShape = this.Shape.clone().scale({ scaleOrigin: true, both: this.options.scale });
			
			debug(this.Shape.toString(), ' x ', this.options.scale, ' = ', scaledShape.toString())

			this.ink(scaledShape.x(), scaledShape.y(), scaledShape.w(), scaledShape.h() );
		}
	});

	lib.CanvasableEllipse = lib.Canvasable._derive({
		ink: function(){
			/// <summary>Do the ink method that actually renders the shape</summary>
			
			switch(this.options.ink){
				case 'fill':
					return this.$el.fill.apply(this.$el, Array.prototype.slice.call(arguments, 0));
					break;
				case 'stroke':
					return this.$el.stroke.apply(this.$el, Array.prototype.slice.call(arguments, 0));
					break;
			}
		}
		,
		render: function () {
			// set properties according to shape
			this.$el.beginPath();
			var scaledShape = this.Shape.clone().scale({ scaleOrigin: true, both: this.options.scale });

			debug(this.Shape.toString(), ' x ', this.options.scale, ' = ', scaledShape.toString());

			var radius = scaledShape.w()/2;
			this.$el.arc(scaledShape.x() - radius, scaledShape.y() - radius, radius, 0, 2*Math.PI);
			this.ink();
		}
	});

})(SpatialLib, jQuery);