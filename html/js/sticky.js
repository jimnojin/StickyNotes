;(function(ns) {
    var noteStyles = ['blue', 'yellow', 'pink'];
    
	function Note(config) {
	    config = config || {};
		this.id = config.id || '_' + (Math.random().toString(36).substr(2, 9)); // ID or pseudo random ID
		this.x = config.x || App.container.position().left + 20;
		this.y = config.y || App.container.position().top + 20;
		this.title = config.title || '' ;
		this.text =config.text || '';
		this.style = config.style || noteStyles[Math.round(Math.random() * (noteStyles.length - 1))];
		this.minimized = !!config.minimized || false;
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
            	that.setEvents();
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
		setEvents: function() {
		    var that = this;
		    var elem = $('#' + this.id);
		    elem.on('doubletap', App.editNote);
		},
		remove: function() {
		    $('#' + this.id).fadeOut('fast', function() { $(this).remove() });

		},
		
		minmaxClick: function(e) {
		    /*
		    var elem = $('#' + this.id);
		    if (this.minimized) {
		        this.minimized = false;
		        $('.mintitle', elem).html('');
    		    $(elem).animate({height: 150 }, 'fast', function() {
    		        elem.find('.title, .text').show();
    		    });
		    } else {
		        this.minimized = true;
		        elem.find('.title, .text').hide();
    		    elem.animate({height: $('.header', elem).height() }, 'fast', function() {
    		        $('.mintitle', $(this)).html($('.title', $(this)).html());
    		    });
		    }
		    */
		}
	}
    
    ns.StickyNote = Note;
})(App);