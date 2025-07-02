import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosResponse, RawAxiosRequestConfig } from "axios";
import { Configuration } from "../generated/out/configuration.ts";
import { AuthenticationControllerApiFactory } from "../generated/out/api.ts";
import { CurrentUserResponseDTO } from "../generated/out/api.ts";
import { CustomErrorControllerApiFactory } from "../generated/out/api.ts";
import { GreetingControllerApiFactory } from "../generated/out/api.ts";

// This is an auto-generated file. Do not edit manually, instead run the generate.bash
export function useGetCurrentUser<TData = CurrentUserResponseDTO>(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<CurrentUserResponseDTO, unknown, TData>, 'queryKey' | 'queryFn'>): UseQueryResult<TData> {

  return useQuery({
    queryKey: ['getCurrentUser', options?.params, options?.headers],
    queryFn: async () => {
      const api = AuthenticationControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<CurrentUserResponseDTO> = await api.getCurrentUser({...options, withCredentials: true});
      return res.data;
    },
    ...queryOptions
  });
    
}

export function useHandleError<TData = string>(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<string, unknown, TData>, 'queryKey' | 'queryFn'>): UseQueryResult<TData> {

  return useQuery({
    queryKey: ['handleError', options?.params, options?.headers],
    queryFn: async () => {
      const api = CustomErrorControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<string> = await api.handleError({...options, withCredentials: true});
      return res.data;
    },
    ...queryOptions
  });
    
}

export function useHello<TData = string>(options?: RawAxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<string, unknown, TData>, 'queryKey' | 'queryFn'>): UseQueryResult<TData> {

  return useQuery({
    queryKey: ['hello', options?.params, options?.headers],
    queryFn: async () => {
      const api = GreetingControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<string> = await api.hello({...options, withCredentials: true});
      return res.data;
    },
    ...queryOptions
  });
    
}
