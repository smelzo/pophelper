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
 * =========================================================== */

!function ($) {
 
 //{{{ POPHELPER
  
  var defaults = {
      placement: 'bottom' //changed default placement (right) to bottom
    , trigger: 'click'
    , popTarget : null // element to re-target popover
    , html : true
    , tip : false //use title as Tooltip
    //content
    , contentTarget : null // take as content an element in page
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

  Pophelper.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {
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
        $(window).bind('resize  mousedown' , function (){
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
    , setupElement  : function (){
      //add class to toggler
      var e = $.Event('elementSetup'),
          el = this.$element;
        el.trigger(e)
        if (e.isDefaultPrevented()) return
        el.addClass(this.type + '-toggler');
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
        console.log(placement);
        self.$element.tooltip({
          title:tip
          , placement : placement
        });
        console.log( self.$element.data());
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
            options.content = self.options.content  = $(contentTarget);
            console.log(options.content);
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
  //, show: function () {
  //    var _show = $.fn.tooltip.Constructor.prototype.show;
  //    _show.call(this);
  //  }

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
        console.log('jQuery');
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
  , buildTip : function (){
    var self=this;
    this.$tip = $(this.options.template.call(this))
    .addClass(this.type);
    $tip = this.$tip;
    var dimensions = ['width','height','minWidth','maxWidth','minHeight','maxHeight'];
    $.each(dimensions,function (i, propertyName){
      var property = self.getOption(propertyName,null);
      if (property && property!='auto'){
        $tip.css(propertyName, parseInt(property) + 'px');
      }
    });
    var title = this.getTitle();
    var titleEl = $tip.find('.'+ this.type + '-title');
    if (title){
        if (!titleEl.length){
          titleEl = $('<div class="' + this.type + '-title"></div>').prependTo($tip);
        }
    }
    $('<button type="button" data-dismiss="' + this.type + '" class="close">&times;</button>')
      .prependTo(this.$tip)
      .click(function (){
        self.hide();
      });
  }
  , tip: function () {
      if (!this.$tip) {
        this.buildTip();
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


// {{{ POPHELPER PLUGIN DEFINITION
  var old = $.fn.pophelper

  $.fn.pophelper = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('pophelper')
        , options = typeof option == 'object' && option
      if (!data) $this.data('pophelper', (data = new Pophelper(this, options)))
      if (typeof option == 'string') data[option]()
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
