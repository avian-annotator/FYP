import { useQuery, UseQueryOptions, UseQueryResult, useMutation, UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { RawAxiosRequestConfig,  AxiosResponse } from "axios";
import { Configuration } from "../generated/axios/configuration.ts";
import { AdminControllerApiFactory } from "../generated/axios/api.ts";
import { CreateUserRequestBodyDTO } from "../generated/axios/api.ts";
import { EditUserRequestBodyDTO } from "../generated/axios/api.ts";
import { AuthenticationControllerApiFactory } from "../generated/axios/api.ts";
import { CreateUserResponseDTO, EditUserResponseDTO, CurrentUserResponseDTO } from "../generated/axios/api.ts";

// This is an auto-generated file. Do not edit manually, instead run the generate.bash
export function useCreateNewUser(createUserRequestBodyDTO: CreateUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<CreateUserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<CreateUserResponseDTO>, Error> {

  return useMutation<AxiosResponse<CreateUserResponseDTO>, Error, unknown>({
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

export function useEditUser(id: number, editUserRequestBodyDTO: EditUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< AxiosResponse<EditUserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<AxiosResponse<EditUserResponseDTO>, Error> {

  return useMutation<AxiosResponse<EditUserResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.editUser(id, editUserRequestBodyDTO, {...options, withCredentials: true});
      return res;
    },
    ...mutationOptions
  });
    
}

export function useGetAllUsers(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<AxiosResponse<CreateUserResponseDTO[]>, Error, AxiosResponse<CreateUserResponseDTO[]>>, 'queryKey' | 'queryFn'>): UseQueryResult<AxiosResponse<CreateUserResponseDTO[]>, Error> {

  return useQuery<AxiosResponse<CreateUserResponseDTO[]>, Error, AxiosResponse<CreateUserResponseDTO[]>>({
    queryKey: ['', options?.params, options?.headers],
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
    queryKey: ['', options?.params, options?.headers],
    queryFn: async () => {
      const api = AuthenticationControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getCurrentUser({...options, withCredentials: true});
      return res;
    },
    ...queryOptions
  });
    
}
