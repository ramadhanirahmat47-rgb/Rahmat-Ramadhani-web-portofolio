import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let db;
let portfolioData = {};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase
    const res = await fetch('/firebase-applet-config.json');
    const config = await res.json();
    const app = initializeApp(config);
    db = getFirestore(app, config.firestoreDatabaseId);

    // Check Auth Status (Simple localStorage for this demo)
    if (localStorage.getItem('admin_auth') === 'true') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        loadData();
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'Rahmat Ramadhani' && password === '192010Ha') {
        localStorage.setItem('admin_auth', 'true');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        loadData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

window.logout = function() {
    localStorage.removeItem('admin_auth');
    location.reload();
}

// Tab Navigation
window.showTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById('tab-' + tabId).style.display = 'block';
    
    document.querySelectorAll('.sidebar ul li a').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    const titles = { 'general': 'General Info', 'projects': 'Projects', 'journey': 'Journey (Edu/Exp)', 'skills': 'Skills' };
    document.getElementById('tab-title').innerText = titles[tabId];
}

async function loadData() {
    const docRef = doc(db, 'settings', 'portfolio');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        portfolioData = docSnap.data();
    } else {
        portfolioData = {
            name: 'Jacob Aiden',
            role: 'Frontend Developer',
            description: 'I am a passionate frontend developer with experience in creating responsive and beautiful websites.',
            about: 'I specialize in building user interfaces using modern web technologies like HTML, CSS, JavaScript, and React.',
            socialLinks: { facebook: '#', twitter: '#', linkedin: '#' },
            journey: { education: [], experience: [] },
            skills: { coding: [], professional: [] },
            projects: []
        };
    }
    
    // Populate General
    document.getElementById('g-name').value = portfolioData.name || '';
    document.getElementById('g-role').value = portfolioData.role || '';
    document.getElementById('g-desc').value = portfolioData.description || '';
    document.getElementById('g-about').value = portfolioData.about || '';
    if(portfolioData.socialLinks) {
        document.getElementById('g-fb').value = portfolioData.socialLinks.facebook || '';
        document.getElementById('g-tw').value = portfolioData.socialLinks.twitter || '';
        document.getElementById('g-li').value = portfolioData.socialLinks.linkedin || '';
    }
    
    // Populate Journey & Skills
    if(portfolioData.journey) {
        document.getElementById('j-edu').value = JSON.stringify(portfolioData.journey.education || [], null, 2);
        document.getElementById('j-exp').value = JSON.stringify(portfolioData.journey.experience || [], null, 2);
    }
    if (portfolioData.skills) {
        document.getElementById('s-coding').value = JSON.stringify(portfolioData.skills.coding || [], null, 2);
        document.getElementById('s-prof').value = JSON.stringify(portfolioData.skills.professional || [], null, 2);
    }
    
    renderProjects();
}

async function saveData() {
    const docRef = doc(db, 'settings', 'portfolio');
    await setDoc(docRef, portfolioData, { merge: true });
    showToast('Saved Successfully!');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

// Save General
document.getElementById('general-form').addEventListener('submit', (e) => {
    e.preventDefault();
    portfolioData.name = document.getElementById('g-name').value;
    portfolioData.role = document.getElementById('g-role').value;
    portfolioData.description = document.getElementById('g-desc').value;
    portfolioData.about = document.getElementById('g-about').value;
    portfolioData.socialLinks = {
        facebook: document.getElementById('g-fb').value,
        twitter: document.getElementById('g-tw').value,
        linkedin: document.getElementById('g-li').value
    };
    saveData();
});

// Save Journey
document.getElementById('journey-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        portfolioData.journey = {
            education: JSON.parse(document.getElementById('j-edu').value),
            experience: JSON.parse(document.getElementById('j-exp').value)
        };
        saveData();
    } catch(err) {
        alert("Invalid JSON format in Journey fields.");
    }
});

// Save Skills
document.getElementById('skills-form').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        portfolioData.skills = {
            coding: JSON.parse(document.getElementById('s-coding').value),
            professional: JSON.parse(document.getElementById('s-prof').value)
        };
        saveData();
    } catch(err) {
        alert("Invalid JSON format in Skills fields.");
    }
});

// Add Project
document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if(!portfolioData.projects) portfolioData.projects = [];
    
    portfolioData.projects.push({
        id: Date.now().toString(),
        title: document.getElementById('p-title').value,
        description: document.getElementById('p-desc').value,
        image: document.getElementById('p-img').value,
        link: document.getElementById('p-link').value
    });
    
    saveData();
    renderProjects();
    e.target.reset();
});

window.deleteProject = function(id) {
    if(confirm('Delete this project?')) {
        portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
        saveData();
        renderProjects();
    }
}

function renderProjects() {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    if(!portfolioData.projects || portfolioData.projects.length === 0) {
        list.innerHTML = '<p>No projects yet.</p>';
        return;
    }
    
    portfolioData.projects.forEach(p => {
        list.innerHTML += `
            <div class="project-item">
                <div class="project-info">
                    <h3>${p.title}</h3>
                    <p style="font-size: 0.9rem; color: #666;">${p.description}</p>
                </div>
                <div class="project-actions">
                    <button class="btn-delete" onclick="deleteProject('${p.id}')">Delete</button>
                </div>
            </div>
        `;
    });
}
