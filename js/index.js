document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = searchInput.value.trim();
        if (username) {
            try {
                const userData = await fetchUserData(username);
                displayUserData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        }
    });

    async function fetchUserData(username) {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    }

    function displayUserData(userData) {
        userList.innerHTML = `
            <li>
                <h3>${userData.name}</h3>
                <img src="${userData.avatar_url}" alt="Profile Picture">
                <p><a href="${userData.html_url}" target="_blank">View Profile</a></p>
            </li>
        `;
    }

    userList.addEventListener("click", async (e) => {
        if (e.target.tagName === "A") {
            e.preventDefault();
            const username = e.target.href.split("/").pop();
            try {
                const userReposData = await fetchUserRepos(username);
                displayUserRepos(userReposData);
            } catch (error) {
                console.error("Error fetching user repositories:", error.message);
            }
        }
    });

    async function fetchUserRepos(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error("Failed to fetch user repositories");
        }
        return response.json();
    }

    function displayUserRepos(userReposData) {
        reposList.innerHTML = `
            <h3>${userReposData.length} Repositories:</h3>
            <ul>
                ${userReposData.map(repo => `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`).join("")}
            </ul>
        `;
    }
});
