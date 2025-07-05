import { useQuery, UseQueryOptions, UseQueryResult, useMutation, UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { RawAxiosRequestConfig } from "axios";
import { Configuration } from "../generated/axios/configuration.ts";
import { WithStatusType } from "../generate_scripts/api-types.ts";
import { AdminControllerApiFactory } from "../generated/axios/api.ts";
import { CreateUserRequestBodyDTO } from "../generated/axios/api.ts";
import { EditUserRequestBodyDTO } from "../generated/axios/api.ts";
import { AuthenticationControllerApiFactory } from "../generated/axios/api.ts";
import { CreateUserResponseDTO, EditUserResponseDTO, CurrentUserResponseDTO } from "../generated/axios/api.ts";

// This is an auto-generated file. Do not edit manually, instead run the generate.bash
export function useCreateNewUser(createUserRequestBodyDTO: CreateUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< WithStatusType<CreateUserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<WithStatusType<CreateUserResponseDTO>, Error> {

  return useMutation<WithStatusType<CreateUserResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.createNewUser(createUserRequestBodyDTO, {...options, withCredentials: true});
      return {...res.data, status: res.status};
    },
    ...mutationOptions
  });
    
}

export function useDeleteUser(id: number, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< WithStatusType<void>, Error, unknown>, 'mutationFn'>): UseMutationResult<WithStatusType<void>, Error> {

  return useMutation<WithStatusType<void>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.deleteUser(id, {...options, withCredentials: true});
      return {data: undefined, status: res.status};
    },
    ...mutationOptions
  });
    
}

export function useEditUser(id: number, editUserRequestBodyDTO: EditUserRequestBodyDTO, options?: RawAxiosRequestConfig, mutationOptions?: Omit<UseMutationOptions< WithStatusType<EditUserResponseDTO>, Error, unknown>, 'mutationFn'>): UseMutationResult<WithStatusType<EditUserResponseDTO>, Error> {

  return useMutation<WithStatusType<EditUserResponseDTO>, Error, unknown>({
    mutationFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.editUser(id, editUserRequestBodyDTO, {...options, withCredentials: true});
      return {...res.data, status: res.status};
    },
    ...mutationOptions
  });
    
}

export function useGetAllUsers(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<CreateUserResponseDTO[], Error, WithStatusType<CreateUserResponseDTO[]>>, 'queryKey' | 'queryFn'>): UseQueryResult<WithStatusType<CreateUserResponseDTO[]>, Error> {

  return useQuery<CreateUserResponseDTO[], Error, WithStatusType<CreateUserResponseDTO[]>>({
    queryKey: ['', options?.params, options?.headers],
    queryFn: async () => {
      const api = AdminControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getAllUsers({...options, withCredentials: true});
      return {...res.data, status: res.status};
    },
    ...queryOptions
  });
    
}

export function useGetCurrentUser(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<CurrentUserResponseDTO, Error, WithStatusType<CurrentUserResponseDTO>>, 'queryKey' | 'queryFn'>): UseQueryResult<WithStatusType<CurrentUserResponseDTO>, Error> {

  return useQuery<CurrentUserResponseDTO, Error, WithStatusType<CurrentUserResponseDTO>>({
    queryKey: ['', options?.params, options?.headers],
    queryFn: async () => {
      const api = AuthenticationControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res = await api.getCurrentUser({...options, withCredentials: true});
      return {...res.data, status: res.status};
    },
    ...queryOptions
  });
    
}
