import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { NotesProvider } from "../../context/NotesContext";
import NoteApp from "../NoteApp";
import NoteHeader from "../NoteHeader";

const addNoteHandler = (notes) => {
  const titleInput = screen.getByPlaceholderText(/Note title/i);
  const descInput = screen.getByPlaceholderText(/Note description/i);
  const btn = screen.getByRole("button", { value: "Add New Note" });
  notes.forEach((note) => {
    fireEvent.change(titleInput, { target: { value: note.title } });
    fireEvent.change(descInput, { target: { value: note.desc } });
    fireEvent.click(btn);
  });
};
describe("add new notes test", () => {
  test("#1:empty inputs after submit", () => {
    render(
      <NotesProvider>
        <NoteApp sortBy={"latest"} />
      </NotesProvider>
    );
    const titleInput = screen.getByPlaceholderText(/Note title/i);
    const descInput = screen.getByPlaceholderText(/Note description/i);
    addNoteHandler([
      { title: "note title1", desc: "note desc 1" },
      { title: "note title2", desc: "note desc 2" },
    ]);
    expect(titleInput.value).toBe("");
    expect(descInput.value).toBe("");
  });

  test("#2:should add new note item", () => {
    render(
      <NotesProvider>
        <NoteApp sortBy={"latest"} />
      </NotesProvider>
    );
    addNoteHandler([
      { title: "note title1", desc: "note desc 1" },
      { title: "note title1", desc: "note desc 1" },
    ]);
    const noteItemElem = screen.getAllByText(/note title1/i);
    expect(noteItemElem.length).toBe(2);
  });
  test("#3:should add class compeleted in done notes", () => {
    render(
      <NotesProvider>
        <NoteApp sortBy={"latest"} />
      </NotesProvider>
    );
    addNoteHandler([{ title: "note title1", desc: "note desc 1" }]);
    const noteItemElem = screen.getByTestId("note-Item");
    const checkBox = screen.getByRole("checkbox");
    fireEvent.click(checkBox);
    expect(noteItemElem).toHaveClass("completed");
  });
  test("#4:should remove item after click delete", () => {
    render(
      <NotesProvider>
        <NoteApp sortBy={"latest"} />
      </NotesProvider>
    );
    addNoteHandler([{ title: "note title1", desc: "note desc 1" }]);
    const noteItemElem = screen.getByTestId("note-Item");
    const btn = screen.getByRole("button", { name: "❌" });
    fireEvent.click(btn);
    expect(noteItemElem).not.toBeInTheDocument();
  });
  test("#5:show empty msg if there's no item", () => {
    render(
      <NotesProvider>
        <NoteApp sortBy={"latest"} />
      </NotesProvider>
    );
    const emptyMsgItemElem = screen.getByText(
      /No Notes has already been added./i
    );
    const noteItemElem = screen.queryByTestId("note-Item");
    expect(emptyMsgItemElem).toBeInTheDocument();
    expect(noteItemElem).not.toBeInTheDocument();
  });
  test("#6: show currect sort by latest notes", () => {
    const setSort = vi.fn();
    render(
      <NotesProvider>
        <div className="container">
          <NoteHeader sortBy={"latest"} onSort={setSort} />
          <NoteApp sortBy={"latest"} />
        </div>
      </NotesProvider>
    );
    addNoteHandler([
      { title: "note title1", desc: "note desc 1",  },
      { title: "note title2", desc: "note desc 2",  },
    ]);
    const selectElem = screen.getByRole("combobox");
    fireEvent.change(selectElem, { target: { value: "latest" } });
    const dateNotes = screen.getAllByTestId("note-Item");
    expect(dateNotes[0]).toHaveTextContent("note title2");
  });
  test("#7: show currect sort by earliest notes", () => {
    const setSort = vi.fn();
    render(
      <NotesProvider>
        <div className="container">
          <NoteHeader sortBy={"earliest"} onSort={setSort} />
          <NoteApp sortBy={"earliest"} />
        </div>
      </NotesProvider>
    );
    addNoteHandler([
      { title: "note title1", desc: "note desc 1",  },
      { title: "note title2", desc: "note desc 2",  },
    ]);
    const selectElem = screen.getByRole("combobox");
    fireEvent.change(selectElem, { target: { value: "earliest" } });
    const dateNotes = screen.getAllByTestId("note-Item");
    expect(dateNotes[0]).toHaveTextContent("note title1");
  });
});
