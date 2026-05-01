document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuBtn?.addEventListener('click', () => navLinks.classList.toggle('active'));

  // CMS Data Loader (with fallback)
  async function loadData(path, fallback = []) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    } catch {
      return fallback;
    }
  }

  // Render Resume
  async function renderResume() {
    const data = await loadData('content/resume.json', {
      name: "Your Name", title: "Full-Stack Developer", email: "you@email.com",
      phone: "+1234567890", location: "Remote", linkedin: "https://linkedin.com", github: "https://github.com",
      summary: "Passionate developer building scalable web & mobile solutions. Focused on clean architecture and user-centric design.",
      experience: [{ company: "TechCorp", role: "Junior Developer", start: "2023", end: "Present", bullets: ["Built 5+ client projects", "Optimized DB queries by 40%"] }],
      education: [{ school: "State University", degree: "BSc Computer Science", year: "2022", details: "Graduated with honors" }],
      skills: ["HTML", "CSS", "JavaScript", "PHP", "Java", "MySQL", "MongoDB"],
      achievements: [{ title: "AWS Cloud Practitioner", issuer: "Amazon", date: "2024-05", desc: "Certified in cloud architecture fundamentals" }]
    });

    document.getElementById('display-name').textContent = data.name;
    document.getElementById('logo-name').textContent = data.name;
    document.getElementById('footer-name').textContent = data.name;
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('hero-subtitle').textContent = data.title;

    document.getElementById('resume-content').innerHTML = `
      <div class="resume-section"><h3>📞 Contact</h3><p>${data.email} • ${data.phone} • ${data.location}<br><a href="${data.linkedin}">LinkedIn</a> • <a href="${data.github}">GitHub</a></p></div>
      <div class="resume-section"><h3>📝 Summary</h3><p>${data.summary}</p></div>
      <div class="resume-section"><h3>💼 Experience</h3>${data.experience.map(e => `<div class="resume-entry"><h4>${e.role} @ ${e.company}</h4><p class="date">${e.start} – ${e.end}</p><ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>
      <div class="resume-section"><h3>🎓 Education</h3>${data.education.map(ed => `<div class="resume-entry"><h4>${ed.degree}, ${ed.school}</h4><p class="date">${ed.year}</p>${ed.details ? `<p>${ed.details}</p>` : ''}</div>`).join('')}</div>
      <div class="resume-section"><h3>🛠️ Skills</h3><div class="skills-list">${data.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div></div>
      <div class="resume-section"><h3>🏆 Achievements</h3>${data.achievements.map(a => `<div class="resume-entry"><h4>${a.title}</h4><p class="date">${a.issuer} • ${a.date}</p>${a.desc ? `<p>${a.desc}</p>` : ''}</div>`).join('')}</div>
    `;
  }

  // Render Projects
  async function renderProjects() {
    const list = await loadData('content/projects/', []);
    const grid = document.getElementById('projects-grid');
    const projects = Array.isArray(list) ? list : [/* Fallback if directory fetch fails */
      { title: "Portfolio CMS", description: "Interactive developer portfolio with visual content management.", tech: ["HTML", "CSS", "JS", "Decap CMS"], status: "Live", live: "#", repo: "#" },
      { title: "Task Automation Bot", description: "Cross-platform automation tool for repetitive workflows.", tech: ["JavaScript", "Node.js", "API"], status: "In Progress", live: "#", repo: "#" }
    ];

    grid.innerHTML = projects.map(p => `
      <article class="card">
        <h3>${p.title}</h3>
        <p class="meta">${p.status}</p>
        <p>${p.description.substring(0, 120)}...</p>
        <div class="tags">${(p.tech || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div style="margin-top:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          ${p.live ? `<a href="${p.live}" target="_blank" class="btn secondary">Live Demo</a>` : ''}
          ${p.repo ? `<a href="${p.repo}" target="_blank" class="btn secondary">GitHub</a>` : ''}
        </div>
      </article>
    `).join('');
  }

  // Render Blog
  async function renderBlog() {
    const list = await loadData('content/blog/', []);
    const grid = document.getElementById('blog-grid');
    const posts = Array.isArray(list) ? list.slice(0, 3) : [
      { title: "Why I Build with Vanilla JS", date: "2025-03-15", tags: ["JavaScript", "Web Dev"], content: "Frameworks come and go, but fundamentals remain..." }
    ];
    grid.innerHTML = posts.map(b => `
      <article class="card">
        <h3>${b.title}</h3>
        <p class="meta">${new Date(b.date).toLocaleDateString()}</p>
        <p>${b.content.substring(0, 100)}...</p>
        <div class="tags">${(b.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </article>
    `).join('');
  }

  // PDF Download
  document.getElementById('download-resume')?.addEventListener('click', () => {
    window.print();
  });

  // Admin Access Button
  const adminBtn = document.createElement('button');
  adminBtn.textContent = '⚙️ Open CMS';
  adminBtn.className = 'btn secondary';
  adminBtn.style.position = 'fixed';
  adminBtn.style.bottom = '20px';
  adminBtn.style.right = '20px';
  adminBtn.style.zIndex = '999';
  adminBtn.onclick = () => window.location.href = '/admin';
  document.body.appendChild(adminBtn);

  // Init
  renderResume();
  renderProjects();
  renderBlog();
});