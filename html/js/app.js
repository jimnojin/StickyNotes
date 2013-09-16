var App = (function() {
    var KEY = 'stickyNotesDemoData';
    var notes = {};

    function init() {
        if (!('localStorage' in window)) {
            alert ('localStorage is not supported!');
            return;
        } 
        setEvents();
        
        loadAll();
        for (var key in notes) {
            notes[key].render();
        }
    }
    
    function setEvents() {
        $('#createNote').on('tap', function() {
            var note = new App.StickyNote();
            note.render();
            notes[note.id] = note;
        });
        $('#saveAll').on('tap', saveAll);
        $('#deleteNote').on('tap', function() {
                
        });

        $(document).delegate('#minMaxNote', 'tap', App.toggleMinNote);
         
         $(document).delegate('#deleteNote', 'tap', App.removeNote);
    }
    
    function loadAll() {
        var data = App.Storage.load(KEY);
        if (data) {
            notes = JSON.parse(data);
            for (var key in notes) {
                notes[key] = new App.StickyNote(notes[key]);
            }
        }
    }
    function saveAll() {
        App.Storage.save(KEY, JSON.stringify(notes));
    }
    
    function getNote(id) {
        if (!!notes[id] === true) {
            return notes[id];
        }
        return false;
    }
    function removeNote(id) {
        if (!!App.currentlyEdited) {
            App.getNote(App.currentlyEdited).remove(); 
            delete notes[id];
            App.Storage.remove(id);
	        App.save();
            $.mobile.changePage('#', {transition: 'flip'});
        }
    }
    function updateNote(sender) {
        if ($('#newNoteTitle').val().trim() != '' && $('#newNoteText').val().trim() != '') {
            if ($(sender).data('edit') == true) {
                notes[App.currentlyEdited].title = $('#newNoteTitle').val();
                notes[App.currentlyEdited].text = $('#newNoteText').val();
                notes[App.currentlyEdited].render();
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
            App.save();
            
            $('#saveNote').data('edit', false);
            App.currentlyEdited = '';
            $.mobile.changePage('#', {transition: 'flip'});
        } else {
            if ($('#newNoteTitle').val().trim() == '') {
                $('#newNoteTitle').parent().addClass('error');
            } else {
                $('#newNoteTitle').parent().removeClass('error');
            }
            if ($('#newNoteText').val().trim() == '') {
                $('#newNoteText').parent().addClass('error');
            } else {
                $('#newNoteText').parent().removeClass('error');
            }
        }
    }
    function createNote() {
        $('#deleteNote, #minMaxNote').hide();
        $('#newNoteTitle').val('');
        $('#newNoteText').val('');
    }
    function editNote(e) {
        App.currentlyEdited = $(e.delegateTarget).attr('id');
        var note = App.getNote(App.currentlyEdited);
        $('#deleteNote, #minMaxNote').show();
        
        if (note.minimized) {
                $('#minMaxNote .ui-icon').removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
                $('#minMaxNote').find('.ui-btn-text').text('Maximize');
        } else {
            $('#minMaxNote .ui-icon').removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
            $('#minMaxNote').find('.ui-btn-text').text('Minimize');
        }
            
        $('#saveNote').data('edit', true);
        $('#newNoteTitle').val(note.title);
        $('#newNoteText').val(note.text);
        $.mobile.changePage('#createNewDialog', {transition: 'flip'});
    }
    function toggleMinNote() {
        var note = getNote(App.currentlyEdited);
        if (note.minimized) {
            note.minimized = false;
            note.render();
            $.mobile.changePage('#', {transition: 'slideup'});
        } else {
            note.minimized = true;
            note.render();
            $.mobile.changePage('#', {transition: 'slidedown'});
        } 
    }
    
    return {
        init: init,
        getNote: getNote,
        removeNote: removeNote,
        createNote: createNote,
        editNote: editNote,
        updateNote: updateNote,
        toggleMinNote: toggleMinNote,
        save: saveAll
    }
})();

