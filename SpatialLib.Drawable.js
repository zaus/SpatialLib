; (function (lib, $, undefined) {
	var NS = { css: 'spatial', n: 'SpatialLib.Drawable' };

	/// <field name="_counter" type="int">counter for unique identifier of each drawable shape</field>
	var _counter = 1;

	lib.Drawable = Class._derive({
		_defaults : {
			attachTo: false
				, selector: '.' + NS.css + '-drawable' // how to target with jquery
				, scale: 20 // px per unit for converting from coordinates to pixels
				, canvas: '#canvas' // default canvas element
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
				this.$el = $(this.options.attachTo); // jquery object
			}
			if (!this.$el || 0 == this.$el.length) {
				this.$el = $('<div></div>');
			}

			// attach drawable properties
			this.$el.addClass(NS.css + '-drawable');
			this.index = _counter++; // update the index counter
			this.$el.data(NS.n + '.index', this.index);
			this.$el.addClass(NS.css + '-drawable-' + this.index);

			this.Draw(); // draw to canvas
		}
		,
		Draw: function () {
			if (true === DEBUGMODE) console.log("rendering index", this.index);
			this.render(); // set appropriate properties on element
			this.$canvas.append(this.$el); // reattach
		}
	});

	lib.Drawable.canvasInit = function (selector, size, resetBaseScale) {
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
			SpatialLib.Drawable.prototype._defaults.scale = drawingScale;
			SpatialLib.Drawable.prototype._defaults.canvas = $canvas;
		}
		

		// add features
		var $origin = $('<em class="' + NS.css + '-origin">(<span class="x">0</span>,<span class="y">0</span>)</em>');
		var $outer = $('<em class="' + NS.css + '-outer">(<span class="x">' + size + '</span>,<span class="y">' + heightSize + '</span>)</em>');
		$canvas.append($origin).append($outer);

		// set properties
		$canvas.data(NS.n + '.init', true); // so we can check if it's a drawable canvas
		$canvas.addClass(NS.css + '-canvas');
		$canvas.css('position', 'relative'); // so shapes show up correctly

		return $canvas;
	}

	lib.DrawableRect = lib.Drawable._derive({
		render: function () {
			// make sure canvas is position:relative (necessary? or rely on css?)
			this.$canvas.css('position', 'relative');

			// set properties according to shape
			this.$el.css({
				'position': 'absolute'
				, 'left': this.Shape.x() * this.options.scale
				, 'top': this.Shape.y() * this.options.scale
				, 'width': this.Shape.w() * this.options.scale
				, 'height': this.Shape.h() * this.options.scale
			});

			this.$el.addClass(NS.css + '-drawable-rect');
		}
	});

	lib.DrawableEllipse = lib.Drawable._derive({
		render: function () {
			// make sure canvas is position:relative (necessary? or rely on css?)
			this.$canvas.css('position', 'relative');

			// set properties according to shape

			var center = this.Shape.center()
				, dw = this.Shape.w() / 2
				, dh = this.Shape.h() / 2
			;

			// scale shape? then we don't need to do the math...
			//this.Shape.scale({ scaleOrigin: true, both: this.options.scale });

			this.$el.css({
				'position': 'absolute'
				, 'left': (center.x - dw) * this.options.scale
				, 'top': (center.y - dh) * this.options.scale
				, 'width': this.Shape.w() * this.options.scale
				, 'height': this.Shape.h() * this.options.scale
				// http://www.byteblocks.com/post/2011/04/25/How-to-draw-ellipse-using-CSS.aspx
				, 'border-radius': dw + "px / " + dh + "px"
			});

			this.$el.addClass(NS.css + '-drawable-ellipse');
		}
	});

})(SpatialLib, jQuery);