import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: (postId: string) => void;
  isHeader?: boolean;
}

export function PostCard({ post, onClick, isHeader = false }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={isHeader ? undefined : () => onClick(post.id)}
      style={{
        backgroundColor: isHeader ? '#fefce8' : 'white',
        border: isHeader ? '3px solid #eab308' : '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: isHeader ? '20px' : '16px',
        marginBottom: '12px',
        cursor: isHeader ? 'default' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: isHeader ? '0 6px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isHeader) {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isHeader) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '40px',
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ▲
          </button>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: post.votes > 0 ? '#10b981' : '#6b7280',
            }}
          >
            {post.votes}
          </span>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ▼
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h3
              style={{
                margin: 0,
                fontSize: isHeader ? '26px' : '18px',
                fontWeight: isHeader ? '700' : '600',
                color: '#111827',
              }}
            >
              {post.title}
            </h3>
            {isHeader && (
              <span
                style={{
                  fontSize: '12px',
                  padding: '3px 10px',
                  backgroundColor: '#eab308',
                  color: 'white',
                  borderRadius: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Board Owner
              </span>
            )}
            {post.pinned && !isHeader && (
              <span
                style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '4px',
                  fontWeight: '500',
                }}
              >
                Pinned
              </span>
            )}
          </div>

          <p
            style={{
              margin: '8px 0',
              color: isHeader ? '#374151' : '#4b5563',
              fontSize: isHeader ? '16px' : '14px',
              lineHeight: '1.6',
              fontWeight: isHeader ? '500' : 'normal',
            }}
          >
            {post.content}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
            }}
          >
            <span style={{ fontWeight: '500' }}>{post.author.name}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
