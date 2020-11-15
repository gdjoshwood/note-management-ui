import "./App.scss";
import { useState, useCallback, useEffect } from "react";

const serializedNotes =
  localStorage && JSON.parse(localStorage.getItem("notes"));
const serializedAutoIncrementId =
  localStorage && parseInt(localStorage.getItem("autoIncrementId"));
const PRIORITY_TYPES = ["High", "Normal", "Low"];

const DEFAULT_NEW_NOTE_VALUE = "";
const DEFAULT_NEW_NOTE_ID = 0;
const DEFAULT_NEW_NOTE_PRIORITY = PRIORITY_TYPES[2];

const getNoteIndexFromElementWithList = (element, notes) => {
  const uniqueId = parseInt(
    element.target.closest(".NoteItem").dataset.noteIndex
  );
  return notes.map((e) => e.id).indexOf(uniqueId);
};

function App() {
  const [notes, setNotes] = useState(serializedNotes || []);
  const getNoteIndexFromElement = (e) =>
    getNoteIndexFromElementWithList(e, notes);
  const [newNoteId, setNewNoteId] = useState(
    serializedAutoIncrementId || DEFAULT_NEW_NOTE_ID
  );
  const [newNoteValue, setNewNoteValue] = useState(DEFAULT_NEW_NOTE_VALUE);
  const [searchNotesValue, setSearchNotesValue] = useState("");
  const [newNotePriority, setNewNotePriority] = useState(
    DEFAULT_NEW_NOTE_PRIORITY
  );
  useEffect(() => {
    // Serialize on any state change
    localStorage.setItem("notes", JSON.stringify(notes));
  });

  // Create Functionality
  const addNoteHandler = useCallback(
    (e) => {
      e.preventDefault();
      setNotes([
        ...notes,
        {
          content: { value: newNoteValue, dirty: newNoteValue },
          priority: { value: newNotePriority, dirty: newNotePriority },
          id: newNoteId,
        },
      ]);
      setNewNoteValue(DEFAULT_NEW_NOTE_VALUE);
      const autoIncrementId = newNoteId + 1;
      localStorage.setItem("autoIncrementId", autoIncrementId);
      setNewNoteId(autoIncrementId);
    },
    [newNoteValue, newNotePriority, newNoteId, notes]
  );

  const changeNewNoteValue = useCallback((e) => {
    setNewNoteValue(e.currentTarget.value);
  }, []);
  const changeNewNotePriority = useCallback((e) => {
    setNewNotePriority(e.currentTarget.value);
  }, []);

  // Modification Functionality
  const editNoteValue = useCallback(
    (e) => {
      const newNotes = [...notes];
      const noteIndex = getNoteIndexFromElement(e);
      newNotes[noteIndex].content.dirty = e.target.value;
      setNotes(newNotes);
    },
    [notes, getNoteIndexFromElement]
  );

  const editNotePriority = useCallback(
    (e) => {
      const newNotes = [...notes];
      const noteIndex = getNoteIndexFromElement(e);
      newNotes[noteIndex].priority.dirty = e.target.value;
      setNotes(newNotes);
    },
    [notes, getNoteIndexFromElement]
  );

  const toggleEditMode = useCallback(
    (e) => {
      const newNotes = [...notes];
      const noteIndex = getNoteIndexFromElement(e);
      newNotes[noteIndex].isEditing = !newNotes[noteIndex].isEditing;
      setNotes(newNotes);
    },
    [notes, getNoteIndexFromElement]
  );

  const commitEdits = useCallback(
    (e) => {
      const newNotes = [...notes];
      const noteIndex = getNoteIndexFromElement(e);
      const newValue = newNotes[noteIndex].content.dirty;
      const newPriority = newNotes[noteIndex].priority.dirty;

      newNotes[noteIndex].content = { dirty: newValue, value: newValue };
      if (newNotes[noteIndex].priority !== newPriority) {
        const autoIncrementId = newNoteId + 1;
        localStorage.setItem("autoIncrementId", autoIncrementId);
        setNewNoteId(autoIncrementId);
        newNotes[noteIndex].id = autoIncrementId;
      }
      newNotes[noteIndex].priority = { dirty: newPriority, value: newPriority };

      newNotes[noteIndex].isEditing = false;
      setNotes(newNotes);
    },
    [notes, getNoteIndexFromElement]
  );

  // Delete functionality
  const deleteNote = useCallback(
    (e) => {
      const newNotes = [...notes];
      newNotes.splice(getNoteIndexFromElement(e), 1);
      setNotes(newNotes);
    },
    [notes, getNoteIndexFromElement]
  );

  // Search functionality
  const changeSearchNotesValue = useCallback((e) => {
    setSearchNotesValue(e.target.value);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Note Manager</h1>
        {searchNotesValue && (
          <span>Searching notes for "{searchNotesValue}"</span>
        )}
      </header>
      <div className="Notes">
        {(() => {
          if (notes.length === 0) {
            return (
              <div className="EmptyHero">
                Get started by making a note <div className="Indicator">⬇</div>
              </div>
            );
          }

          return PRIORITY_TYPES.map((priority) => (
            <ul key={priority} className={`NoteList ${priority}`}>
              {(() => {
                const notesByPriority = notes.filter(
                  (note) => note.priority.value === priority
                );
                let notesFormatted = notesByPriority.sort(
                  (a, b) => a.id - b.id
                );
                if (searchNotesValue) {
                  notesFormatted = notesFormatted.filter(
                    (note) => note.content.value.indexOf(searchNotesValue) > -1
                  );
                }
                if (notesFormatted.length === 0) {
                  return (
                    <div className="EmptyState">
                      No {priority.toLowerCase()} priority notes
                      {searchNotesValue ? " found" : ""}
                    </div>
                  );
                }
                return notesFormatted.map((note) => (
                  <li
                    key={note.id}
                    data-note-index={note.id}
                    className="NoteItem"
                  >
                    {note.isEditing ? (
                      <div className="NoteItemControls">
                        <textarea
                          value={note.content.dirty}
                          autoFocus
                          onChange={editNoteValue}
                        />
                        <select
                          value={note.priority.dirty}
                          onChange={editNotePriority}
                        >
                          {PRIORITY_TYPES.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="NoteItemContent">
                        {note.content.value}
                      </span>
                    )}
                    <div className="NoteItemActions">
                      {note.isEditing ? (
                        <button onClick={commitEdits} type="button">
                          Save
                        </button>
                      ) : (
                        <span onClick={toggleEditMode}>Edit</span>
                      )}
                      {note.isEditing ? (
                        <span onClick={toggleEditMode}>Cancel</span>
                      ) : (
                        <span onClick={deleteNote}>Delete</span>
                      )}
                    </div>
                  </li>
                ));
              })()}
            </ul>
          ));
        })()}
      </div>
      <div className="AppActions">
        <form onSubmit={addNoteHandler} className="NoteCreator">
          <label>
            <textarea
              placeholder="Jot down your thoughts..."
              className="NoteCreatorInput"
              autoFocus
              value={newNoteValue}
              onChange={changeNewNoteValue}
            />
            <span>Make New Note</span>
          </label>
          <div className="FieldGroup">
            <label>
              <span>Priority&nbsp;</span>
              <select
                defaultValue={DEFAULT_NEW_NOTE_PRIORITY}
                onChange={changeNewNotePriority}
              >
                {PRIORITY_TYPES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Create</button>
          </div>
        </form>
        <div className="LiveSearch">
          <label>
            <textarea
              placeholder="Type something to begin filtering your notes..."
              className="NoteCreatorInput"
              value={searchNotesValue}
              onChange={changeSearchNotesValue}
            />
            <span>Search Your Notes</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
