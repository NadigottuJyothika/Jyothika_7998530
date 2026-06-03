console.log("Welcome to the Community Portal");

const mockEndpoint = "https://jsonplaceholder.typicode.com/posts?_limit=4";

let communityEvents = [];
const mainContainer = document.querySelector("main");
const eventSection = document.createElement("section");
eventSection.id = "dynamic-events";

const sectionTitle = document.createElement("h2");
sectionTitle.textContent = "Dynamic Event Cards";
eventSection.appendChild(sectionTitle);

const controls = document.createElement("div");
controls.className = "event-controls";

const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search events by name";
searchInput.addEventListener("input", () => {
    filterState.searchTerm = searchInput.value.toLowerCase();
    renderEventCards();
});

const categorySelect = document.createElement("select");
const defaultOption = document.createElement("option");
defaultOption.value = "all";
defaultOption.textContent = "All categories";
categorySelect.appendChild(defaultOption);

["music", "workshop"].forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category[0].toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
});

categorySelect.addEventListener("change", () => {
    filterState.category = categorySelect.value;
    renderEventCards();
});

controls.appendChild(searchInput);
controls.appendChild(categorySelect);

const spinner = document.createElement("div");
spinner.className = "loading-spinner";
spinner.textContent = "Loading events...";

const eventGrid = document.createElement("div");
eventGrid.className = "dynamic-event-grid";

eventSection.appendChild(controls);
eventSection.appendChild(spinner);
eventSection.appendChild(eventGrid);
mainContainer.appendChild(eventSection);

const filterState = {
    category: "all",
    searchTerm: ""
};

