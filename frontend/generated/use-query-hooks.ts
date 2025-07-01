import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse, RawAxiosRequestConfig } from "axios";
import { Configuration } from "../generated/out/configuration.ts";
import { AuthenticationControllerApiFactory } from "../generated/out/api.ts";
import { CurrentUserResponseDTO } from "../generated/out/api.ts";
import { CustomErrorControllerApiFactory } from "../generated/out/api.ts";
import { GreetingControllerApiFactory } from "../generated/out/api.ts";

// This is an auto-generated file. Do not edit manually, instead run the generate.bash
export function useGetCurrentUser(options?: RawAxiosRequestConfig): { data: CurrentUserResponseDTO | undefined, isLoading: boolean, isError: boolean } {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCurrentUser', options?.params, options?.headers],
    queryFn: async () => {
      const api = AuthenticationControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<CurrentUserResponseDTO> = await api.getCurrentUser(options);
      return res.data;
    },
  });

  console.log("useGetCurrentUser", data, isLoading, isError);
  return { data, isLoading, isError };

}

export function useHandleError(options?: RawAxiosRequestConfig): { data: string | undefined, isLoading: boolean, isError: boolean } {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['handleError', options?.params, options?.headers],
    queryFn: async () => {
      const api = CustomErrorControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<string> = await api.handleError(options);
      return res.data;
    },
  });
  return { data, isLoading, isError };

}

export function useHello(options?: RawAxiosRequestConfig): { data: string | undefined, isLoading: boolean, isError: boolean } {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hello', options?.params, options?.headers],
    queryFn: async () => {
      const api = GreetingControllerApiFactory(new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }));
      const res: AxiosResponse<string> = await api.hello(options);
      return res.data;
    },
  });
  return { data, isLoading, isError };

}
