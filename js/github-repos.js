// Usage: Call renderGitHubRepos('github-username', 'container-id');

async function fetchGitHubRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!response.ok) throw new Error('Failed to fetch repos');
        return await response.json();
    } catch (error) {
        console.error('Error fetching repos:', error);
        throw error;
    }
}

function createRepoElement(repo) {
    const div = document.createElement('div');
    div.className = 'repo-item';
    
    const repoHeader = document.createElement('div');
    repoHeader.className = 'repo-header';
    
    const title = document.createElement('h4');
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.textContent = repo.name;
    title.appendChild(link);
    
    const stats = document.createElement('div');
    stats.className = 'repo-stats';
    
    if (repo.language) {
        const language = document.createElement('span');
        language.className = 'language';
        language.textContent = repo.language;
        stats.appendChild(language);
    }
    
    repoHeader.appendChild(title);
    repoHeader.appendChild(stats);
    
    const description = document.createElement('p');
    description.textContent = repo.description || 'No description available';
    
    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    const updateDate = document.createElement('small');
    updateDate.textContent = `Updated: ${new Date(repo.updated_at).toLocaleDateString()}`;
    meta.appendChild(updateDate);
    
    div.appendChild(repoHeader);
    div.appendChild(description);
    div.appendChild(meta);
    
    return div;
}

async function renderGitHubRepos(username, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading repositories...</div>';
    
    try {
        const repos = await fetchGitHubRepos(username);
        console.log('Fetched repos:', repos.length);
        
        container.innerHTML = '';
        
        // Filter out forks and sort by updated date
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        console.log('Filtered repos:', filteredRepos.length);
        
        if (filteredRepos.length === 0) {
            container.innerHTML = '<div class="no-repos">No public repositories found.</div>';
            return;
        }
        
        filteredRepos.forEach(repo => {
            container.appendChild(createRepoElement(repo));
        });
        
    } catch (error) {
        console.error('Error rendering repos:', error);
        container.innerHTML = '<div class="error">Error loading repositories. Please try again later.</div>';
    }
}

// Auto-load when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, loading repos...');
    renderGitHubRepos('shank250', 'github-repo-list');
});
