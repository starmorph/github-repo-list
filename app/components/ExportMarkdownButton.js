// components/ExportMarkdownButton.js

import React from 'react';

const ExportMarkdownButton = ({ username, repos }) => {
  const exportMarkdown = () => {
    if (!repos || repos.length === 0) {
      console.error('No repositories to export.');
      return;
    }

    // Create a Markdown content string
    const markdownContent = repos
      .map((repo, index) => {
        const repoName = repo.name;
        const repoDescription = repo.description;
        const repoUrl = repo.html_url;

        if (repoDescription) {
          return `[${repoName}](${repoUrl}) - ${repoDescription}`;
        } else {
          return `[${repoName}](${repoUrl})`;
        }
      })
      .join('\n\n');

    // Create a Blob containing the Markdown content
    const blob = new Blob([markdownContent], { type: 'text/markdown' });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'github_repos.md';
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4" onClick={exportMarkdown}>
      Export Markdown
    </button>
  );
};

export default ExportMarkdownButton;
