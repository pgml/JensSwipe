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
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author     Rico Dang <http://www.pgml.de>
 * @copyright  2015-2018 Rico Dang
 * @version    0.2.3
 * @date       18/04/2018
 */

(function($)
{
	//{{{ $.fn.JensSwipe
	$.fn.extend(
	{
		JensSwipe(options)
		{
			return this.each(function()
			{
				new $.JensSwipe(this, options);
			});
		}
	}); //}}}

	//{{{ $.JensSwipe
	$.JensSwipe = function(domElem, options)
	{
		//{{{ global defines
		this.jens        = $(domElem);
		this.options     = options;
		this.opts        = $.extend({}, this.DEFAULT_OPTS, this.options);
		this.elemIndex   = this.jens.index();
		//}}}
		this._execHook('constructor');
		this.swipe();
	}; //}}}

	$.JensSwipe.prototype =
	{
		DEFAULT_OPTS: {
			preventDefault: true,
			offset: 50,
			onSwipeLeft: null,
			onSwipeRight: null,
			onSwipeUp: null,
			onSwipeDown: null
		},
		DIRECTIONS: ['Left', 'Right', 'Up', 'Down'],

		swipeStartX: null,
		swipeEndX  : null,
		swipeStartY: null,
		swipeEndY  : null,
		currPosY   : null,
		currPosX   : null,
		status     : '',

		//{{{ swipe() function
		swipe()
		{
			this.jens
			.off('touchstart touchmove touchend')
			.on({
				touchstart: (e) =>
				{
					if (this.opts.preventDefault)
						e.preventDefault();

					this.swipeStartX = Math.floor(
						this.getPagePos(e).pageX - this.getJensOffset().left);
					this.swipeStartY = Math.floor(
						this.getPagePos(e).pageY - this.getJensOffset().top);
					this.status      = 'touchStart';

					// send status and coords on touchstart
					$.each(this.DIRECTIONS, (index, direction) =>
					{
						let fn = `onSwipe${direction}`;
						if (this.isFn(this.opts[fn]))
							this.opts[fn](
								this.swipeStartX,
								this.swipeStartY,
								this.status,
								e,
								this.jens
							);
					});
				},
				touchmove: (e) =>
				{
					if (this.opts.preventDefault)
						e.preventDefault();

					this.currPosX = Math.floor(
						this.getPagePos(e).pageX - this.getJensOffset().left);
					this.currPosY = Math.floor(
						this.getPagePos(e).pageY - this.getJensOffset().top);
					this.status   = 'touchMove';

					// send status and coords on touchmove
					$.each(this.DIRECTIONS, (index, direction) =>
					{
						let fn = `onSwipe${direction}`;

						if (this.isFn(this.opts[fn]))
							this.opts[fn](
								this.currPosX,
								this.currPosY,
								this.status,
								e,
								this.jens
							);
					});
				},
				touchend: (e) =>
				{
					this.swipeEndX = Math.floor(
						this.getPagePos(e, 'changedTouches').pageX - this.getJensOffset().left);
					this.swipeEndY = Math.floor(
						this.getPagePos(e, 'changedTouches').pageY - this.getJensOffset().top);
					this.status    = 'touchEnd';

					if ((this.swipeStartX - this.opts.offset) > this.swipeEndX)
						if (this.isFn(this.opts.onSwipeLeft))
							this.opts.onSwipeLeft(this.swipeEndX, this.swipeEndY, this.status, e, this.jens);

					if ((this.swipeStartX + this.opts.offset) < this.swipeEndX)
						if (this.isFn(this.opts.onSwipeRight))
							this.opts.onSwipeRight(this.swipeEndX, this.swipeEndY, this.status, e, this.jens);

					if ((this.swipeStartY - this.opts.offset) > this.swipeEndY)
						if (this.isFn(this.opts.onSwipeUp))
							this.opts.onSwipeUp(this.swipeEndX, this.swipeEndY, this.status, e, this.jens);

					if ((this.swipeStartY + this.opts.offset) < this.swipeEndY)
						if (this.isFn(this.opts.onSwipeDown))
							this.opts.onSwipeDown(this.swipeEndX, this.swipeEndY, this.status, e, this.jens);
				}
			});
		},

		getPagePos(e, type)
		{
			type = type || 'touches';
			return {
				pageX: e.originalEvent[type][0].pageX,
				pageY: e.originalEvent[type][0].pageY,
			};
		},

		getJensOffset()
		{
			return {
				left: this.jens.offset().left,
				top: this.jens.offset().top,
			};
		},

		//{{{ isFn }}}
		isFn(fn)
		{
			return typeof fn === 'function';
		}, //}}}

		//{{{ _execHook() function
		_execHook(method)
		{
			method = method || null;

			eval(
				"if (typeof this._hook" + method + " == 'function')" +
				"this._hook" + method + "()"
			);
		} //}}}
	};

})(jQuery);
