/* ===========================================================
 * jquery.pophelper.js
 * ===========================================================
 * Copyright 2013 Francesco Smelzo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * mutate plugin : http://www.jqui.net/jquery-projects/jquery-mutate-official/
 * =========================================================== */

//{{{ mutate http://www.jqui.net/jquery-projects/jquery-mutate-official/ 
!(function($) {
mutate_event_stack = [
			{
				name: 'width',
				handler: function (elem){
					n = {el:elem}
					if(!$(n.el).data('mutate-width'))$(n.el).data('mutate-width', $(n.el).width());
					if ($(n.el).data('mutate-width')&&$(n.el).width() != $(n.el).data('mutate-width')  ) {
						$(n.el).data('mutate-width', $(n.el).width());
						return true;
					}
					return false;
				}
			},
			{
				name:'height',
				handler: function (n){
					element = n;
					if(!$(element).data('mutate-height'))$(element).data('mutate-height', $(element).height());
					if ($(element).data('mutate-height')&&$(element).height() != $(element).data('mutate-height')  ) {
						$(element).data('mutate-height', $(element).height());
						return true;
					}
				}
			},
			{
				name		: 'top',
				handler 	: function (n){
					if(!$(n).data('mutate-top'))$(n).data('mutate-top', $(n).css('top'));
					
					if ($(n).data('mutate-top')&&$(n).css('top') != $(n).data('mutate-top')  ) {
						$(n).data('mutate-top', $(n).css('top'));
						return true;
					}
				}
			},
			{
				name		: 'bottom',
				handler 	: function (n){
					if(!$(n).data('mutate-bottom'))$(n).data('mutate-bottom', $(n).css('bottom'));
					
					if ($(n).data('mutate-bottom')&&$(n).css('bottom') != $(n).data('mutate-bottom')  ) {
						$(n).data('mutate-bottom', $(n).css('bottom'));
						return true;
					}
				}
			},
			{
				name		: 'right',
				handler 	: function (n){
					if(!$(n).data('mutate-right'))$(n).data('mutate-right', $(n).css('right'));
					
					if ($(n).data('mutate-right')&&$(n).css('right') != $(n).data('mutate-right')  ) {
						$(n).data('mutate-right', $(n).css('right'));
						return true;
					}
				}
			},
			{
				name		: 'left',
				handler 	: function (n){
					if(!$(n).data('mutate-left'))$(n).data('mutate-left', $(n).css('left'));
					
					if ($(n).data('mutate-left')&&$(n).css('left') != $(n).data('mutate-left')  ) {
						$(n).data('mutate-left', $(n).css('left'));
						return true;
					}
				}
			},
			{
				name		: 'hide',
				handler 	: function (n){ if ($(n).is(':hidden'))	return true; }
			},
			{
				name		: 'show',
				handler 	: function (n){ if ($(n).is(':visible'))	return true; }
			},
			{
				name		: 'scrollHeight',
				handler 	: function (n){
					if(!$(n).data('prev-scrollHeight'))$(n).data('prev-scrollHeight', $(n)[0].scrollHeight);
					
					if ($(n).data('prev-scrollHeight')&&$(n)[0].scrollHeight != $(n).data('prev-scrollHeight')  ) {
						$(n).data('prev-scrollHeight', $(n)[0].scrollHeight);
						return true;
					}
				}
			},
			{
				name		: 'scrollWidth',
				handler 	: function (n){
					if(!$(n).data('prev-scrollWidth'))$(n).data('prev-scrollWidth', $(n)[0].scrollWidth);
					
					if ($(n).data('prev-scrollWidth')&&$(n)[0].scrollWidth != $(n).data('prev-scrollWidth')  ) {
						$(n).data('prev-scrollWidth', $(n)[0].scrollWidth);
						return true;
					}
				}
			},
			{
				name		: 'scrollTop',
				handler 	: function (n){
					if(!$(n).data('prev-scrollTop'))$(n).data('prev-scrollTop', $(n)[0].scrollTop());
					
					if ($(n).data('prev-scrollTop')&&$(n)[0].scrollTop() != $(n).data('prev-scrollTop')  ) {
						$(n).data('prev-scrollTop', $(n)[0].scrollTop());
						return true;
					}
				}
			},
			{
				name		: 'scrollLeft',
				handler 	: function (n){
					if(!$(n).data('prev-scrollLeft'))$(n).data('prev-scrollLeft', $(n)[0].scrollLeft());
					
					if ($(n).data('prev-scrollLeft')&&$(n)[0].scrollLeft() != $(n).data('prev-scrollLeft')  ) {
						$(n).data('prev-scrollLeft', $(n)[0].scrollLeft());
						return true;
					}
				}
			}
		];
  mutate = {
    speed: 1,
    event_stack: mutate_event_stack,
    stack: [],
    events: {},
    add_event: function(evt) {
      mutate.events[evt.name] = evt.handler;
    },
    add: function(event_name, selector, callback, false_callback) {
      mutate.stack[mutate.stack.length] = {
        event_name: event_name,
        selector: selector,
        callback: callback,
        false_callback: false_callback
      }
    }
  };

  function reset() {
    var parent = mutate;
    if (parent.event_stack != 'undefined' && parent.event_stack.length) {
      $.each(parent.event_stack, function(j, k) {
        mutate.add_event(k);
      });
    }
    parent.event_stack = [];
    $.each(parent.stack, function(i, n) {
      $(n.selector).each(function(a, b) {
        if (parent.events[n.event_name](b) === true) {
          if (n['callback']) n.callback(b, n);
        } else {
          if (n['false_callback']) n.false_callback(b, n)
        }
      })
    })
    setTimeout(reset, mutate.speed);
  }
  reset();
  $.fn.extend({
    mutate: function() {
      var event_name = false,
          callback = arguments[1],
          selector = this,
          false_callback = arguments[2] ? arguments[2] : function() {};
      if (arguments[0].toLowerCase() == 'extend') {
        mutate.add_event(callback);
        return this;
      }
      $.each($.trim(arguments[0]).split(' '), function(i, n) {
        event_name = n;
        mutate.add(event_name, selector, callback, false_callback);
      });
      return this;
    }
  });
})(jQuery);
//}}} mutate

