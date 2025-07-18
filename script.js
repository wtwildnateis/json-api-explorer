// wow not so much empty
const postList = document.getElementById('postList');
const fetchButton = document.getElementById('fetchButton');
const postForm = document.getElementById('postForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const errorDiv = document.getElementById('error');

// API 
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// fetch posts and display
async function fetchPosts() {
    postList.innerHTML = 'Loading...';
    errorDiv.textContent = '';
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch posts.');
        const posts = await response.json();
        displayPosts(posts.slice(0, 10));
    } catch (err) {
        postList.innerHTML = '';
        errorDiv.textContent = `Error: ${err.message}`;
    }
}

// display posts in the DOM
function displayPosts(posts) {
    postList.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
            <hr/>
        `;
        postList.appendChild(postDiv);
    });
}

// creates and sends post
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('titleInput').value;
    const body = document.getElementById('bodyInput').value;

    const newPost = {
        title,
        body,
        userId: 1
    };

    formSuccess.textContent = '';
    formError.textContent = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) throw new Error('Failed to submit post.');

        const result = await response.json();
        formSuccess.textContent = `Post submitted! ID: ${result.id}`;
        postForm.reset();
    } catch (err) {
        formError.textContent = `Error: ${err.message}`;
    }
});

// delete post function
async function deletePost(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete post.');
        fetchPosts();
    } catch (err) {
        errorDiv.textContent = `Delete Error: ${err.message}`;
    }
}

// event listeners
fetchButton.addEventListener('click', fetchPosts);

// filterInput
const filterInput = document.getElementById('filterInput');

filterInput.addEventListener('input', async () => {
    const keyword = filterInput.value.toLowerCase();
    const response = await fetch(API_URL);
    const posts = await response.json();
    const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(keyword) || post.body.toLowerCase().includes(keyword)
    );
    displayPosts(filtered.slice(0, 10));
});
