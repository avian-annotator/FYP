import { useQuery, useMutation } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import type { RawAxiosRequestConfig,  AxiosResponse } from "axios";
import { Configuration } from "../generated/axios/configuration.ts";
import { AdminControllerApiFactory } from "../generated/axios/api.ts";
import { AuthenticationControllerApiFactory } from "../generated/axios/api.ts";
import { WorkspaceControllerApiFactory } from "../generated/axios/api.ts";
import type { UserResponseDTO, CreateUserRequestBodyDTO, EditUserRequestBodyDTO, CurrentUserResponseDTO, AddUserToWorkspaceRequestBodyDTO, WorkspaceResponseDTO, CreateWorkspaceRequestBodyDTO, EditWorkspaceRequestBodyDTO, PageWrapperUserResponseDTO, GetUsersFromWorkspaceRequestParamDTO, Pageable, PageWrapperAccessibleWorkspaceResponseDTO } from "../generated/axios/api.ts";

// This is an auto-generated file. Do not edit manually, instead run the generate.bash
export function useCreateNewUser(createUserRequestBodyDTO: CreateUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<UserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<UserResponseDTO>, Error> {

  return useMutation<AxiosResponse<UserResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.createNewUser(createUserRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useDeleteUser(id: number, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<void>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<void>, Error> {

  return useMutation<AxiosResponse<void>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.deleteUser(id, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useEditUser(id: number, editUserRequestBodyDTO: EditUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<UserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<UserResponseDTO>, Error> {

  return useMutation<AxiosResponse<UserResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.editUser(id, editUserRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useGetAllUsers(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<AxiosResponse<UserResponseDTO[]>, Error, AxiosResponse<UserResponseDTO[]>>, 'queryKey' | 'queryFn'>): UseQueryResult<AxiosResponse<UserResponseDTO[]>, Error> {

  return useQuery<AxiosResponse<UserResponseDTO[]>, Error, AxiosResponse<UserResponseDTO[]>>({
    queryKey: ['useGetAllUsers' ],
    queryFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getAllUsers({...options, withCredentials: true});
      return res;
    },
    ...queryOptions
  });
    
}

export function useGetCurrentUser(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<AxiosResponse<CurrentUserResponseDTO>, Error, AxiosResponse<CurrentUserResponseDTO>>, 'queryKey' | 'queryFn'>): UseQueryResult<AxiosResponse<CurrentUserResponseDTO>, Error> {

  return useQuery<AxiosResponse<CurrentUserResponseDTO>, Error, AxiosResponse<CurrentUserResponseDTO>>({
    queryKey: ['useGetCurrentUser' ],
    queryFn: async () => {
      const api = AuthenticationControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getCurrentUser({...options, withCredentials: true});
      return res;
    },
    ...queryOptions
  });
    
}

export function useAddUserToWorkspace(workspaceId: number, addUserToWorkspaceRequestBodyDTO: AddUserToWorkspaceRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<void>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<void>, Error> {

  return useMutation<AxiosResponse<void>, Error, unknown>({
    mutationFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.addUserToWorkspace(workspaceId, addUserToWorkspaceRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useCreateWorkspace(createWorkspaceRequestBodyDTO: CreateWorkspaceRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<WorkspaceResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<WorkspaceResponseDTO>, Error> {

  return useMutation<AxiosResponse<WorkspaceResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.createWorkspace(createWorkspaceRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useDeleteWorkspace(workspaceId: number, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<void>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<void>, Error> {

  return useMutation<AxiosResponse<void>, Error, unknown>({
    mutationFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.deleteWorkspace(workspaceId, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useEditWorkspace(workspaceId: number, editWorkspaceRequestBodyDTO: EditWorkspaceRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<WorkspaceResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<WorkspaceResponseDTO>, Error> {

  return useMutation<AxiosResponse<WorkspaceResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.editWorkspace(workspaceId, editWorkspaceRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useGetUsersFromWorkspace(workspaceId: number, param: GetUsersFromWorkspaceRequestParamDTO, pageable: Pageable, options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<AxiosResponse<PageWrapperUserResponseDTO>, Error, AxiosResponse<PageWrapperUserResponseDTO>>, 'queryKey' | 'queryFn'>): UseQueryResult<AxiosResponse<PageWrapperUserResponseDTO>, Error> {

  return useQuery<AxiosResponse<PageWrapperUserResponseDTO>, Error, AxiosResponse<PageWrapperUserResponseDTO>>({
    queryKey: ['useGetUsersFromWorkspace' , options?.params, options?.headers],
    queryFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getUsersFromWorkspace(workspaceId, param, pageable, {...options, withCredentials: true});
      return res;
    },
    ...queryOptions
  });
    
}

export function useGetWorkspaces(pageable: Pageable, options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<AxiosResponse<PageWrapperAccessibleWorkspaceResponseDTO>, Error, AxiosResponse<PageWrapperAccessibleWorkspaceResponseDTO>>, 'queryKey' | 'queryFn'>): UseQueryResult<AxiosResponse<PageWrapperAccessibleWorkspaceResponseDTO>, Error> {

  return useQuery<AxiosResponse<PageWrapperAccessibleWorkspaceResponseDTO>, Error, AxiosResponse<PageWrapperAccessibleWorkspaceResponseDTO>>({
    queryKey: ['useGetWorkspaces' , options?.params, options?.headers],
    queryFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getWorkspaces(pageable, {...options, withCredentials: true});
      return res;
    },
    ...queryOptions
  });
    
}

export function useRemoveUserFromWorkspace(workspaceId: number, userId: number, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<void>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<void>, Error> {

  return useMutation<AxiosResponse<void>, Error, unknown>({
    mutationFn: async () => {
      const api = WorkspaceControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.removeUserFromWorkspace(workspaceId, userId, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}
