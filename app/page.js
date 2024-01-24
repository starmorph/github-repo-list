'use client'
// pages/index.js

import { useEffect, useState } from 'react';
import Head from 'next/head';
import ExportMarkdownButton from './components/ExportMarkdownButton';

const IndexPage = () => {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllRepos = async (username) => {
    try {
      let page = 1;
      let allRepos = [];

      while (true) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
            // No more repositories to fetch
            break;
          }
          allRepos = allRepos.concat(data);
          page++;
        } else {
          console.error('Failed to fetch GitHub repos');
          break;
        }
      }

      setRepos(allRepos);
    } catch (error) {
      console.error('Error fetching GitHub repos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRepos = () => {
    if (username.trim() === '') {
      alert('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    fetchAllRepos(username);
  };

  return (
    <div>
      <Head>
        <title>Github Repo Visualizer</title>
        <meta name="description" content="View and explore GitHub repositories for a user" />
      </Head>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">GitHub Repo Visualizer</h1>
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Enter GitHub username"
              className="border rounded py-2 px-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 ml-2" onClick={handleGetRepos}>
              GET
            </button>
            <ExportMarkdownButton username={username} repos={repos} />
          </div>
          {loading ? (
            <div className="animate-pulse">
              <div className="mb-4">
                <div className="bg-gray-300 h-8 w-2/3"></div>
              </div>
              <div className="mb-4">
                <div className="bg-gray-300 h-8 w-2/3"></div>
              </div>
              <div className="mb-4">
                <div className="bg-gray-300 h-8 w-2/3"></div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
              {repos.map((repo, index) => (
                <div key={repo.id} style={{ border: '1px solid #333', padding: '10px', borderRadius: '5px' }}>
                  <h2 style={{ fontSize: '20px', margin: '0' }}>
                    {index + 1}. <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                  </h2>
                  <p style={{ fontSize: '16px', margin: '5px 0' }}>{repo.description || 'No description available'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {repo.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
