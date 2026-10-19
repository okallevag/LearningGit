// Fetch events.json and render a simple starred repositories list.
// Expects events.json to be in the same directory (relative path).
async function loadStarred() {
  const container = document.getElementById('starred-list');
  const status = document.getElementById('starred-status');

  try {
    status.textContent = 'Loading...';
    const res = await fetch('events.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<div class="empty">No starred repositories found.</div>';
      status.textContent = '';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'starred-list';

    data.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'starred-item';

      const title = document.createElement('a');
      title.className = 'repo-title';
      title.href = item.url || '#';
      title.target = '_blank';
      title.rel = 'noopener noreferrer';
      title.textContent = `${item.owner}/${item.repo}`;

      const meta = document.createElement('div');
      meta.className = 'repo-meta';
      const lang = document.createElement('span');
      lang.textContent = item.language || '—';
      const starredAt = document.createElement('span');
      starredAt.textContent = item.starred_at ? (new Date(item.starred_at)).toLocaleString() : '';

      meta.appendChild(lang);
      if (starredAt.textContent) meta.appendChild(starredAt);

      const desc = document.createElement('div');
      desc.className = 'repo-desc';
      desc.textContent = item.description || '';

      li.appendChild(title);
      li.appendChild(meta);
      if (desc.textContent) li.appendChild(desc);
      ul.appendChild(li);
    });

    container.innerHTML = '';
    container.appendChild(ul);
    status.textContent = '';
  } catch (err) {
    container.innerHTML = `<div class="empty">Could not load starred list: ${err.message}</div>`;
    status.textContent = '';
    console.error('loadStarred error', err);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadStarred);
} else {
  loadStarred();
}
