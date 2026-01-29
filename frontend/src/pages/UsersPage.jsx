import { useUsers, useDeleteUser } from '../hooks/useUserQueries';
import { Link } from 'react-router-dom';

const Users = () => {
  const { data, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  const users = data?.data || [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Users List</h1>
        <Link to='/register' style={styles.addButton}>
          Add New User
        </Link>
      </div>

      {users.length === 0 ? (
        <p style={styles.noUsers}>No users found. Create your first user!</p>
      ) : (
        <div style={styles.grid}>
          {users.map((user) => (
            <div key={user.id} style={styles.card}>
              <h3 style={styles.userName}>{user.name}</h3>
              <p style={styles.userEmail}>{user.email}</p>
              <p style={styles.userRole}>Role: {user.role}</p>
              <div style={styles.cardActions}>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={styles.deleteButton}
                  disabled={deleteUserMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to='/' style={styles.backButton}>
        Back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#dc2626',
  },
  noUsers: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  userName: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  userEmail: {
    color: '#666',
    marginBottom: '0.5rem',
  },
  userRole: {
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  backButton: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#64748b',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
  },
};

export default Users;
