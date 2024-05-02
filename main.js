const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
let authentication_img_pass = [];
let authentication_img_log_pass = [];
const tokenKey = "authentication_token";
let timer;

// Array of image filenames
const imageFilenames = [
    "Orange.jpeg",
    "Banana.jpeg",
    "Apple.jpeg",
    "Diamond.jpeg",
    "Circle.jpeg",
    "Mountain.jpeg",
    "Pear.jpeg",
    "Watermelon.jpeg",
    "Triangle.jpeg",
    "Diary_Milk.jpeg",
    "Pomegranate.jpeg",
    "Rectangle.jpeg",
    "Dessert.jpeg",
    "Kiwi.jpeg",
    "Gems.jpeg"
];

// Function to render random images
function renderRandomImages(containerId, imageCount) {
    const container = document.getElementById(containerId);
    const randomImageFilenames = getRandomImages(imageCount);

    randomImageFilenames.forEach((filename, index) => {
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("passimg");
        imageDiv.id = `img-${index + 1}`;
        imageDiv.onclick = () => handleImageClick(imageDiv, containerId === "authentication-images-container");

        const img = document.createElement("img");
        img.src = `images/${filename}`; // Update the image source path
        img.alt = filename;
        img.classList.add("patimg");

        imageDiv.appendChild(img);
        container.appendChild(imageDiv);
    });
}

// Function to get random images
function getRandomImages(count) {
    const shuffledImages = imageFilenames.slice().sort(() => 0.5 - Math.random());
    return shuffledImages.slice(0, count);
}

// Function to handle image click
function handleImageClick(element, isSignUp) {
    const Image = element.querySelector("img");
    if (Image) {
        if (Image.classList.contains("clicked")) {
            Image.classList.remove("clicked");
            if (isSignUp) {
                authentication_img_pass.splice(authentication_img_pass.indexOf(element.id), 1);
            } else {
                authentication_img_log_pass.splice(authentication_img_log_pass.indexOf(element.id), 1);
            }
        } else {
            Image.classList.add("clicked");
            if (isSignUp) {
                authentication_img_pass.push(Image.src);
            } else {
                authentication_img_log_pass.push(Image.src);
            }
        }
    }
}

// Render random images on page load
renderRandomImages("authentication-images-container", 15);
renderRandomImages("login-authentication-images-container", 15);


signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

function signup() {
    sessionStorage.setItem("authentication_name", document.getElementById("authentication_mail").value);
    const tokenKey = CryptoJS.lib.WordArray.random(16).toString();
    const jsonStr = JSON.stringify(authentication_img_pass);
    const encryptedData = CryptoJS.AES.encrypt(jsonStr, tokenKey).toString();
    sessionStorage.setItem("encrypted_authentication_img_pass", encryptedData);
    sessionStorage.setItem("tokens", tokenKey);
    const token = generateToken();
    saveToken(token);
    var myText = "Account Created Successfully";
    alert(myText);
    checkToken();
}

function signin() {
    let str = document.getElementById("inmail").value;
    const encryptedData = sessionStorage.getItem("encrypted_authentication_img_pass");
    const tokeney = sessionStorage.getItem("tokens");
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, tokeney);
    const decryptedStr = decryptedBytes.toString(CryptoJS.enc.Utf8);
    let check = decryptedStr === JSON.stringify(authentication_img_log_pass);
    console.log(check);

    if (!str.localeCompare(sessionStorage.getItem("authentication_name")) && check) {
        var myText = "Login is successful";
        NewTab();
        alert(myText);
        checkToken();
    } else {
        var myText = "Login Failed";
        alert(myText);
        loginFailed();
    }
}

function loginFailed() {
    emailjs.send("service_8xnqvvc", "template_ww87rq6").then(function(res) {
        alert("Mail sent successfully");
    });
}

function forgetPassword() {
    emailjs.send("service_8xnqvvc", "template_jtj0ht8").then(function(res) {
        alert("Mail Sent successfully");
    });
}

function NewTab() {
    window.open("index2.html", "_self");
}

function saveToken(token) {
    sessionStorage.setItem(tokenKey, token);
}

function getToken() {
    return sessionStorage.getItem(tokenKey);
}

function clearToken() {
    sessionStorage.removeItem(tokenKey);
}

function generateToken() {
    const payload = {
        userId: sessionStorage.getItem("authentication_name"),
        exp: Math.floor(Date.now() / 1000) + 30, // Expiry in 30 seconds
    };
    return btoa(JSON.stringify(payload)); // Encode payload as base64
}

function checkToken() {
    const token = getToken();

    if (token) {
        try {
            const payload = JSON.parse(atob(token)); // Decode base64
            if (payload.exp < Math.floor(Date.now() / 1000)) {
                clearToken();
                alert("Your session has expired.");
            } else {
                startSessionTimer();
            }
        } catch (error) {
            console.error("Token parsing failed:", error);
            clearToken();
        }
    } else {
        console.log("No token found");
    }
}

function startSessionTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        clearToken();
        alert("Your session has expired.");
    }, 30000);
}

checkToken();