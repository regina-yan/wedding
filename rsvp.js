const scriptURL = "https://script.google.com/macros/s/AKfycbwEhRxiPRwzQRiBdk9i29HPElapmkvnQWp43zseIfvGMei0qjhgW_49GBvBLVtRkV9K-A/exec"; // Replace with your actual Google Apps Script URL

const guestList = {
    "Alice Johnson": ["Alice Johnson", "John Johnson"],
    "Bob Smith": ["Bob Smith"],
    "Charlie Davis": ["Charlie Davis", "Dana Davis", "Elliot Davis"]
};

// All guests are invited to these events
const events = ["Welcome Party", "Reception", "Sunday Brunch", "Staying at Camp"];

function verifyGuest() {
    const guestName = document.getElementById("guestName").value.trim();
    const eventSelection = document.getElementById("eventSelection");
    const guestEventList = document.getElementById("guestEventList");

    guestEventList.innerHTML = ""; // Clear previous entries

    if (guestList[guestName]) {
        eventSelection.style.display = "block";
        const group = guestList[guestName];

        group.forEach(member => {
            const guestDiv = document.createElement("div");
            guestDiv.classList.add("guest-entry");

            const guestLabel = document.createElement("h3");
            guestLabel.textContent = member;
            guestDiv.appendChild(guestLabel);

            events.forEach(event => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = `events-${member}`;
                checkbox.value = event;
                checkbox.id = `${member}-${event}`;

                const label = document.createElement("label");
                label.htmlFor = `${member}-${event}`;
                label.textContent = event;

                guestDiv.appendChild(checkbox);
                guestDiv.appendChild(label);
                guestDiv.appendChild(document.createElement("br"));
            });

            guestEventList.appendChild(guestDiv);
        });

        // Fetch existing RSVP data
        fetch(`${scriptURL}?guestName=${encodeURIComponent(guestName)}`)
            .then(response => response.json())
            .then(data => {
                if (data.selectedEvents) {
                    group.forEach(member => {
                        document.querySelectorAll(`input[name='events-${member}']`).forEach(checkbox => {
                            checkbox.checked = data.selectedEvents[checkbox.value] || false;
                        });
                    });
                }
            })
            .catch(error => console.error("Error fetching RSVP:", error));

    } else {
        alert("Sorry, your name was not found on the guest list.");
        eventSelection.style.display = "none";
    }
}


// Handle form submission
document.getElementById("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    submitRSVP();
});

function submitRSVP() {
    const guestName = document.getElementById("guestName").value.trim();
    const selectedEvents = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
        .map(checkbox => checkbox.value);
    
    const selectedGuests = Array.from(document.querySelectorAll("input[name='guests']:checked"))
        .map(checkbox => checkbox.value);

    if (selectedEvents.length === 0) {
        alert("Please select at least one event.");
        return;
    }

    const formData = { guests: selectedGuests, selectedEvents };

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(data => {
        alert("RSVP submitted successfully!");
        document.getElementById("rsvpForm").reset();
        document.getElementById("eventSelection").style.display = "none";
    })
    .catch(error => {
        console.error("Error submitting RSVP:", error);
        alert("There was an issue submitting your RSVP. Please try again.");
    });
}

