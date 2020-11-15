import logo from './logo.svg';
import './App.scss';
import {useState, useCallback, useEffect} from 'react';



const serializedNotes = localStorage && JSON.parse(localStorage.getItem('notes'));
const PRIORITY_TYPES = ['Low', 'Medium', 'High']

const DEFAULT_NEW_NOTE_VALUE = '';
const DEFAULT_NEW_NOTE_ID = 0;
const DEFAULT_NEW_NOTE_PRIORITY = PRIORITY_TYPES[0];

const getNoteIndexFromElementWithList = (element, notes) => {
  const uniqueId = parseInt(element.target.closest('.NoteItem').dataset.noteIndex);
  return notes.map(e => e.id).indexOf(uniqueId);
}

function App() {
  const [notes, setNotes] = useState(serializedNotes || []);
  const getNoteIndexFromElement = e => getNoteIndexFromElementWithList(e, notes);
  const [newNoteId, setNewNoteId] = useState(DEFAULT_NEW_NOTE_ID);
  const [newNoteValue, setNewNoteValue] = useState(DEFAULT_NEW_NOTE_VALUE); 
  const [newNotePriority, setNewNotePriority] = useState(DEFAULT_NEW_NOTE_PRIORITY); 

  useEffect(() => {
    // Serialize on any state change
    localStorage.setItem('notes', JSON.stringify(notes))
  });


  // Create Functionality
  const addNoteHandler = useCallback((e) => {
    setNotes([...notes, {
      content: {value: newNoteValue, dirty: newNoteValue}, 
      priority: {value: newNotePriority, dirty: newNotePriority}, 
      id: newNoteId
    }]);
    setNewNoteValue(DEFAULT_NEW_NOTE_VALUE);
    setNewNoteId(newNoteId + 1);
  }, [newNoteValue, newNotePriority])

  const changeNewNoteValue = useCallback((e) => {
    setNewNoteValue(e.currentTarget.value);
  }, [])
  const changeNewNotePriority = useCallback((e) => {
    setNewNotePriority(e.currentTarget.value);
  }, [])

  // Modification Functionality
  const editNoteValue = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndexFromElement(e);
    newNotes[noteIndex].content.dirty = e.target.value;
    setNotes(newNotes);

  }, [notes])

  const editNotePriority = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndexFromElement(e);
    newNotes[noteIndex].priority.dirty = e.target.value;
    setNotes(newNotes);

  }, [notes])

  const toggleEditMode = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndexFromElement(e);
    newNotes[noteIndex].isEditing = !newNotes[noteIndex].isEditing
    setNotes(newNotes);
  }, [notes])

  const commitEdits = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndexFromElement(e);
    const newValue = newNotes[noteIndex].content.dirty
    const newPriority = newNotes[noteIndex].priority.dirty

    newNotes[noteIndex].content = { dirty: newValue, value: newValue}
    newNotes[noteIndex].priority = { dirty: newPriority, value: newPriority}
    
    newNotes[noteIndex].isEditing = false
    setNotes(newNotes);
  }, [notes])


  // Delete functionality
  const deleteNote = useCallback((e) => {
    const newNotes = [...notes]
    newNotes.splice(getNoteIndexFromElement(e), 1);
    setNotes(newNotes);
  }, [notes])
  
  return (
    <div className="App">
      <div className="Notes">
        {PRIORITY_TYPES.map(priority => <ul className={`NoteList ${priority}`}>
          {(() => {
            const notesByPriority = notes.filter((note => note.priority.value === priority))
            return notesByPriority.map(note => <li data-note-index={note.id} className="NoteItem">
              {note.isEditing 
                ? <div className="NoteItemControls">
                    <input type="text" value={note.content.dirty} autoFocus onChange={editNoteValue}/>
                    <select value={note.priority.dirty} onChange={editNotePriority}>
                      {PRIORITY_TYPES.map(priority => 
                        <option value={priority}>{priority}</option>
                      )}
                    </select>
                  </div>
                : <span>{note.content.value}</span>
              }
              <div className="NoteItemActions">
              {note.isEditing
                ? <button onClick={commitEdits} type="button">Save</button>
                : <span onClick={toggleEditMode}>Edit</span>}
              {note.isEditing 
                ? <span onClick={toggleEditMode}>Cancel</span>
                : <span onClick={deleteNote}>Delete</span>}
              </div>
            </li>)
          })()}
        </ul>)}

      </div>
      <div className="AppActions">
        <div className="NoteCreator">
          <input autoFocus type="text" value={newNoteValue} onChange={changeNewNoteValue}/>
          <select onChange={changeNewNotePriority}>
            {PRIORITY_TYPES.map(priority => 
              <option value={priority}>{priority}</option>
            )}
          </select>
          <button type="button" onClick={addNoteHandler}>Add Note</button>
        </div>
      </div>
    </div>
  );
}

export default App;
