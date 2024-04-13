"use strict";

import {event} from "jquery";

(function(){

    function CheckLogin(){

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`)
        }

        $("#logout").on("click", function (){
            sessionStorage.clear();

            $("#login").html(`<a class="nav-link" href="/login"><i class="fas fa-sign-in-alt"></i> Login</a>`)

            location.href = "/login"
        });
    }

    function ContactFormValidation(){
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid First and Last Name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address");
    }

    /**
     * This function validates input for text field
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     */
    function ValidateField(input_field_id:string, regular_expression:RegExp, error_message:string){

        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function () {
            // Fail Validation
            let inputFieldText = $(this).val() as string;
            if(!regular_expression.test(inputFieldText)){
                // pattern fails
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            } else {
                // Pass Validation
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function AddContact(fullName:string, contactNumber:string, emailAddress:string) {
        const contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            const key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");

        const DocumentBody: HTMLElement | null = document.body;
        if (DocumentBody) {
            const Article = document.createElement("article");
            DocumentBody.appendChild(Article);
        }
    }
    let slideIndex = 0;

    function showSlides(): void {
        const slides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");

        for (let i = 0; i < slides.length; i++) {
            (slides[i] as HTMLElement).style.display = "none";
        }
        slideIndex++;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        for (let i = 0; i < dots.length; i++) {
            (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(" dot-active", "");
        }

        (slides[slideIndex - 1] as HTMLElement).style.display = "block";
        (dots[slideIndex - 1] as HTMLElement).className += " dot-active";

        setTimeout(showSlides, 4000); // Change the time to 4000 milliseconds (4 seconds)
    }

    document.addEventListener("DOMContentLoaded", function () {
        showSlides(); // Start the slideshow when the page loads
    });

    fetch('https://api.adviceslip.com/advice')
        .then(response => response.json())
        .then(data => {
            const advice = data.slip.advice;
            console.log(`Advice: ${advice}`);
        });

    // Create a div element for the lightbox background
    const lightboxBg = document.createElement('div');
    lightboxBg.id = "lightboxBg";
    document.body.appendChild(lightboxBg);

    // Select all elements with the class 'zoom-img' and add click event listeners
    const images = document.querySelectorAll('.zoom-img');
    images.forEach(image => {
        image.addEventListener('click', e => {
            // When an image is clicked, add the 'active' class to the lightbox background
            lightboxBg.classList.add('active');

            // Create a new img element for the lightbox image
            const lightboxImg= document.createElement('img') as HTMLImageElement;
            lightboxImg.src = (image as HTMLImageElement).src;
            lightboxImg.id = "lightboxImg";

            // Remove any existing child elements from the lightbox background
            while (lightboxBg.firstChild) {
                lightboxBg.removeChild(lightboxBg.firstChild);
            }

            // Append the lightbox image to the lightbox background
            lightboxBg.appendChild(lightboxImg);
        });
    });

    // Add a click event listener to the lightbox background to remove the 'active' class
    lightboxBg.addEventListener('click', e => {
        lightboxBg.classList.remove('active');
    });

    // Wait for the document to be ready before executing JavaScript
    $(document).on('ready', () => {
        // Configuration for the Quotes API
        let apiUrl = 'https://api.api-ninjas.com/v1/quotes';
        let category = 'happiness';
        let apiKey = 'XNVban3XBdoDrykLaXpGQQ==zR3gTGPF9411J3cm';

        // Build the request URL
        let requestUrl = `${apiUrl}?category=${category}`;

        // Make the fetch request
        fetch(requestUrl, {
            method: 'GET', // HTTP method for the request
            headers: { 'X-Api-Key': apiKey }, // API key for authentication
        })
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse JSON data from the response
                return response.json();
            })
            .then(result => {
                // Callback function for a successful request
                displayQuote(result); // Display the quote using a custom function
            })
            .catch(error => {
                // Callback function for an error in the request
                console.error('Error:', error); // Log the error in the console
            });

        // Function to display the quote in the container
        function displayQuote(data: {quote: string; author:string} []) {
            //Reference to the quote container element
            let quoteContainer = document.getElementById('quote-container');

            if (quoteContainer) {
                // Clear the container before adding new quotes
                quoteContainer.innerHTML = '';

                // Check if there are results
                if (data.length > 0) {
                    let quote: { quote: string; author: string } = data[0]; // Extract the first quote from the data
                    let quoteElement: HTMLDivElement = document.createElement('div'); // Create a div element for the quote
                    quoteElement.classList.add('quote');

                    // Add the quote text to the quote element
                    quoteElement.innerHTML += `<p class="quote-label">"${quote.quote}"</p>`;

                    // Add the author information to the quote element
                    quoteElement.innerHTML += `<p class="author-label">Author: ${quote.author}"</p>`;

                    // Uncomment the line below if you want to display the category as well
                    quoteElement.innerHTML += `<p>Category: ' + quote.category + '</p>`;

                    // Append the quote element to the quote container
                    quoteContainer.appendChild(quoteElement);
                } else {
                    // Display a message if no quotes are found in the specified category
                    quoteContainer.innerHTML = `<p>There are no quotes in the specified category.</p>`;
                }
            }
        }
    });

    // Weather API configuration
    let weatherApiUrl: string = 'https://api.api-ninjas.com/v1/weather';
    let city: string = 'Oshawa'; // City for which weather data is requested
    let apiKey: string = 'XNVban3XBdoDrykLaXpGQQ==zR3gTGPF9411J3cm'; // Replace with your actual API key

    // Build the URL for the weather request
    let weatherRequestUrl: string = `${weatherApiUrl}?city=${city}`;

    // Make a fetch request for weather data
    fetch(weatherRequestUrl, {
        method: 'GET', // HTTP method for the request
        headers: { 'X-Api-Key': apiKey }, // API key for authentication
    })
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse JSON data from the response
            return response.json();
        })
        .then(result => {
            // Callback function for a successful request
            console.log(result); // Log the result in the console
            displayWeather(result, city); // Display the weather using a custom function
        })
        .catch(error => {
            // Callback function for an error in the request
            console.error('Error: ', error); // Log the error in the console
        });

    // Function to display weather information in the container
    function displayWeather(data: any, cityName: string) {
        const weatherContainer: HTMLElement | null = document.getElementById('weather-container'); // Reference to the weather container element

        if (weatherContainer) {
            // Clear the container before adding new weather information
            weatherContainer.innerHTML = '';

            // Check if there are results and if the expected properties are present
            if (data) {
                const weatherElement: HTMLDivElement = document.createElement('div'); // Create a div element for weather information
                weatherElement.classList.add('weather-info');

                // Add the city name to the weather element
                weatherElement.innerHTML += `<p><span class="info-label">City:</span> ${cityName}</p>`;

                // Add various weather information to the weather element
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

                // Append the weather element to the weather container
                weatherContainer.appendChild(weatherElement);
            } else {
                // Display a message if no weather information is found for the specified city
                weatherContainer.innerHTML = '<p>The weather information for the specified city could not be found.</p>';
            }
        }
    }

    // Wait for the document to be ready before executing the code
    $(document).on('ready', () => {
        // Use fetch to fetch event data from a JSON file or an external API
        fetch('./data/events.json')
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse JSON data from the response
                return response.json();
            })
            .then(data => {
                // Call the displayEvents function with the retrieved event data
                displayEvents(data.events);
            })
            .catch(error => {
                // Log an error message if there's an issue fetching events
                console.error('Error fetching events:', error);
            });

        // Function to display events in the events list
        function displayEvents(events: any[]) {
            // Reference to the events list container
            let eventsList: HTMLElement | null = document.getElementById('events-list');

            if (eventsList) {
                // Iterate through each event and create an HTML element for it
                events.forEach(event => {
                    // Create a list item for the event with a class of 'event-item'
                    let eventItem: HTMLLIElement = document.createElement('li');
                    eventItem.classList.add('event-item');

                    // Append event details to the event item
                    eventItem.innerHTML += `<h2>${event.title}</h2>`;
                    eventItem.innerHTML += `<p><strong>Date:</strong> ${event.date}</p>`;
                    eventItem.innerHTML += `<p><strong>Location:</strong> ${event.location}</p>`;
                    eventItem.innerHTML += `<p>${event.description}</p>`;

                    // Append the event item to the events list
                    if (eventsList) {
                        eventsList.appendChild(eventItem);
                    }
                });
            }
        }
    });

    /**
     * Sets up event listeners for navigation links found within the list items of unsorted lists
     * Removes any existing click and mouseover events before adding new ones to control navigation behaviour and
     * visual cue.
     // * @returns {void}
     */
    function AddNavigationEvents():void{

        let navLinks = $("ul>li>a"); // Find all navigation links

        navLinks.off("click");
        navLinks.off("mouseover");

        navLinks.on("click", function(){
            ($(this).attr("data") as string);
        });

        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });
    }

    //Function to fetch a random dog image from the Dog API
    function get_random_dog() {
        // API endpoint for a random dog image
        const urlDog: string = "https://dog.ceo/api/breeds/image/random";

        // Fetch data from the API
        fetch(urlDog)
            .then(response => {
                // Parse the response as JSON
                return response.json();
            })
            .then(data => {
                // Call the display_image function with the retrieved image URL
                display_image(data.message);
            })
            .catch(error => {
                // Log an error message if there's an issue with the fetch operation
                console.log("Error: " + error);
            });
    }

    function toggleAccordion(servicesId: string): void {
        const servicesContent: HTMLElement | null = document.getElementById(servicesId);
        if (servicesContent) {
            servicesContent.style.display = (servicesContent.style.display === 'none' || servicesContent.style.display === '') ? 'block' : 'none';
        }
    }

    const postsTemplate: HTMLTemplateElement | null = document.querySelector("[data-posts-template]");
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(data => {
            if (postsTemplate) {
                const posts: DocumentFragment = postsTemplate.content.cloneNode(true) as DocumentFragment;
                console.log(posts);
            }
        });

    document.getElementById("icon-menu")?.addEventListener("click", mostrar_menu);

    function mostrar_menu(): void {
        const moveContent: HTMLElement | null = document.getElementById("move-content");
        const showMenu: HTMLElement | null = document.getElementById("show-menu");
        if (moveContent && showMenu) {
            moveContent.classList.toggle('move-container-all');
            showMenu.classList.toggle('show-lateral');
        }
    }

    // Function to display a dog image on the webpage
    function display_image(image_urlDog: string) {
        // Set the source of the dog image element to the retrieved image URL
        const dogImageElement: HTMLImageElement | null = document.getElementById("dog-image") as HTMLImageElement | null;
        if (dogImageElement) {
            dogImageElement.src = image_urlDog;
        }
    }

    function DisplayContactUsPage(){
        console.log("Called DisplayContactUsPage()");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function(){
            location.href = "/contact-list"
        });

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function() {

            let fullName:string = document.forms[0].fullName.value;
            let contactNumber:string = document.forms[0].contactNumber.value;
            let emailAddress:string = document.forms[0].emailAddress.value;

            if(subscribeCheckbox.checked) {
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }

    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage()");

        $("a.delete").on("click", function (event) {
            if (!confirm("Delete Contact? Please confirm")){
                event.preventDefault();
                location.href = "/contact-list"
            }
        });
    }

    function DisplayEditPage(){
        console.log("DisplayEdit Page Called ...");
        ContactFormValidation();
    }

    function DisplayLoginPage(){
        console.log("Called DisplayLoginPage()");

        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function (){

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function (data) {

                for(const user of data.users){
                    console.log(user);

                    let username:string = document.forms[0].username.value;
                    let password:string = document.forms[0].password.value;

                    if(username === user.UserName && password === user.Password){
                        success = true;
                        newUser.fromJSON(user);
                        break;
                    }
                }

                if (success){

                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea.removeAttr("class").hide();
                    location.href = "/contact-list"
                }else{

                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Login Credentials")
                        .show();
                }
            });
        });

        $("#cancelButton").on("click", function(){
            document.forms[0].reset();
            location.href = "/home"
        });
    }

    function DisplayArticlePage(){
        console.log("Called DisplayArticlePage()");
    }
    function DisplayBlogPage(){
        console.log("Called DisplayPrivacyBlogPage()");
    }
    function DisplayCareersPage(){
        console.log("Called DisplayCareersPage()");
    }

    function DisplayEventsPage(){
        console.log("Called DisplayEventsPage");
    }

    function DisplayGalleryPage(){
        console.log("Called DisplayGalleryPage")
    }
    function DisplayPrivacyPolicyPage(){
        console.log("Called DisplayPrivacyPolicyPage()");
    }

    function DisplayRegisterPage(){
        console.log("Called DisplayRegisterPage()");
        location.href = "/contact-list"
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage()");
    }

    function DisplayEventsPlanningPage(){
        console.log("Called DisplayEventsPlanningPage");
        location.href = "/login"
    }

    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }
    function DisplayTermsOfServicePage() {
        console.log("Called DisplayTermOfServicePage()");
    }
    function Display404Page(){
        console.log("Called Display404Page()");
    }

    function DisplayPortfolioPage(){
        console.log("Called DisplayPortfolioPage()");
        const services: { id: string; name: string; img: string; desc: string; }[] = [
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

        const card: HTMLElement | null = document.getElementById("card-template");

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

    function DisplayNewPage(): void {
        console.log("Called DisplayNewPage()");
        const addPage: { id: string; name: string; link: string; }[] = [
            {
                id: "careers",
                name: "Careers",
                link: "careers.ejs",
            }
        ];
        const page: HTMLElement | null = document.querySelector(".navbar-nav.ms-auto.mb-2.mb-lg-0");

        if (page) {
            page.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href="${addPage[0].link}">${addPage[0].name}</a>
            </li>`;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        DisplayNewPage(); // Start the slideshow when the page loads
    });

    // Get the list of <a> elements within the <ul>
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('#navbarSupportedContent ul.navbar-nav li.nav-item a');

    // Iterate through the links and change the name of the desired page
    navLinks.forEach((link) => {
        if (link.href.endsWith('blog.ejs')) {
            // Change the link text to your new name
            link.textContent = 'News';
        }
    });

    interface Article {
        title: string;
        summary: string;
    }

    const articles: Article[] = [
        { title: "Title 1", summary: "Summary 1" },
        { title: "Title 2", summary: "Summary 2" },
        { title: "Title 3", summary: "Summary 3" }
    ];

    function createBlogPost(article: Article): void {
        const blogContainer: HTMLElement | null = document.getElementById('blog-container');

        if (blogContainer) {
            const articleDiv: HTMLDivElement = document.createElement('div');
            articleDiv.classList.add('article');

            const titleElement: HTMLHeadingElement = document.createElement('h2');
            titleElement.textContent = article.title;

            const summaryElement: HTMLParagraphElement = document.createElement('p');
            summaryElement.textContent = article.summary;

            const readMoreLink: HTMLAnchorElement = document.createElement('a');
            readMoreLink.href = '#'; // Add the actual link here
            readMoreLink.textContent = 'Read More';
            readMoreLink.classList.add('read-more');

            articleDiv.appendChild(titleElement);
            articleDiv.appendChild(summaryElement);
            articleDiv.appendChild(readMoreLink);

            blogContainer.appendChild(articleDiv);
        }
    }

    // Populate the blog with articles
    articles.forEach(createBlogPost);

    const carousel: HTMLElement | null = document.querySelector(".carousel");
    let firstImg: HTMLElement | undefined;
    firstImg = carousel?.querySelectorAll("img")[0] as HTMLElement;
    let arrowIcons: NodeListOf<HTMLElement> | undefined;
    arrowIcons = document.querySelectorAll(".wrapper i");

    // let isDragStart = false, isDragging = false;
    let prevPageX: number, prevScrollLeft: number, positionDiff: number;

    const showHideIcons = (): void => {
        // Showing and hiding prev/next icon according to carousel scroll left value
        const scrollWidth: number = carousel?.scrollWidth! - carousel?.clientWidth!; // Getting max scrollable width
        if (arrowIcons) {
            arrowIcons[0].style.display = carousel?.scrollLeft === 0 ? "none" : "block";
            arrowIcons[1].style.display = carousel?.scrollLeft === scrollWidth ? "none" : "block";
        }
    };

    if (arrowIcons) {
        arrowIcons.forEach(icon => {
            icon.addEventListener("click", () => {
                const firstImgWidth: number = firstImg?.clientWidth! + 14; // Getting first img width & adding 14 margin value
                // If clicked icon is left, reduce width value from the carousel scroll left else add to it
                carousel!.scrollLeft += icon.id === "left" ? -firstImgWidth : firstImgWidth;
                setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
            });
        });
    }

    const autoSlide = (): void => {
        // if there is no image left to scroll then return from here
        if (carousel!.scrollLeft === (carousel!.scrollWidth - carousel!.clientWidth)) return;

        positionDiff = Math.abs(positionDiff); // Making positionDiff value to positive
        const firstImgWidth: number = firstImg!.clientWidth! + 14;
        // Getting difference value that needs to add or reduce from carousel left to take middle img center
        const valDifference: number = firstImgWidth - positionDiff;

        if (carousel!.scrollLeft > prevScrollLeft) { // If user is scrolling to the right
            carousel!.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
        } else { // If user is scrolling to the left
            carousel!.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
        }
    };

    // const dragStart = (e: MouseEvent | TouchEvent): void => {
    //     // Updating global variables value on mouse down event
    //     isDragStart = true;
    //     prevPageX = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) || 0;
    //     prevScrollLeft = carousel!.scrollLeft;
    // };
    //
    // const dragging = (e: MouseEvent | TouchEvent): void => {
    //     // Scrolling images/carousel to left according to mouse pointer
    //     if (!isDragStart) return;
    //     e.preventDefault();
    //     isDragging = true;
    //     carousel!.classList.add("dragging");
    //     positionDiff = ((e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) || 0) - prevPageX;
    //     carousel!.scrollLeft = prevScrollLeft - positionDiff;
    //     showHideIcons();
    // };
    //
    // const dragStop = (): void => {
    //     isDragStart = false;
    //     carousel!.classList.remove("dragging");
    //
    //     if (!isDragging) return;
    //     isDragging = false;
    //     autoSlide();
    // };
    //
    // carousel!.addEventListener("mousedown", dragStart);
    // carousel!.addEventListener("touchstart", dragStart);
    //
    // carousel!.addEventListener("mousemove", dragging);
    // carousel!.addEventListener("touchmove", dragging);
    //
    // carousel!.addEventListener("mouseup", dragStop);
    // carousel!.addEventListener("mouseleave", dragStop);
    // carousel!.addEventListener("touchend", dragStop);

    // function AuthGuard(){
    //     let protected_route = ["contact-list"];
    //
    //     if (protected_route.indexOf(router.ActiveLink)>-1) {
    //         if (!sessionStorage.getItem("user")) {
    //             router.ActiveLink = "login";
    //         }
    //     }
    // }

    /**
     * Binds click, mouseover and mouseout events to anchor tags with class 'link' and a matching data attribute
     * Applies CSS changes for visual feedback and handles link activation on click
     // * @param link
     */
    // function AddLinkEvents(link:string):void{
    //
    //     let linkQuery = $(`a.link[data=${link}]`);
    //
    //     linkQuery.off("click");
    //     linkQuery.off("mouseover");
    //     linkQuery.off("mouseout");
    //
    //     linkQuery.css("text-decoration", "underline");
    //     linkQuery.css("color", "blue");
    //
    //     linkQuery.on("click", function (){
    //         LoadLink(`${link}`);
    //     });
    //
    //     linkQuery.on("mouseover", function (){
    //         $(this).css("cursor", "pointer");
    //         $(this).css("font-weight", "bold");
    //     });
    //
    //     linkQuery.on("mouseout", function (){
    //         $(this).css("font-weight", "normal");
    //     });
    // }

    function createNewEvent(): void {
        const eventNameInput: HTMLInputElement | null = document.getElementById("newEventName") as HTMLInputElement;
        const coordinatorNameInput: HTMLInputElement | null = document.getElementById("newCoordinatorName") as HTMLInputElement;
        const contactNumberInput: HTMLInputElement | null = document.getElementById("newContactNumber") as HTMLInputElement;
        const emailInput: HTMLInputElement | null = document.getElementById("newEmail") as HTMLInputElement;

        if (eventNameInput && coordinatorNameInput && contactNumberInput) {
            const eventName: string = eventNameInput.value;
            const coordinatorName: string = coordinatorNameInput.value;
            const contactNumber: string = contactNumberInput.value;
            const email: string = emailInput.value;

            AddEvent(eventName, coordinatorName, contactNumber, email);

            // TODO: Clear the input fields or perform any other necessary actions
            eventNameInput.value = "";
            coordinatorNameInput.value = "";
            contactNumberInput.value = "";
        }
        // Event Planning
        document.getElementById("saveNewEvent")?.addEventListener("click", saveNewEvent);
        document.getElementById("cancelNewEvent")?.addEventListener("click", cancelNewEvent);
    }

    function saveNewEvent(): void {

        console.log("Save New Event");
        // Get the input values
        const eventNameInput: HTMLInputElement | null = document.getElementById('newEventName') as HTMLInputElement;
        const coordinatorNameInput: HTMLInputElement | null = document.getElementById('newCoordinatorName') as HTMLInputElement;
        const contactNumberInput: HTMLInputElement | null = document.getElementById('newContactNumber') as HTMLInputElement;
        const emailInput: HTMLInputElement | null = document.getElementById('newEmail') as HTMLInputElement;

        // Call the AddEvent function or perform any other necessary actions
        if (eventNameInput && coordinatorNameInput && contactNumberInput && emailInput) {
            const eventName: string = eventNameInput.value;
            const coordinatorName: string = coordinatorNameInput.value;
            const contactNumber: string = contactNumberInput.value;
            const email: string = emailInput.value;

            AddEvent(eventName, coordinatorName, contactNumber, email);
        }

        // Clear the input fields or perform any other necessary actions
        if (eventNameInput) eventNameInput.value = "";
        if (coordinatorNameInput) coordinatorNameInput.value = "";
        if (contactNumberInput) contactNumberInput.value = "";
        if (emailInput) emailInput.value = "";
    }

    const saveButton: HTMLButtonElement | null = document.getElementById('saveNewEvent') as HTMLButtonElement;
    if (saveButton) {
        saveButton.addEventListener('click', saveNewEvent);
    }

    function cancelNewEvent(): void {
        const newEventRow: HTMLElement | null = document.getElementById("newEventRow");
        if (newEventRow) {
            newEventRow.remove();
        }
    }

    function AddEvent(eventName: string, coordinatorName: string, contactNumber: string, email: string): void {
        events.push({ eventName, coordinatorName, contactNumber, email });
        displayEvents();
    }

    // Define an interface for the event
    interface Event {
        eventName: string;
        coordinatorName: string;
        contactNumber: string;
        email: string;
    }

    // Load existing events from eventsplanning.json
    let events: Event[] = [];

    // Function to fetch and parse JSON from file
    async function loadEvents() {
        const response = await fetch('eventsplanning.json');
        events = await response.json();
        displayEvents();
    }

    // Function to display events in the table
    function displayEvents() {
        const eventsPlanningTable = document.getElementById('eventsPlanning');
        if (eventsPlanningTable) {
            // Clear existing rows
            eventsPlanningTable.innerHTML = '';

            // Add each event as a new row
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
    // Call loadEvents to display existing events
    loadEvents();

    function Start() {
        console.log("App Started");

        let page_id = $("body")[0].getAttribute("id")

        CheckLogin();

        switch (page_id){
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

})()