const filteredEvents = (events = communityEvents, { category = "all", searchTerm = "" } = filterState) => {
    return [...events].filter((event) => {
        const matchesCategory = category === "all" || event.category === category;
        const matchesSearch = event.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
};

const registrationTracker = (category) => {
    let totalRegistrations = 0;

    return function () {
        totalRegistrations++;
        console.log(`${category} registrations: ${totalRegistrations}`);
    };
};

const registrationCounters = {
    music: registrationTracker("Music"),
    workshop: registrationTracker("Workshop")
};

class Event {
    constructor(name, category, date, seats) {
        this.name = name;
        this.category = category;
        this.date = date;
        this.seats = seats;
    }
}

Event.prototype.checkAvailability = function () {
    return this.seats > 0 ? "Seats Available" : "Sold Out";
};

const sampleEvent = new Event("Music Night", "music", "2026-08-10", 20);

Object.entries(sampleEvent).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

communityEvents.push(new Event("Community Yoga", "workshop", "2026-09-01", 15));

communityEvents.forEach((event) => {
    console.log(`Event: ${event.name}`);
});

const formattedEvents = communityEvents.map((event) => {
    return `Workshop on ${event.name}`;
});

console.log(formattedEvents);

window.isFormDirty = false;

const setupPortalInteractions = () => {
    const promoVideo = document.getElementById("promoVideo");
    const videoStatus = document.getElementById("videoStatus");
    const phoneInput = document.getElementById("phone");
    const feeSelect = document.getElementById("eventFee");
    const feedbackMsg = document.getElementById("feedbackMsg");
    const charCount = document.getElementById("charCount");
    const feedbackImg = document.getElementById("feedbackImg");
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackSubmitBtn = feedbackForm ? feedbackForm.querySelector(".submit-btn") : null;
    const clearPrefsBtn = document.getElementById("clearPrefsBtn");
    const geoBtn = document.getElementById("geoBtn");
    const geoOutput = document.getElementById("geoOutput");
    const eventTypeSelect = document.getElementById("eventType");

    document.querySelectorAll("input, select, textarea").forEach((input) => {
        input.addEventListener("input", () => {
            window.isFormDirty = true;
        });
    });

    window.addEventListener("beforeunload", (event) => {
        if (window.isFormDirty) {
            event.preventDefault();
            event.returnValue = "You have unfinished form entries. Are you sure you want to leave?";
            return event.returnValue;
        }
    });

    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", () => {
            window.isFormDirty = false;
        });
    });

    document.querySelectorAll(".submit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            window.isFormDirty = false;
        });
    });

    if (promoVideo && videoStatus) {
        promoVideo.addEventListener("canplay", () => {
            videoStatus.textContent = "✅ Video ready to play!";
            videoStatus.style.color = "var(--success)";
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener("blur", () => {
            const isValidPhone = /^\d{10}$/.test(phoneInput.value.trim());
            phoneInput.style.borderColor = isValidPhone || phoneInput.value.trim() === "" ? "#e5e7eb" : "var(--danger)";

            if (!isValidPhone && phoneInput.value.trim() !== "") {
                alert("Please enter a valid 10-digit phone number.");
            }
        });
    }

    if (feeSelect && document.getElementById("feeOutput")) {
        feeSelect.addEventListener("change", () => {
            const feeOutput = document.getElementById("feeOutput");
            feeOutput.textContent = feeSelect.value ? `$${feeSelect.value}` : "$0";
        });
    }

    if (feedbackMsg && charCount) {
        feedbackMsg.addEventListener("input", () => {
            charCount.textContent = feedbackMsg.value.length;
        });

        charCount.textContent = feedbackMsg.value.length;
    }

    if (feedbackImg) {
        feedbackImg.addEventListener("dblclick", () => {
            feedbackImg.style.transform = feedbackImg.style.transform === "scale(1.5)" ? "scale(1)" : "scale(1.5)";
        });
    }

    if (feedbackSubmitBtn && feedbackForm) {
        feedbackSubmitBtn.addEventListener("click", () => {
            alert("Thank you! Your feedback has been submitted successfully.");
            feedbackForm.reset();
            if (charCount) {
                charCount.textContent = "0";
            }
            const feeOutput = document.getElementById("feeOutput");
            if (feeOutput) {
                feeOutput.textContent = "$0";
            }
        });
    }

    if (clearPrefsBtn) {
        clearPrefsBtn.addEventListener("click", () => {
            localStorage.clear();
            sessionStorage.clear();
            alert("Preferences (localStorage & sessionStorage) cleared successfully!");

            if (eventTypeSelect) {
                eventTypeSelect.value = "";
            }
        });
    }

    if (eventTypeSelect) {
        const savedEventType = localStorage.getItem("preferredEventType");
        if (savedEventType) {
            eventTypeSelect.value = savedEventType;
        }

        eventTypeSelect.addEventListener("change", () => {
            localStorage.setItem("preferredEventType", eventTypeSelect.value);
            sessionStorage.setItem("lastSelectedEvent", eventTypeSelect.value);
        });
    }

    if (geoBtn && geoOutput) {
        geoBtn.addEventListener("click", () => {
            console.log("Geolocation button clicked! Starting location request...");

            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by this browser.");
                geoOutput.innerText = "Geolocation is not supported by your browser.";
                geoOutput.style.color = "var(--danger)";
                return;
            }

            geoOutput.innerText = "Locating...";
            geoOutput.style.color = "var(--accent)";

            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            const success = (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("Location successfully retrieved!");
                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
                console.log("Full position object:", position);

                geoOutput.innerText = `📍 Nearest event found! Your coordinates: Latitude ${latitude.toFixed(4)}, Longitude ${longitude.toFixed(4)}`;
                geoOutput.style.color = "var(--success)";
            };

            const error = (err) => {
                geoOutput.style.color = "var(--danger)";
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        geoOutput.innerText = "Location access was denied. Please allow permissions to find nearby events.";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        geoOutput.innerText = "Location information is unavailable.";
                        break;
                    case err.TIMEOUT:
                        geoOutput.innerText = "The request to get user location timed out.";
                        break;
                    default:
                        geoOutput.innerText = "An unknown error occurred.";
                        break;
                }
            };

            navigator.geolocation.getCurrentPosition(success, error, options);
        });
    }
};

setupPortalInteractions();

const renderEventCards = () => {
    eventGrid.innerHTML = "";

    filteredEvents().forEach((event) => {
        const card = document.createElement("article");
        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = event.name;

        const details = document.createElement("p");
        details.textContent = `${event.category.toUpperCase()} • ${event.date}`;

        const seatsInfo = document.createElement("p");
        seatsInfo.className = "seat-status";
        seatsInfo.textContent = `${event.seats} seats remaining`;

        const status = document.createElement("p");
        status.className = "registration-status";
        status.textContent = event.registered ? "You are registered" : "Open for registration";

        const actionButton = document.createElement("button");
        actionButton.textContent = event.registered ? "Cancel Registration" : "Register";
        actionButton.addEventListener("click", () => {
            const $card = $(card);
            $card.fadeOut(300, () => {
                if (!event.registered) {
                    if (event.seats > 0) {
                        event.seats--;
                        event.registered = true;
                        registrationCounters[event.category]();
                    } else {
                        status.textContent = "Sold out";
                        actionButton.disabled = true;
                        actionButton.textContent = "Sold Out";
                    }
                } else {
                    event.seats++;
                    event.registered = false;
                }

                renderEventCards();
            });
        });

        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(seatsInfo);
        card.appendChild(status);
        card.appendChild(actionButton);

        eventGrid.appendChild(card);
    });

    $(eventGrid).find(".event-card").hide().fadeIn(500);
};