!function ($) {
 
 //{{{ POPHELPER
  
  var defaults = {
      placement: 'bottom' //changed default placement (right) to bottom
    , trigger: 'click'
    , popTarget : null // element to re-target popover
    , html : true
    , tip : false //use title as Tooltip
    , container : 'body'
    //content
    , contentTarget : null // take as content an element in page
    , cloneContentTarget : false
    , href : '' //external document
    , content: ''
    , activeClass : 'active' // CSS class for the toggler when active
    // dimensions of popover
    , width :'auto'
    , maxWidth :'auto'
    , minWidth :'auto'
    , height :'auto'
    , maxHeight :'auto'
    , minHeight :'auto'
    , template: function (){
        var cls = this.type;
        return '<div class="' + cls + '"><div class="arrow"></div><div class="' + cls + '-content"></div></div>';
    }
    };
    
 /* POPHELPER PUBLIC CLASS DEFINITION
  * =============================== */

  var Pophelper = function (element, options) {
    this.init('pophelper', element, options);
  };

  $('body').on('mousedown','.pophelper',function (event){
      event.stopPropagation();
  });
    
  /* NOTE: POPHELPER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */
  var PophelperExtension = {
    constructor: Pophelper
    //{{{ getOption 
    , getOption : function (name, defaultValue){
        var v = this.options[name];
        if (!v) v = defaultValue;
        return v;
    }
    //}}} getOption
    , setupGlobalEvents : function (){
        var element = this.$element ,
            //o = this.options ,
            //$tip = this.tip(),
            self = this;
        $(window).bind('resize  mousedown' , function (e){
          // if  element has pophelper-toggle skip hide
          if (e.type=="mousedown" && e.target && $(e.target).hasClass(self.type + '-toggle')) {
            return ;
          }
          if (self.tip().is('.in')) self.hide();
        });
        $(element).bind('click mousedown mouseover focus', function (event){
             event.stopPropagation();
        });
        if ($(element).is('button,a')){
          //prevent submit or navigate actions
          $(element).bind('click',function (event){
            event.preventDefault();
          });
        }
    }
    , eventTrigger : function (name){
      var e = $.Event(this.type + '.'  + name),
        el = this.$element;
        el.trigger(e);
        return e;
    }
    , setupElement  : function (){
      //add class to toggler
        this.$element.addClass(this.type + '-toggler');
        this.eventTrigger('before.setup');
        
    }
    // wrap show function
    , show : function (){
        var _show = $.fn.tooltip.Constructor.prototype.show;
        var el = this.$element,
            togglerActiveClass = this.getOption('activeClass','active');
            el.addClass(togglerActiveClass);
        var self=this;
        _show.call(self);
    }
    // wrap hide function
    , hide : function (){
        var _hide = $.fn.tooltip.Constructor.prototype.hide;
        var el = this.$element,
            togglerActiveClass = this.getOption('activeClass','active');
            el.removeClass(togglerActiveClass);
        var self=this;
        _hide.call(self);
    }
    , setupTooltip : function (){
      var self = this,tip;
      if(tip = self.getOption('tip')) {
        var placement = self.getOption('placement');
        if(placement=='top'||placement=='bottom') {
            placement=(placement=='top'?'bottom':'top');
        }
        else if(placement=='left'||placement=='right') {
            placement=(placement=='left'?'right':'left');
        }
        self.$element.tooltip({
          title:tip
          , placement : placement
        });
      }
    }
    , init: function (type, element, options) {
        var _init = $.fn.tooltip.Constructor.prototype.init;
        // parse options before call parent's init
        this.type = type;
        this.$element = $(element);
        this.setupElement();
        this.options = this.getOptions(options);
        this.setupGlobalEvents();
        var self = this ,
            href = this.getOption ('href',''),
            load = this.getOption ('load',''),
            contentTarget = this.getOption ('contentTarget','');
        var parentInit = function (){
            _init.call(self,type, element, options);
            self.setupTooltip();
            self.eventTrigger('after.setup');
        };
        if(href) {
            //{{{ load from external document
            jQuery.ajax({
              url : href ,
              type : 'GET',
              cache : true ,
              dataType : 'html'
            })
            .success (function (response){
              parentInit();
              options.content = self.options.content = response;  
            })
            .error (function (){
              //if external document is not loaded
              parentInit();
            });
            return ;
          //}}} 
        }
        else if (contentTarget && $(contentTarget).length) {
            parentInit();
            options.content = self.options.content  = self.options.cloneContentTarget ? $(contentTarget).clone():$(contentTarget);
            return ;
        }
        parentInit();
    }
  , getPosition: function () {
      var el = this.$element[0];
      var popTarget = this.getOption('popTarget');
      if (popTarget) el = $(popTarget)[0];
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, $(el).offset())
    }
  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent();
      if (title){
        var titleEl = $tip.find('.'+ this.type + '-title');
        if (!titleEl.length){
          titleEl = $('<div class="' + this.type + '-title"></div>').prependTo($tip);
        }
        titleEl.html(title);
      }
      
      var tipContent =  $tip.find('.' + this.type + '-content');
      if (content instanceof jQuery){
          tipContent.append(content.removeClass('hide').show());
      }
      else {
        tipContent[this.options.html ? 'html' : 'text'](content);
      }
      $tip.removeClass('fade top bottom left right in');
    }

  , hasContent: function () {
      return true;
      //return this.getTitle() || this.getContent() || 1;
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options;
      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content');

      return content;
  }
  , refreshPosition: function () {
      var $tip
        , $arrow
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp;
        $tip = this.tip();
        if (!$tip.hasClass('in')) return ;
        $arrow = $tip.find('.arrow');
        var arrowHeight = $arrow.outerHeight(true)||0;
        var arrowWidth = $arrow.outerWidth(true)||0;
        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement;
        pos = this.getPosition();
        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;
        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height + arrowHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
            break
          case 'top':
            tp = {top: pos.top - actualHeight - arrowHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2 , left: pos.left - actualWidth - arrowWidth};
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2 , left: pos.left + pos.width + arrowWidth};
            break
        }
        
        this.applyPlacement(tp, placement);
    }

  , buildTip: function() {
      var self = this;
      this.$tip = $(this.options.template.call(this)).addClass(this.type);
      $tip = this.$tip;
      var dimensions = ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
      $.each(dimensions, function(i, propertyName) {
        var property = self.getOption(propertyName, null);
        if (property && property != 'auto') {
          $tip.css(propertyName, parseInt(property) + 'px');
        }
      });
      var title = this.getTitle();
      var titleEl = $tip.find('.' + this.type + '-title');
      if (title) {
        if (!titleEl.length) {
          titleEl = $('<div class="' + this.type + '-title"></div>').prependTo($tip);
        }
      }
      $('<button type="button" class="close">&times;</button>').prependTo(this.$tip).click(function() {
        self.hide();
      });
      this.$tip.mutate('height width',function (element,info){
        self.refreshPosition();
      });
      // assign width first time shown
      this.$element.one('shown',function (){
        var width = self.$tip.outerWidth();
        self.$tip.css('width',self.$tip.outerWidth() + 'px');
      });
  }
  , tip: function () {
      if (!this.$tip) {
        this.buildTip();
      }
      return this.$tip
    }
  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }
  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }
  Pophelper.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, PophelperExtension);

// {{{ POPHELPER PLUGIN DEFINITION
  var old = $.fn.pophelper

  $.fn.pophelper = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('pophelper')
        , options = typeof option == 'object' && option;
      if (!data) $this.data('pophelper', (data = new Pophelper(this, options)));
      if (typeof option == 'string') {
        // call function
        if ($.isFunction(data[option])){
          data[option]();
        }
      }
    })
  }

  $.fn.pophelper.Constructor = Pophelper

  $.fn.pophelper.defaults = $.extend({} , $.fn.tooltip.defaults, defaults)
//}}}

 /* POPHELPER NO CONFLICT
  * =================== */

  $.fn.pophelper.noConflict = function () {
    $.fn.pophelper = old
    return this
  }
// }}} POPHELPER

}(window.jQuery);
