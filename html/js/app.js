var App = (function() {
    
    var notes = {};
    var currentlyEdited;
    
     /**
     * localStorage manipulation.
     */
    var Storage = (function() {
        var KEY = 'stickyNotesDemoData';
        return {
            save: function(value) {
                localStorage.setItem(KEY, value);
            },
            load: function() {
                return localStorage.getItem(KEY);
            },
            remove: function() {
                localStorage.clear()
            }
        }
    })();
    
    function saveToStorage() {
        Storage.save(JSON.stringify(notes));
    }
    
    function init() {
        setUIEvents();
        
        var data = Storage.load();
        if (data) {
            notes = JSON.parse(data);
            for (var key in notes) {
                notes[key] = new App.StickyNote(notes[key]);
                notes[key].render();
            }
        }
    }
    
    function setUIEvents() {
        $('#createNoteBtn').on('tap', createNote);
        $('#saveAllBtn').on('tap', saveToStorage);
        
        $(document).delegate('#saveNoteBtn', 'tap', updateNote);
        $(document).delegate('#minMaxNoteBtn', 'tap', toggleMinNote);
        $(document).delegate('#deleteNoteBtn', 'tap', removeNote);
        $(document).delegate('.note', 'doubletap', editNote);
        $(document).delegate('.note', 'dragstop', saveToStorage);
    }
    
    function getNote(id) {
        if (!!notes[id] === true) {
            return notes[id];
        }
        return false;
    }
    function removeNote() {
        if (!!currentlyEdited) {
            getNote(currentlyEdited).remove(); 
            delete notes[currentlyEdited];
            saveToStorage();
            $.mobile.changePage('#', {transition: 'flip'});
        }
    }
    function updateNote(sender) {
        if ($('#newNoteTitle').val().trim() !== '' && $('#newNoteText').val().trim() !== '') {
            if ($(sender.currentTarget).data('edit') === true) {
                notes[currentlyEdited].title = $('#newNoteTitle').val();
                notes[currentlyEdited].text = $('#newNoteText').val();
                notes[currentlyEdited].render();
            } else {
                var newNote = new App.StickyNote({
                    x: 40,
                    y: 140,
                    title: $('#newNoteTitle').val(),
                    text: $('#newNoteText').val()
                });
            
                notes[newNote.id] = newNote;
                notes[newNote.id].render();
            }
            saveToStorage();
            
            $('#saveNoteBtn').data('edit', false);
            currentlyEdited = '';
            $.mobile.changePage('#', {transition: 'flip'});
        } else {
            if ($('#newNoteText').val().trim() === '') {
                $('#newNoteText').addClass('error').focus();
            } else {
                $('#newNoteText').removeClass('error');
            }
            if ($('#newNoteTitle').val().trim() === '') {
                $('#newNoteTitle').parent().addClass('error').focus();
            } else {
                $('#newNoteTitle').parent().removeClass('error');
            }
        }
    }
    function createNote() {
        $('#saveNoteBtn').data('edit', false);
        $('#deleteNoteBtn, #minMaxNoteBtn').hide();
        $('#newNoteTitle').val('');
        $('#newNoteText').val('');
        $.mobile.changePage('#createNewDialog', { transition: 'flip' });
    }
    function editNote(e) {
        currentlyEdited = $(e.currentTarget).attr('id');
        var note = getNote(currentlyEdited);
        $('#deleteNoteBtn, #minMaxNoteBtn').show();
        $('#newNoteTitle').parent().removeClass('error');
        $('#newNoteText').removeClass('error');
        if (note.minimized) {
            // check if elem is already initialized by jQM
            if ($('#minMaxNoteBtn .ui-icon').length > 0) {
                $('#minMaxNoteBtn .ui-icon').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
                $('#minMaxNoteBtn .ui-btn-text').text('Maximize');
            } else {
                $('#minMaxNoteBtn').attr('data-icon', 'arrow-u').text('Maximize');
            }
        } else {
            $('#minMaxNoteBtn .ui-icon').removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
            $('#minMaxNoteBtn').find('.ui-btn-text').text('Minimize');
        }
            
        $('#saveNoteBtn').data('edit', true);
        $('#newNoteTitle').val(note.title);
        $('#newNoteText').val(note.text);
        $.mobile.changePage('#createNewDialog', {transition: 'flip'});
    }
    function toggleMinNote() {
        var note = getNote(currentlyEdited);
        if (note.minimized) {
            note.minimized = false;
            note.render();
            $.mobile.changePage('#', {transition: 'slideup'});
        } else {
            note.minimized = true;
            note.render();
            $.mobile.changePage('#', {transition: 'slidedown'});
        } 
        saveToStorage();
    }
    
	$(document).ready(function() {
	    if (!('localStorage' in window)) {
            $('div[data-role=page] div[data-role=content]').html('localStorage not supported! <a data-role="button" href="http://google.com/chrome">Get Chrome!</a>');
            throw new Error('localStorage is not supported! Get Google Chrome!');
        } 
        
		App.container = $('#container');
		App.container.height($(document).height() - $('#header').height());
		App.init();
	});
			
    return {
        init: init
    };
})();