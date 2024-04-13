"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            $("#login").html(`<a class="nav-link" href="/login"><i class="fas fa-sign-in-alt"></i> Login</a>`);
            location.href = "/login";
        });
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First and Last Name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address");
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        const contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            const key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
        const DocumentBody = document.body;
        if (DocumentBody) {
            const Article = document.createElement("article");
            DocumentBody.appendChild(Article);
        }
    }
    let slideIndex = 0;
    function showSlides() {
        const slides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" dot-active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " dot-active";
        setTimeout(showSlides, 4000);
    }
    document.addEventListener("DOMContentLoaded", function () {
        showSlides();
    });
    fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => {
        const advice = data.slip.advice;
        console.log(`Advice: ${advice}`);
    });
    const lightboxBg = document.createElement('div');
    lightboxBg.id = "lightboxBg";
    document.body.appendChild(lightboxBg);
    const images = document.querySelectorAll('.zoom-img');
    images.forEach(image => {
        image.addEventListener('click', e => {
            lightboxBg.classList.add('active');
            const lightboxImg = document.createElement('img');
            lightboxImg.src = image.src;
            lightboxImg.id = "lightboxImg";
            while (lightboxBg.firstChild) {
                lightboxBg.removeChild(lightboxBg.firstChild);
            }
            lightboxBg.appendChild(lightboxImg);
        });
    });
    lightboxBg.addEventListener('click', e => {
        lightboxBg.classList.remove('active');
    });
    $(document).on('ready', () => {
        let apiUrl = 'https://api.api-ninjas.com/v1/quotes';
        let category = 'happiness';
        let apiKey = 'XNVban3XBdoDrykLaXpGQQ==zR3gTGPF9411J3cm';
        let requestUrl = `${apiUrl}?category=${category}`;
        fetch(requestUrl, {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey },
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(result => {
            displayQuote(result);
        })
            .catch(error => {
            console.error('Error:', error);
        });
        function displayQuote(data) {
            let quoteContainer = document.getElementById('quote-container');
            if (quoteContainer) {
                quoteContainer.innerHTML = '';
                if (data.length > 0) {
                    let quote = data[0];
                    let quoteElement = document.createElement('div');
                    quoteElement.classList.add('quote');
                    quoteElement.innerHTML += `<p class="quote-label">"${quote.quote}"</p>`;
                    quoteElement.innerHTML += `<p class="author-label">Author: ${quote.author}"</p>`;
                    quoteElement.innerHTML += `<p>Category: ' + quote.category + '</p>`;
                    quoteContainer.appendChild(quoteElement);
                }
                else {
                    quoteContainer.innerHTML = `<p>There are no quotes in the specified category.</p>`;
                }
            }
        }
    });
    let weatherApiUrl = 'https://api.api-ninjas.com/v1/weather';
    let city = 'Oshawa';
    let apiKey = 'XNVban3XBdoDrykLaXpGQQ==zR3gTGPF9411J3cm';
    let weatherRequestUrl = `${weatherApiUrl}?city=${city}`;
    fetch(weatherRequestUrl, {
        method: 'GET',
        headers: { 'X-Api-Key': apiKey },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(result => {
        console.log(result);
        displayWeather(result, city);
    })
        .catch(error => {
        console.error('Error: ', error);
    });
    function displayWeather(data, cityName) {
        const weatherContainer = document.getElementById('weather-container');
        if (weatherContainer) {
            weatherContainer.innerHTML = '';
            if (data) {
                const weatherElement = document.createElement('div');
                weatherElement.classList.add('weather-info');
                weatherElement.innerHTML += `<p><span class="info-label">City:</span> ${cityName}</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Cloud Percentage:</span> ${data.cloud_pct}%</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Temperature: </span> ${data.temp} °C</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Feels Like:</span> ${data.feels_like} °C</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Humidity:</span> ${data.humidity}%</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Min Temperature:</span> ${data.min_temp} °C</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Max Temperature:</span> ${data.max_temp} °C</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Wind Speed:</span> ${data.wind_speed} m/s</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Wind Degrees:</span> ${data.wind_degrees}°</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Sunrise:</span> ${new Date(data.sunrise * 1000)}</p>`;
                weatherElement.innerHTML += `<p><span class="info-label">Sunset:</span> ${new Date(data.sunset * 1000)}</p>`;
                weatherContainer.appendChild(weatherElement);
            }
            else {
                weatherContainer.innerHTML = '<p>The weather information for the specified city could not be found.</p>';
            }
        }
    }
    $(document).on('ready', () => {
        fetch('./data/events.json')
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
            displayEvents(data.events);
        })
            .catch(error => {
            console.error('Error fetching events:', error);
        });
        function displayEvents(events) {
            let eventsList = document.getElementById('events-list');
            if (eventsList) {
                events.forEach(event => {
                    let eventItem = document.createElement('li');
                    eventItem.classList.add('event-item');
                    eventItem.innerHTML += `<h2>${event.title}</h2>`;
                    eventItem.innerHTML += `<p><strong>Date:</strong> ${event.date}</p>`;
                    eventItem.innerHTML += `<p><strong>Location:</strong> ${event.location}</p>`;
                    eventItem.innerHTML += `<p>${event.description}</p>`;
                    if (eventsList) {
                        eventsList.appendChild(eventItem);
                    }
                });
            }
        }
    });
    function AddNavigationEvents() {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            $(this).attr("data");
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function get_random_dog() {
        const urlDog = "https://dog.ceo/api/breeds/image/random";
        fetch(urlDog)
            .then(response => {
            return response.json();
        })
            .then(data => {
            display_image(data.message);
        })
            .catch(error => {
            console.log("Error: " + error);
        });
    }
    function toggleAccordion(servicesId) {
        const servicesContent = document.getElementById(servicesId);
        if (servicesContent) {
            servicesContent.style.display = (servicesContent.style.display === 'none' || servicesContent.style.display === '') ? 'block' : 'none';
        }
    }
    const postsTemplate = document.querySelector("[data-posts-template]");
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(data => {
        if (postsTemplate) {
            const posts = postsTemplate.content.cloneNode(true);
            console.log(posts);
        }
    });
    document.getElementById("icon-menu")?.addEventListener("click", mostrar_menu);
    function mostrar_menu() {
        const moveContent = document.getElementById("move-content");
        const showMenu = document.getElementById("show-menu");
        if (moveContent && showMenu) {
            moveContent.classList.toggle('move-container-all');
            showMenu.classList.toggle('show-lateral');
        }
    }
    function display_image(image_urlDog) {
        const dogImageElement = document.getElementById("dog-image");
        if (dogImageElement) {
            dogImageElement.src = image_urlDog;
        }
    }
    function DisplayContactUsPage() {
        console.log("Called DisplayContactUsPage()");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            location.href = "/contact-list";
        });
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function () {
            let fullName = document.forms[0].fullName.value;
            let contactNumber = document.forms[0].contactNumber.value;
            let emailAddress = document.forms[0].emailAddress.value;
            if (subscribeCheckbox.checked) {
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");
        $("a.delete").on("click", function (event) {
            if (!confirm("Delete Contact? Please confirm")) {
                event.preventDefault();
                location.href = "/contact-list";
            }
        });
    }
    function DisplayEditPage() {
        console.log("DisplayEdit Page Called ...");
        ContactFormValidation();
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage()");
        let messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/users.json", function (data) {
                for (const user of data.users) {
                    console.log(user);
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username === user.UserName && password === user.Password) {
                        success = true;
                        newUser.fromJSON(user);
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "/contact-list";
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "/home";
        });
    }
    function DisplayArticlePage() {
        console.log("Called DisplayArticlePage()");
    }
    function DisplayBlogPage() {
        console.log("Called DisplayPrivacyBlogPage()");
    }
    function DisplayCareersPage() {
        console.log("Called DisplayCareersPage()");
    }
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage");
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage");
    }
    function DisplayPrivacyPolicyPage() {
        console.log("Called DisplayPrivacyPolicyPage()");
    }
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage()");
        location.href = "/contact-list";
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage()");
    }
    function DisplayEventsPlanningPage() {
        console.log("Called DisplayEventsPlanningPage");
        location.href = "/login";
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }
    function DisplayTermsOfServicePage() {
        console.log("Called DisplayTermOfServicePage()");
    }
    function Display404Page() {
        console.log("Called Display404Page()");
    }
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage()");
        const services = [
            {
                id: "daycamps",
                name: "Day Camps",
                img: "././content/images/kids-vacations.jpg",
                desc: "Endless fun meets meaningful experiences! Our day camp is a\n " +
                    "vibrant haven for young adventurers, providing a dynamic mix of engaging activities, interactive\n" +
                    " workshops, and outdoor adventures. With flexible scheduling options, your child is invited to embark on a summer\n " +
                    "journey filled with excitement, laughter, and cherished memories.",
            },
            {
                id: "workshops",
                name: "Workshops",
                img: "././content/images/workshops.jpg",
                desc: "Where Creativity Takes Center Stage!\n" +
                    "Our workshops offer a unique and immersive experience for individuals eager to explore their\n" +
                    "artistic passions. Led by skilled instructors, participants will delve into a variety of hands-on\n" +
                    "activities, from fine arts and crafts to digital design and beyond. Whether you're a beginner or an\n" +
                    "experienced artist and unleash your creativity in an environment that celebrates individuality and artistic growth.",
            },
            {
                id: "iceskate",
                name: "Ice Skate",
                img: "././content/images/ice-skate.jpg",
                desc: "Our ice skating sessions offer a frosty escape where individuals of all\n" +
                    "ages can experience the thrill of gliding on the ice. Join us for open skate sessions, take part in\n" +
                    "lessons to hone your skills, or celebrate special occasions with a unique ice skating party.\n" +
                    "Cool memories await—come, skate, and create winter magic with us!",
            },
            {
                id: "recreationalactivities",
                name: "Recreational Activities",
                img: "././content/images/table-games.jpg",
                desc: "Our recreational activities are designed to bring people together for\n" +
                    "laughter, relaxation, and a healthy dose of fun. From energetic team sports like volleyball and\n" +
                    "basketball to more laid-back pursuits like board games and yoga, our center offers a diverse range\n" +
                    "of activities to cater to every interest and age group. Join us and embrace the spirit of\n" +
                    "recreation, where each moment is an opportunity to create lasting memories with friends and family. ",
            },
            {
                id: "dancingclases",
                name: "Recreational Activities",
                img: "././content/images/dancing.jpg",
                desc: "Unleash the rhythm within and join our vibrant dance classes at the Community Center! Whether you're a beginner or a seasoned dancer, our inclusive and energetic classes cater to all levels. Discover the joy of movement, enhance your skills, and embrace the artistry of dance. Our experienced instructors create a supportive environment where you can learn various dance styles, from salsa to hip-hop. Come dance with us and let the beats guide you on a journey of self-expression and fun. Step into the rhythm, step into the community!",
            },
            {
                id: "dancingclases",
                name: "Recreational Activities",
                img: "././content/images/elder.jpg",
                desc: "Experience the camaraderie of board games designed for seniors at our Community Center! Join our engaging sessions tailored for the elderly, where laughter and strategy come together. Rediscover the joy of play and make lasting memories. Board games, good company, and smiles await you. Embrace the fun – join us!",
            },
        ];
        const card = document.getElementById("card-template");
        if (card) {
            services.forEach(x => {
                card.innerHTML += `<div class="service1">
            <div class="card-img">
                <span class="overlay"></span>
                <img src="${x.img}" alt="${x.name}"/>
            </div>

            <div class="card-content">
                <h3 class="portfolio-name">${x.name}</h3>
                <p class="portfolio-content">${x.desc}</p>
            </div>
        </div>`;
            });
        }
    }
    function DisplayNewPage() {
        console.log("Called DisplayNewPage()");
        const addPage = [
            {
                id: "careers",
                name: "Careers",
                link: "careers.ejs",
            }
        ];
        const page = document.querySelector(".navbar-nav.ms-auto.mb-2.mb-lg-0");
        if (page) {
            page.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href="${addPage[0].link}">${addPage[0].name}</a>
            </li>`;
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        DisplayNewPage();
    });
    const navLinks = document.querySelectorAll('#navbarSupportedContent ul.navbar-nav li.nav-item a');
    navLinks.forEach((link) => {
        if (link.href.endsWith('blog.ejs')) {
            link.textContent = 'News';
        }
    });
    const articles = [
        { title: "Title 1", summary: "Summary 1" },
        { title: "Title 2", summary: "Summary 2" },
        { title: "Title 3", summary: "Summary 3" }
    ];
    function createBlogPost(article) {
        const blogContainer = document.getElementById('blog-container');
        if (blogContainer) {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');
            const titleElement = document.createElement('h2');
            titleElement.textContent = article.title;
            const summaryElement = document.createElement('p');
            summaryElement.textContent = article.summary;
            const readMoreLink = document.createElement('a');
            readMoreLink.href = '#';
            readMoreLink.textContent = 'Read More';
            readMoreLink.classList.add('read-more');
            articleDiv.appendChild(titleElement);
            articleDiv.appendChild(summaryElement);
            articleDiv.appendChild(readMoreLink);
            blogContainer.appendChild(articleDiv);
        }
    }
    articles.forEach(createBlogPost);
    const carousel = document.querySelector(".carousel");
    let firstImg;
    firstImg = carousel?.querySelectorAll("img")[0];
    let arrowIcons;
    arrowIcons = document.querySelectorAll(".wrapper i");
    let prevPageX, prevScrollLeft, positionDiff;
    const showHideIcons = () => {
        const scrollWidth = carousel?.scrollWidth - carousel?.clientWidth;
        if (arrowIcons) {
            arrowIcons[0].style.display = carousel?.scrollLeft === 0 ? "none" : "block";
            arrowIcons[1].style.display = carousel?.scrollLeft === scrollWidth ? "none" : "block";
        }
    };
    if (arrowIcons) {
        arrowIcons.forEach(icon => {
            icon.addEventListener("click", () => {
                const firstImgWidth = firstImg?.clientWidth + 14;
                carousel.scrollLeft += icon.id === "left" ? -firstImgWidth : firstImgWidth;
                setTimeout(() => showHideIcons(), 60);
            });
        });
    }
    const autoSlide = () => {
        if (carousel.scrollLeft === (carousel.scrollWidth - carousel.clientWidth))
            return;
        positionDiff = Math.abs(positionDiff);
        const firstImgWidth = firstImg.clientWidth + 14;
        const valDifference = firstImgWidth - positionDiff;
        if (carousel.scrollLeft > prevScrollLeft) {
            carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
        }
        else {
            carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
        }
    };
    function createNewEvent() {
        const eventNameInput = document.getElementById("newEventName");
        const coordinatorNameInput = document.getElementById("newCoordinatorName");
        const contactNumberInput = document.getElementById("newContactNumber");
        const emailInput = document.getElementById("newEmail");
        if (eventNameInput && coordinatorNameInput && contactNumberInput) {
            const eventName = eventNameInput.value;
            const coordinatorName = coordinatorNameInput.value;
            const contactNumber = contactNumberInput.value;
            const email = emailInput.value;
            AddEvent(eventName, coordinatorName, contactNumber, email);
            eventNameInput.value = "";
            coordinatorNameInput.value = "";
            contactNumberInput.value = "";
        }
        document.getElementById("saveNewEvent")?.addEventListener("click", saveNewEvent);
        document.getElementById("cancelNewEvent")?.addEventListener("click", cancelNewEvent);
    }
    function saveNewEvent() {
        console.log("Save New Event");
        const eventNameInput = document.getElementById('newEventName');
        const coordinatorNameInput = document.getElementById('newCoordinatorName');
        const contactNumberInput = document.getElementById('newContactNumber');
        const emailInput = document.getElementById('newEmail');
        if (eventNameInput && coordinatorNameInput && contactNumberInput && emailInput) {
            const eventName = eventNameInput.value;
            const coordinatorName = coordinatorNameInput.value;
            const contactNumber = contactNumberInput.value;
            const email = emailInput.value;
            AddEvent(eventName, coordinatorName, contactNumber, email);
        }
        if (eventNameInput)
            eventNameInput.value = "";
        if (coordinatorNameInput)
            coordinatorNameInput.value = "";
        if (contactNumberInput)
            contactNumberInput.value = "";
        if (emailInput)
            emailInput.value = "";
    }
    const saveButton = document.getElementById('saveNewEvent');
    if (saveButton) {
        saveButton.addEventListener('click', saveNewEvent);
    }
    function cancelNewEvent() {
        const newEventRow = document.getElementById("newEventRow");
        if (newEventRow) {
            newEventRow.remove();
        }
    }
    function AddEvent(eventName, coordinatorName, contactNumber, email) {
        events.push({ eventName, coordinatorName, contactNumber, email });
        displayEvents();
    }
    let events = [];
    async function loadEvents() {
        const response = await fetch('eventsplanning.json');
        events = await response.json();
        displayEvents();
    }
    function displayEvents() {
        const eventsPlanningTable = document.getElementById('eventsPlanning');
        if (eventsPlanningTable) {
            eventsPlanningTable.innerHTML = '';
            events.forEach((event, index) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="text-center">${index + 1}</td>
                    <td>${event.eventName}</td>
                    <td>${event.coordinatorName}</td>
                    <td>${event.contactNumber}</td>
                    <td>${event.email}</td>
                    <td></td>
                    <td></td>
                `;
                eventsPlanningTable.appendChild(newRow);
            });
        }
    }
    loadEvents();
    function Start() {
        console.log("App Started");
        let page_id = $("body")[0].getAttribute("id");
        CheckLogin();
        switch (page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "article":
                DisplayArticlePage();
                break;
            case "blog":
                DisplayBlogPage();
                break;
            case "careers":
                DisplayCareersPage();
                break;
            case "contact-list":
                DisplayContactListPage();
                break;
            case "contact":
                DisplayContactUsPage();
                break;
            case "events":
                DisplayEventsPage();
                break;
            case "edit":
            case "add":
                DisplayEditPage();
                DisplayEventsPlanningPage();
                break;
            case "gallery":
                DisplayGalleryPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "portfolio":
                DisplayPortfolioPage();
                break;
            case "privacypolicy":
                DisplayPrivacyPolicyPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "team":
                DisplayTeamPage();
                break;
            case "termsofservice":
                DisplayTermsOfServicePage();
                break;
            case "404":
                Display404Page();
                break;
        }
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map