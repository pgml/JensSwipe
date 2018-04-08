 /*
 * :tabSize=2:indentSize=2:noTabs=false:
 * :folding=explicit:collapseFolds=1:
 *
 * NOTICE OF LICENSE
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
Â * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author     Rico Dang <http://www.pgml.de>
 * @copyright  2015 Rico Dang
 * @version    0.1.0 beta (0.1.0.3)
 */

(function($)
{
	// override & extend JensSwipe defaults
	ADDONS_DEFAULTS = {
		enableDragDetection: true,
		enableScrollDetection: true,
		onDragLeft: null,
		onDragRight: null,
		onDragUp: null,
		onDragDown: null,
		onScroll: null
	};

	var SwipeAddons = $.JensSwipe.prototype;

	//{{{ constructor
	SwipeAddons._hookconstructor = function()
	{
		$.each(ADDONS_DEFAULTS, (property, value) =>
		{
			if (typeof this.options[property] == 'undefined')
				this.opts[property] = value;
		});
		if (this.opts.enableDragDetection)
			this.drag();

		if (this.opts.enableScrollDetection)
			this.scroll();
	}; //}}}

	//{{{ drag() function
	SwipeAddons.drag = function(e)
	{
		var self       = this
		  , o          = self.opts
		  , dragStartX = null
		  , dragEndX   = null
		  , dragStartY = null
		  , dragEndY   = null
		  , currPosY   = null
		  , currPosX   = null
		  , status     = ''
		  , offset     = o.offset
		  , mousedown  = false;

		self.jens.off('mousedown').on('mousedown', function(e)
		{
			dragStartX = Math.floor(e.pageX - self.jens.offset().left);
			dragStartY = Math.floor(e.pageY - self.jens.offset().top);
			status     = 'dragStart';
			mousedown  = true;

			// send status and coords on dragStart
			$.each(self.DIRECTIONS, function(index, direction)
			{
				var fn = 'onDrag' + direction;

				if (self.isFn(o[fn]))
					o[fn](dragStartX, dragStartY, status);
			});
		});

		self.jens.off('mousemove').on('mousemove', function(e)
		{
			if (!mousedown)
				return;

			currPosX = Math.floor(e.pageX - self.jens.offset().left);
			currPosY = Math.floor(e.pageY - self.jens.offset().top);
			status   = 'dragging';

			// send status and coords on mousemove
			$.each(self.DIRECTIONS, function(index, direction)
			{
				var fn = 'onDrag' + direction;

				if (self.isFn(o[fn]))
					o[fn](currPosX, currPosY, status);
			});
		});

		self.jens.off('mouseup').on('mouseup', function(e)
		{
			dragEndX  = Math.floor(e.pageX - self.jens.offset().left);
			dragEndY  = Math.floor(e.pageY - self.jens.offset().top);
			status    = 'dragEnd';
			mousedown = false;

			if ((dragStartX - offset) > dragEndX)
				if (self.isFn(o.onDragLeft))
					o.onDragLeft(dragEndX, dragEndY, status);

			if ((dragStartX + offset) < dragEndX)
				if (self.isFn(o.onDragRight))
					o.onDragRight(dragEndX, dragEndY, status);

			if ((dragStartY - offset) > dragEndY)
				if (self.isFn(o.onDragUp))
					o.onDragUp(dragEndX, dragEndY, status);

			if ((dragStartY + offset) < dragEndY)
				if (self.isFn(o.onDragDown))
					o.onDragDown(dragEndX, dragEndY, status);
		});
	} //}}}

	//{{{ scroll() function
	SwipeAddons.scroll = function(e)
	{
		var self      = this
		  , o         = self.opts
		  , direction = null;

		self.jens
		.off('mousewheel DOMMouseScroll MozMousePixelScroll')
		.on('mousewheel DOMMouseScroll MozMousePixelScroll', function(e)
		{
			var oEvent = e.originalEvent

			if (oEvent.axis)
			{
				if (oEvent.axis == 2)
				{
					axis      = 'y';
					direction = 'up';

					if (oEvent.detail > 0)
						direction = 'down';
				}
				else
				{
					axis = 'x';

					if (oEvent.detail > 6)
						direction = 'right';
					else if (oEvent.detail < -6)
						direction = 'left';
				}
			}
			else
			{
				if (oEvent.deltaY != 0)
				{
					axis      = 'y';
					direction = 'up';

					if (oEvent.deltaY > 0)
						direction = 'down';
				}

				if (oEvent.deltaX != 0)
				{
					axis = 'x';

					if (oEvent.deltaX > 6)
						direction = 'right';
					else if (oEvent.deltaX < -6)
						direction = 'left';
				}
			}

			o.onScroll(direction, axis)
		});

	} //}}}


})(jQuery);