SpatialLib
==========

Spatial/Geometry library for Javascript.  Provides object-oriented methods for manipulating Points, Vectors, Shapes, etc.  A jumping-off point for extending to other geometric shapes and functionality.

Yes there are lots of these, but it's fun to roll your own!


Contains
--------

The library currently contains:

0. Object-oriented wrapper
0b. "Unit Test" helper
1. Points
2. Vectors
3. Rectangles
4. Drawable extension (DOM/jQuery based)
    a. Drawable Rectangle
    b. Drawable Ellipse

OOJS
----

Object-oriented wrapper for Javascript.  Simplifies inheritance and prototyping.  Based on examples:
* http://ejohn.org/blog/simple-javascript-inheritance/
* http://phrogz.net/js/classes/OOPinJS2.html

Usage:
    
    // derive from base class
    var Person = Class._derive({
        _init: function(){ /* constructor */ }
        , move: function(distance){ /* a method */ }
    });
    
    // extend Person
    var Salesman = Person._derive({
        _init: function(dealership){
            this.dealership = dealership; // public property
            this._base._init(); // super
        }
        ,
        sellCar: function(car){
            alert("Come on down to " + this.dealership + " and buy a " + car);
        }
    });
    
    // instances
    var fredanderson = new Salesman("Toyota");
    var leith = new Salesman("Honda");
    
    fredanderson.sellCar('Prius');
    leith.sellCar('Civic');

See a better example at the bottom of the source file, in the comments.


SpatialLib
----------

The main library, containing methods/objects for shape manipulation.

_Tip:_ clone each object when using _update_ functions to preserve original shape.

See `tests.html` for examples and limited testing.

### Point ###

1. **clone** - copy of object
2. **distance** - calculate distance from another Point or coordinates
3. **magnitude** - like a Vector, the distance from origin (0,0) to the Point
4. **aspect** - ratio between X and Y (really more relevant when using a Point as Size)
5. **reverse** - flip X and Y
6. **equals** - compare to another Point
7. **shift** - shift (add) coordinates by another Point or coordinates, or by a scalar
8. **scale** - scale (multiply) coordinates by another Point or coordinates, or by a scalar


### Size ###

Same as a Point, just has a different `toString()` representation.

### Vector ###

1. **normalize** - stretch the Vector onto a new scale
2. **dot_product** - dot product
3. **project** - get the scalar projection onto another Vector
4. **projection** - update Vector as the projection onto another Vector


### Rectangle ###

0. **origin**, **dimensions** - properties (both Points)
1. **equalDimensions** - like _equals_, but only checking dimensions (not origin)
2. **x**, **y**, **w**, **h**, **x2**, **y2**, **center** - position/dimension accessors
3. **contains** - does this shape contain the other Point | Rectangle, or a list of several of the two
4. **scale** - scale the dimensions (and optionally the origin) by a width, height, or both value
5. **shift** - shift the coordinates (and optionally the dimensions by locking the outer coordinate) by an x, y, or both value
6. **fitTo** - scale the shape to fit within given bounds, preserving aspect ratio.  Optionally just return the scaling factor (useful when fitting multiple shapes to a container).

1. **getBounds** - "static" method to get the containing bounds of multiple shapes
2. **fitTo** - "static" method to fit a list of shapes to a bounds


Drawable
--------

Extension library for rendering SpatialLib objects as DOM objects on a "canvas".

See `drawing.html` for examples.