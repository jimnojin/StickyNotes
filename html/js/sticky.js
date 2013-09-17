;(function(ns) {
    var noteStyles = ['blue', 'yellow', 'pink'];
    
	function Note(cfg) {
	    var config = $.extend({
	    	id : '_' + (Math.random().toString(36).substr(2, 9)), //  pseudo random ID
	    	x: App.container.position().left + 20,
	    	y: App.container.position().top + 20,
	    	title: '',
	    	text: '',
	    	style: noteStyles[Math.round(Math.random() * (noteStyles.length - 1))],
	    	minimized: false
	    }, cfg);

		this.id = config.id;
		this.x = config.x;
		this.y = config.y;
		this.title = config.title;
		this.text =config.text;
		this.style = config.style;
		this.minimized = config.minimized;
	}
	
	Note.prototype = {
	    render: function() {
		    var that = this;
		    var elem = $('#' + this.id);
		    if (elem.length > 0) {
		        $('.title, .mintitle', elem).text(this.title);
		        $('.text', elem).text(this.text);
		        if (this.minimized) {
		            elem.addClass('minimized', 'fast');
		        } else {
		            elem.removeClass('minimized', 'fast');
		        }
		    } else {
		        var rotation = Math.round(Math.random() * 20 - 10); // random angle (-10..10)deg rotation
    		    var html = ['<div class="note ', this.style, '" id="', this.id, '" data-state="max" style="display: none; top: ', this.y, 'px; left: ', this.x, 'px;  -webkit-transform: rotate(', rotation, 'deg);">',
            				    '<div class="header">',
            				        '<div class="pin"></div>',
            					    '<div class="mintitle"></div>',
            				    '</div>',
            				    '<div class="title">', this.title, '</div>',
            				    '<div class="text">', this.text, '</div>',
            			    '</div>'
            	    	].join('');
            	App.container.append(html);
            	elem = $('#' + this.id);
            	
            	elem.fadeIn('fast');
        	    elem.draggable({
            	    containment: "parent",
              	    drag: function(e, ui) {
            	        that.x = ui.offset.left;
            	        that.y = ui.offset.top;
            	    }
                });
		    }
		    if (this.minimized) {
        	    elem.addClass('minimized', 'fast');
        	    $('.title, .text', elem).hide();
        	    $('.mintitle', elem).html(this.title);
        	} else {
        	    elem.removeClass('minimized', 'fast');
        	    $('.mintitle', elem).html('');
        	    $('.title, .text', elem).show();
        	}
		},
		remove: function() {
		    $('#' + this.id).fadeOut('fast', function() { $(this).remove() });
		}
	}
    
    ns.StickyNote = Note;
})(App);