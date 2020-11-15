import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import App from "./App";

test("renders the title", () => {
  render(<App />);
  const headerElement = screen.getByText(/Note Manager/i);
  expect(headerElement).toBeInTheDocument();
});

const getChangedNewNoteInput = () => {
  const inputElement = screen.getByPlaceholderText("Jot down your thoughts...");
  fireEvent.change(inputElement, {
    bubbles: true,
    cancelable: true,
    target: { value: "remind me" },
  });
  return inputElement;
};
test("changed new note text", () => {
  render(<App />);
  const inputElement = getChangedNewNoteInput();
  expect(inputElement.value).toBe("remind me");
});

test("successfully created a note", () => {
  render(<App />);

  const inputElement = getChangedNewNoteInput();
  fireEvent(
    screen.getByText("Create"),
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );
  const noteItem = screen.getByText(/remind me/i);
  expect(noteItem).toBeInTheDocument();
});
