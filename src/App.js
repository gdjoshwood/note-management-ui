import logo from './logo.svg';
import './App.css';
import {useState, useCallback} from 'react';

const DEFAULT_NEW_NOTE = '';

const getNoteIndex = (element) => {
  return parseInt(element.target.closest('.NoteItem').dataset.noteIndex);
}

function App() {
  const [notes, setNotes] = useState([]);
  const [newNoteValue, setNewNoteValue] = useState(DEFAULT_NEW_NOTE); 
  const addNoteHandler = useCallback((e) => {
    
    setNotes([...notes, {content: newNoteValue, dirtyValue: newNoteValue}]);
    setNewNoteValue(DEFAULT_NEW_NOTE);
  }, [newNoteValue])
  const changeNewNote = useCallback((e) => {
    
    setNewNoteValue(e.currentTarget.value);
  }, [])

  const editNote = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndex(e);
    newNotes[noteIndex].dirtyValue = e.target.value;
    setNotes(newNotes);

  }, [notes])

  const toggleEditMode = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndex(e);
    newNotes[noteIndex].isEditing = !newNotes[noteIndex].isEditing
    setNotes(newNotes);
  }, [notes])

  const commitEditValue = useCallback((e) => {
    const newNotes = [...notes];
    const noteIndex = getNoteIndex(e);
    const newValue = newNotes[noteIndex].dirtyValue
    newNotes[noteIndex] = {
      content: newValue,
      dirtyValue: newValue,
    }
    setNotes(newNotes);
  }, [notes])

  const deleteNote = useCallback((e) => {
    const newNotes = [...notes]
    newNotes.splice(getNoteIndex(e), 1);
    setNotes(newNotes);
  }, [notes])

  return (
    <div className="App">
      <ul className="NoteList">
        {notes.map((note, idx) => <li data-note-index={idx} className="NoteItem">
          {note.isEditing 
            ? <input type="text" value={note.dirtyValue} autoFocus onChange={editNote}/>
            : <span>{note.content}</span>
          }
          <div className="NoteItemControls">
          {note.isEditing
            ? <button onClick={commitEditValue} type="button">Save</button>
            : <span onClick={toggleEditMode}>Edit</span>}
          {note.isEditing 
            ? <span onClick={toggleEditMode}>Cancel</span>
            : <span onClick={deleteNote}>Delete</span>}
          </div>
        </li>)}
      </ul>
      <div className="NoteCreator">
        <input autoFocus type="text" value={newNoteValue} onChange={changeNewNote}/>
        <button type="button" onClick={addNoteHandler}>Add Note</button>
      </div>
    </div>
  );
}

export default App;
