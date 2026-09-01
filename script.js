// toggle icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        if (navbar) {
            navbar.classList.toggle('active');
        }
    }
}

// scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100; 
        let height = sec.offsetHeight; 
        let id = sec.getAttribute('id'); 

        if(top >= offset && top < offset + height) {
            // active navbar links
            navLinks.forEach(links => {
                links.classList.remove('active'); 
            });
            let activeLink = document.querySelector('header nav a[href*=' + id + ']');
            if (activeLink) {
                activeLink.classList.add('active');
            }
            // active sections for animation on scroll
            sec.classList.add('show-animate'); 
        }
        // if you want to use animation on scroll, use this: 
        else {
            sec.classList.remove('show-animate'); 
        }

    });

    // sticky header
    let header = document.querySelector('header'); 

    header.classList.toggle('sticky', window.scrollY > 100); 

    // remove toggle icon and navbar when click navbar links (scroll)
    if (menuIcon) {
        menuIcon.classList.remove('bx-x');
    }
    if (navbar) {
        navbar.classList.remove('active');
    }

    // animation footer on scroll
    let footer = document.querySelector('footer'); 
    if (footer) {
        footer.classList.toggle('show-animate', window.innerHeight + window.scrollY >= document.scrollingElement.scrollHeight);
    }

}

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Fetch dynamic data
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/firebase-applet-config.json');
        const config = await res.json();
        const app = initializeApp(config);
        const db = getFirestore(app, config.firestoreDatabaseId);

        const docRef = doc(db, 'settings', 'portfolio');
        const docSnap = await getDoc(docRef);
        
        let data = {};
        if (docSnap.exists()) {
            data = docSnap.data();
        }
        
        if(data.name) {
            const nameEl = document.getElementById('dyn-name');
            if(nameEl) nameEl.innerText = data.name;
        }
        if(data.role) {
            const roleEl = document.getElementById('dyn-role');
            if(roleEl) roleEl.innerText = data.role;
        }
        if(data.description) {
            const descEl = document.getElementById('dyn-desc');
            if(descEl) descEl.innerHTML = data.description + '<span class="animate" style="--i:4;"></span>';
        }
        if(data.about) {
            const aboutEl = document.getElementById('dyn-about-desc');
            if(aboutEl) aboutEl.innerHTML = data.about + '<span class="animate scroll" style="--i:4;"></span>';
        }
        if(data.socialLinks) {
            const fb = document.getElementById('dyn-fb');
            const tw = document.getElementById('dyn-tw');
            const li = document.getElementById('dyn-li');
            if(fb) fb.href = data.socialLinks.facebook || '#';
            if(tw) tw.href = data.socialLinks.twitter || '#';
            if(li) li.href = data.socialLinks.linkedin || '#';
        }

        if(data.projects && data.projects.length > 0) {
            const projectsList = document.getElementById('dyn-projects-list');
            if(projectsList) {
                projectsList.innerHTML = data.projects.map((p, i) => `
                    <div style="background: var(--second-bg-color); border-radius: 2rem; padding: 2rem; width: 300px; text-align: center; border: .2rem solid var(--bg-color); transition: .5s;">
                        <img src="${p.image}" alt="${p.title}" style="width: 100%; border-radius: 1rem; margin-bottom: 1rem;">
                        <h3 style="font-size: 2rem; margin-bottom: 1rem;">${p.title}</h3>
                        <p style="font-size: 1.4rem; margin-bottom: 2rem;">${p.description}</p>
                        <a href="${p.link}" class="btn" target="_blank">View Project</a>
                    </div>
                `).join('');
            }
        }

        const fallbackJourney = {
            education: [
                { year: '2018 - 2019', title: 'Master Degree - University', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
                { year: '2017 - 2018', title: 'Bachelor Degree - University', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' }
            ],
            experience: [
                { year: '2019 - Present', title: 'Web Developer - Company', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' },
                { year: '2018 - 2019', title: 'Junior Developer - Company', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' }
            ]
        };

        const journeyData = data.journey || fallbackJourney;

        if (journeyData) {
            const eduList = document.getElementById('dyn-edu-list');
            const expList = document.getElementById('dyn-exp-list');
            
            if(eduList && journeyData.education) {
                eduList.innerHTML = journeyData.education.map(e => `
                    <div class="content">
                        <div class="year"><i class='bx bxs-calendar'></i> ${e.year}</div>
                        <h3>${e.title}</h3>
                        <p>${e.desc}</p>
                    </div>
                `).join('');
            }
            if(expList && journeyData.experience) {
                expList.innerHTML = journeyData.experience.map(e => `
                    <div class="content">
                        <div class="year"><i class='bx bxs-calendar'></i> ${e.year}</div>
                        <h3>${e.title}</h3>
                        <p>${e.desc}</p>
                    </div>
                `).join('');
            }
        }

        const fallbackSkills = {
            coding: [
                { title: 'HTML', percentage: 90 },
                { title: 'CSS', percentage: 80 },
                { title: 'JavaScript', percentage: 65 },
                { title: 'Python', percentage: 75 }
            ],
            professional: [
                { title: 'Web Design', percentage: 95 },
                { title: 'Web Development', percentage: 65 },
                { title: 'Graphic Design', percentage: 85 },
                { title: 'SEO Marketing', percentage: 75 }
            ]
        };

        const skillsData = data.skills || fallbackSkills;

        const codingList = document.getElementById('dyn-coding-skills');
        const profList = document.getElementById('dyn-prof-skills');

        if (codingList && skillsData.coding) {
            codingList.innerHTML = skillsData.coding.map(s => `
                <div class="progress">
                    <h3>${s.title} <span>${s.percentage}%</span></h3>
                    <div class="bar"><span style="width: ${s.percentage}%"></span></div>
                </div>
            `).join('');
        }

        if (profList && skillsData.professional) {
            profList.innerHTML = skillsData.professional.map(s => `
                <div class="progress">
                    <h3>${s.title} <span>${s.percentage}%</span></h3>
                    <div class="bar"><span style="width: ${s.percentage}%"></span></div>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error('Error loading portfolio data:', err);
    }
});