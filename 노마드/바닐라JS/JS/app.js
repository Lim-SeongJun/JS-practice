const backgroundImages = [
    '0.jpg', '1.jpg', '2.jpg','3.jpg'
];

const usernameInput = document.getElementById("username-input");
const loginButton = document.getElementById("login-btn");
const greetingElement = document.getElementById("greeting");
const clockElement = document.getElementById("clock");
const weatherElement = document.getElementById("weather");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");

function setBackgroundImage() {
    const imageUrl = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage = `url(img/${imageUrl})`;
}

function showTime() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    clockElement.innerText = `${hours}:${minutes}:${seconds}`;
    setTimeout(showTime, 1000);
}

function loginUser(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    if (!username) return;
    localStorage.setItem("username", username);
    showGreetings();
}

function showGreetings() {
    const username = localStorage.getItem("username");
    if (username) {
        usernameInput.classList.add("hidden");
        loginButton.classList.add("hidden");
        document.getElementById("login").classList.add("hidden");
        document.getElementById("main").classList.remove("hidden");
        greetingElement.innerText = `안녕하세요, ${username}님!`;
    }
}

function saveTodos(todos) {
   localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodoElement(todo) {
    const liElement = document.createElement("li");
    liElement.innerText = todo;
    todoList.appendChild(liElement);
}

function showStoredTodos() {
   const todos = JSON.parse(localStorage.getItem("todos"));
   if (todos) {
      for (const todo of todos) addTodoElement(todo);
   }
}

function addTodoElement(todo) {
    const liElement = document.createElement("li");
    const span = document.createElement("span");
    const deleteBtn = document.createElement("button");

    span.innerText = todo;
    deleteBtn.innerText = "삭제";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteTodo);

    liElement.appendChild(span);
    liElement.appendChild(deleteBtn);
    todoList.appendChild(liElement);
}

function deleteTodo(event) {
    const li = event.target.parentElement;
    todoList.removeChild(li);
    
    const todoText = li.querySelector('span').innerText;
    const todos = JSON.parse(localStorage.getItem("todos"));
    const index = todos.indexOf(todoText);
    if (index > -1) {
        todos.splice(index, 1);
    }
    saveTodos(todos);
}

function addNewTodo() {
    const newTodo = todoInput.value.trim();
    if (newTodo) {
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos.push(newTodo);
        saveTodos(todos);
        addTodoElement(newTodo);
    }
    todoInput.value = '';
}

function showWeather(lat, lon) {
    const API_KEY = "65e9500f9c5ace165e1b5331a5d33310";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { name } = data;
            const { temp } = data.main;
            const { main } = data.weather[0];
            weatherElement.innerText = `${name}의 현재 기온은 ${temp}℃이고 날씨는 '${main}'입니다.`;
        });
}

function showGeolocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            showWeather(lat, lon);
        },
        error => {
            console.error(error);
            weatherElement.innerText = "날씨 정보를 불러오는데 실패했습니다.";
        }
    );
}

function handleTodoFormSubmit(event) {
    event.preventDefault();
    addNewTodo();
}

setBackgroundImage();
showTime();
showGreetings();
showStoredTodos();
showGeolocation();

loginButton.addEventListener("click", loginUser);
todoForm.addEventListener("submit", handleTodoFormSubmit);