'use client';

import React from 'react';

interface MultimediaProps {
  resources: { type: string; url: string; title: string }[];
}

export default function Multimedia({ resources }: MultimediaProps) {
  return (
    <div>
      <h2>Multimedia Resources</h2>
      <div style={{ marginTop: '20px' }}>
        {resources.map((resource, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>{resource.title}</h3>
            {resource.type === 'video' ? (
              <video
                controls
                style={{ width: '100%', maxWidth: '600px', border: '1px solid #ccc', borderRadius: '8px' }}
              >
                <source src={resource.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : resource.type === 'pdf' ? (
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            ) : (
              <p>Unsupported resource type</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
