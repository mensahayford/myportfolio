document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuBtn?.addEventListener('click', () => navLinks.classList.toggle('active'));

  // Load Resume Data
  async function loadResume() {
    try {
      const res = await fetch('content/resume.json');
      const data = await res.json();
      
      document.getElementById('display-name').textContent = data.name;
      document.getElementById('logo-name').textContent = data.name;
      document.getElementById('footer-name').textContent = data.name;
      document.getElementById('footer-year').textContent = new Date().getFullYear();
      document.getElementById('hero-subtitle').textContent = data.title;

      // Build Resume HTML
      const resumeEl = document.getElementById('resume-content');
      resumeEl.innerHTML = `
        <div class="resume-section">
          <h3>📞 Contact</h3>
          <p><strong>Email:</strong> ${data.email} | <strong>Phone:</strong> ${data.phone} | <strong>Location:</strong> ${data.location}</p>
          <p><strong>LinkedIn:</strong> ${data.linkedin} | <strong>GitHub:</strong> ${data.github}</p>
        </div>
        <div class="resume-section">
          <h3>📝 Summary</h3>
          <p>${data.summary}</p>
        </div>
        <div class="resume-section">
          <h3>💼 Experience</h3>
          ${data.experience.map(exp => `
            <div class="resume-entry">
              <h4>${exp.role} @ ${exp.company}</h4>
              <p class="date">${exp.start} – ${exp.end}</p>
              <ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
        <div class="resume-section">
          <h3>🎓 Education</h3>
          ${data.education.map(edu => `
            <div class="resume-entry">
              <h4>${edu.degree}, ${edu.school}</h4>
              <p class="date">${edu.year}</p>
              ${edu.details ? `<p>${edu.details}</p>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="resume-section">
          <h3>🛠️ Skills</h3>
          <div class="skills-list">${data.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
        </div>
        <div class="resume-section">
          <h3>🏆 Achievements & Certifications</h3>
          ${data.achievements.map(a => `
            <div class="resume-entry">
              <h4>${a.title}</h4>
              <p class="date">${a.issuer} • ${a.date}</p>
              ${a.desc ? `<p>${a.desc}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;

      // Social Links
      const socialEl = document.getElementById('social-links');
      socialEl.innerHTML = `
        <a href="${data.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${data.github}" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:${data.email}">Email</a>
      `;
    } catch (e) {
      console.warn('Resume not yet published. Publish via /admin to activate.');
    }
  }

  // Load Projects
  async function loadProjects() {
    try {
      const res = await fetch('content/projects/');
      const list = await res.json(); // Decap returns array of files
      const grid = document.getElementById('projects-grid');
      grid.innerHTML = list.map(p => `
        <article class="card">
          <h3>${p.title}</h3>
          <p class="meta">${p.status}</p>
          <p>${p.description.substring(0, 120)}...</p>
          <div class="tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div style="margin-top:1rem; display:flex; gap:0.5rem;">
            ${p.live ? `<a href="${p.live}" target="_blank" class="btn secondary">Live Demo</a>` : ''}
            ${p.repo ? `<a href="${p.repo}" target="_blank" class="btn secondary">GitHub</a>` : ''}
          </div>
        </article>
      `).join('');
    } catch (e) {}
  }

  // Load Blog
  async function loadBlog() {
    try {
      const res = await fetch('content/blog/');
      const list = await res.json();
      const grid = document.getElementById('blog-grid');
      grid.innerHTML = list.slice(0, 3).map(b => `
        <article class="card">
          <h3>${b.title}</h3>
          <p class="meta">${new Date(b.date).toLocaleDateString()}</p>
          <p>${b.content.substring(0, 100)}...</p>
          <div class="tags">${b.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </article>
      `).join('');
    } catch (e) {}
  }

  // PDF Download Trigger
  document.getElementById('download-resume')?.addEventListener('click', () => {
    window.print();
  });

  // Init
  loadResume();
  loadProjects();
  loadBlog();
});