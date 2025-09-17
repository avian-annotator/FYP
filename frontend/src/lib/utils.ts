import { UseMutationOptions, UseMutationResult, useMutation } from '@tanstack/react-query'
import { clsx, type ClassValue } from 'clsx'
import { WorkspaceControllerApiFactory } from '../../generated/axios/api.ts'
import { Configuration } from '../../generated/axios/configuration'
import { twMerge } from 'tailwind-merge'
import { RawAxiosRequestConfig, AxiosResponse } from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useUploadMultipleImages(
  workspaceId: number,
  options?: RawAxiosRequestConfig,
  mutationOptions?: Omit<
    UseMutationOptions<AxiosResponse<void>, Error, { file: File }>,
    'mutationFn'
  >,
): UseMutationResult<AxiosResponse<void>, Error, { file: File }> {
  return useMutation<AxiosResponse<void>, Error, { file: File }>({
    mutationFn: async ({ file }) => {
      const api = WorkspaceControllerApiFactory(
        //eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        new Configuration({ basePath: `${import.meta.env.VITE_BACKEND_URL}` }),
      )
      const res = await api.uploadImage(workspaceId, file, {
        ...options,
        withCredentials: true,
      })
      return res
    },
    ...mutationOptions,
  })
}
