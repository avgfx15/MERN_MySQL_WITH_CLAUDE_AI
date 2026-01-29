import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/UserService';
import toast from 'react-hot-toast';

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userAPI.getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single user
export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userAPI.getUser(id),
    enabled: !!id,
  });
};

// Register user
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      toast.success('Registration successful!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

// Login user
export const useLogin = () => {
  return useMutation({
    mutationFn: userAPI.login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => userAPI.updateUser(id, userData),
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Update failed');
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Delete failed');
    },
  });
};
