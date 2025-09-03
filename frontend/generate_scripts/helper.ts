import type { SourceFile } from 'ts-morph'

export const importInit = (useQueryHooksFile: SourceFile) => {
  useQueryHooksFile.addStatements(`
  // This is an auto-generated file. Do not edit manually, instead run the generate.bash`)
  useQueryHooksFile.addImportDeclaration({
    namedImports: ['useQuery', 'useMutation'],
    moduleSpecifier: `@tanstack/react-query`,
  })

  useQueryHooksFile.addImportDeclaration({
    namedImports: ['UseQueryOptions', 'UseQueryResult', 'UseMutationOptions', 'UseMutationResult'],
    isTypeOnly: true,
    moduleSpecifier: `@tanstack/react-query`,
  })
  useQueryHooksFile.addImportDeclaration({
    namedImports: ['RawAxiosRequestConfig', ' AxiosResponse'],
    isTypeOnly: true,
    moduleSpecifier: 'axios',
  })

  useQueryHooksFile.addImportDeclaration({
    namedImports: ['Configuration'],
    moduleSpecifier: `../generated/axios/configuration.ts`,
  })
}