const normalizeRemoteData = (rawData, offset = 0) => {
    return rawData.slice(0, 4).map((item, index) => {
        const eventIndex = index + offset;

        return {
            name: item.title.slice(0, 40),
            category: eventIndex % 2 === 0 ? "music" : "workshop",
            date: new Date(Date.now() + eventIndex * 86400000).toISOString().slice(0, 10),
            seats: 25 - eventIndex * 5,
            registered: false
        };
    });
};

const updateEvents = (newEvents = []) => {
    communityEvents = [...newEvents];
    renderEventCards();
};

const loadEventsAsync = async () => {
    try {
        spinner.textContent = "Loading events...";
        const response = await fetch(mockEndpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateEvents(normalizeRemoteData(data));
        spinner.remove();
    } catch (error) {
        console.error("Failed to fetch events with async/await:", error);
        spinner.textContent = "Failed to load events.";
    }
};

loadEventsAsync();

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        $(".event-card").first().fadeOut(300, function () {
            $(this).fadeIn(800);
        });
        console.log("Sample register button clicked.");
    });
}

console.log("Framework benefit: React or Vue provide component-based reuse and reactive state management.");

const mockRegistrationEndpoint = "https://jsonplaceholder.typicode.com/posts";
const registrationForm = document.getElementById("registrationForm");
const formOutput = document.getElementById("formOutput");

const submitRegistration = async (payload) => {
    console.log("submitRegistration started", payload);
    formOutput.textContent = "Submitting registration...";
    formOutput.style.display = "block";
    formOutput.style.color = "var(--text-dark)";

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Sending fetch request to mock API", mockRegistrationEndpoint);
    debugger;

    const response = await fetch(mockRegistrationEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    console.log("Fetch response received", response.status, response.ok);
    debugger;

    if (!response.ok) {
        throw new Error("Server rejected the registration.");
    }

    const data = await response.json();
    console.log("Fetch response payload", data);
    return data;
};

if (registrationForm) {
    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const { name, email, eventType } = registrationForm.elements;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        clearFieldError(name, document.getElementById("nameError"));
        clearFieldError(email, document.getElementById("emailError"));
        clearFieldError(eventType, document.getElementById("eventTypeError"));

        let hasErrors = false;

        if (!name.value.trim()) {
            showFieldError(name, document.getElementById("nameError"), "Please enter your full name.");
            hasErrors = true;
        }

        if (!email.value.trim()) {
            showFieldError(email, document.getElementById("emailError"), "Please enter your email address.");
            hasErrors = true;
        } else if (!emailPattern.test(email.value.trim())) {
            showFieldError(email, document.getElementById("emailError"), "Please enter a valid email address.");
            hasErrors = true;
        }

        if (!eventType.value) {
            showFieldError(eventType, document.getElementById("eventTypeError"), "Please select an event.");
            hasErrors = true;
        }

        if (hasErrors) {
            formOutput.textContent = "Please fix the highlighted errors before submitting.";
            formOutput.style.color = "var(--danger)";
            formOutput.style.display = "block";
            return;
        }

        try {
            const payload = {
                name: name.value.trim(),
                email: email.value.trim(),
                eventType: eventType.value
            };

            console.log("Form submit captured values", payload);
            debugger;

            await submitRegistration(payload);
            formOutput.textContent = `Thank you, ${payload.name}! Your registration for ${payload.eventType} has been received.`;
            formOutput.style.color = "var(--success)";
            formOutput.style.display = "block";
            registrationForm.reset();
        } catch (error) {
            formOutput.textContent = `Registration failed. ${error.message}`;
            formOutput.style.color = "var(--danger)";
            formOutput.style.display = "block";
        }
    });
}

window.addEventListener("load", () => {
    console.log("Page fully loaded");
});
