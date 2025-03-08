// Function to save the notes
document.getElementById("saveBtn").addEventListener("click", function() {
    // Get the input note value
    const noteInput = document.getElementById("noteInput").value;

    // Check if the note is not empty
    if (noteInput.trim() !== "") {
        // Get the saved notes container
        const notesList = document.getElementById("notesList");

        // Create a new note item
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");

        // Create the paragraph for the note
        const noteText = document.createElement("p");
        noteText.textContent = noteInput;

        // Create the delete button for the note
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.textContent = "Delete Note";

        // Add event listener to delete the note
        deleteBtn.addEventListener("click", function() {
            notesList.removeChild(noteItem);
        });

        // Append the note and button to the note item
        noteItem.appendChild(noteText);
        noteItem.appendChild(deleteBtn);

        // Add the new note item to the saved notes section
        notesList.appendChild(noteItem);

        // Clear the textarea
        document.getElementById("noteInput").value = "";
    } else {
        alert("Please write something before saving!");
    }
});

// Function to clear the notes
document.getElementById("clearBtn").addEventListener("click", function() {
    document.getElementById("noteInput").value = ""; // Clear the textarea
});

// Optional: Add functionality to show saved notes from localStorage on page load
window.onload = function() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const notesList = document.getElementById("notesList");

    savedNotes.forEach(function(noteText) {
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");

        const noteParagraph = document.createElement("p");
        noteParagraph.textContent = noteText;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.textContent = "Delete Note";
        deleteBtn.addEventListener("click", function() {
            notesList.removeChild(noteItem);
            saveNotesToLocalStorage();
        });

        noteItem.appendChild(noteParagraph);
        noteItem.appendChild(deleteBtn);

        notesList.appendChild(noteItem);
    });
};

// Function to save notes to localStorage
function saveNotesToLocalStorage() {
    const notesList = document.getElementById("notesList");
    const notes = [];
    
    // Get all the notes text
    const noteItems = notesList.getElementsByClassName("note-item");
    for (let i = 0; i < noteItems.length; i++) {
        const noteText = noteItems[i].querySelector("p").textContent;
        notes.push(noteText);
    }

    // Save the notes to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
}
