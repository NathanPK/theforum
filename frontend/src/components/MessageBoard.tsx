import { useState, useEffect } from 'react';
import { Post } from '../types';
import { fetchPosts, fetchPostById } from '../api';
import { PostCard } from './PostCard';

interface MessageBoardProps {
  parentId: string | null;
  onNavigate: (postId: string) => void;
  onBack: () => void;
}

export function MessageBoard({ parentId, onNavigate, onBack }: MessageBoardProps) {
  const [ownerPost, setOwnerPost] = useState<Post | null>(null);
  const [childPosts, setChildPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);

        if (parentId) {
          // We're viewing a specific post's board
          // Fetch the post itself as the owner
          const owner = await fetchPostById(parentId);
          setOwnerPost(owner);

          // Fetch its children
          const children = await fetchPosts(parentId);
          setChildPosts(children);
        } else {
          // We're at the root level
          // Fetch all root posts
          const rootPosts = await fetchPosts(null);

          // Use the first pinned post or first post as the owner
          const owner = rootPosts.find((p) => p.pinned) || rootPosts[0];
          setOwnerPost(owner || null);

          // The rest are child posts
          setChildPosts(rootPosts.filter((p) => p.id !== owner?.id));
        }

        setError(null);
      } catch (err) {
        setError('Failed to load board. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [parentId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      {parentId && (
        <button
          onClick={onBack}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          ← Back
        </button>
      )}

      {ownerPost && (
        <PostCard post={ownerPost} onClick={onNavigate} isHeader={true} />
      )}

      {childPosts.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          {childPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={onNavigate} />
          ))}
        </div>
      ) : (
        ownerPost && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontStyle: 'italic' }}>
            No posts in this board yet
          </div>
        )
      )}
    </div>
  );
}
