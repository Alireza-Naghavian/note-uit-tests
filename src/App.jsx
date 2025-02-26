import { useState } from "react";
import "./App.css";
import NoteApp from "./components/NoteApp";
import NoteHeader from "./components/NoteHeader";
import { NotesProvider } from "./context/NotesContext";

function App() {
  const [sortBy, setSortBy] = useState("latest");
  return (
    <NotesProvider>
      <div className="container">
        <NoteHeader sortBy={sortBy} onSort={(e) => setSortBy(e.target.value)} />
       <NoteApp sortBy={sortBy}/>
      </div>
    </NotesProvider>
  );
}

export default App;
