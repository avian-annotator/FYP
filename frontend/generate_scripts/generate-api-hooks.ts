import { Project, SyntaxKind } from 'ts-morph'

// NOTE: auth hooks are NOT generated here, specifically the login and logout hooks, as they are not part of the OpenAPI spec (plus aditional concerns).

//TODO: Fix response DTO to be recursive, as it currently only works for the first level of type arguments.
//TODO: Fix type gen to include query params

const project = new Project({
  manipulationSettings: {
    // @ts-ignore - this is correct, but ts is being an idiot
    indentationText: '  ',
  },
})

// Init
const generatedApisFile = project.addSourceFileAtPath('../generated/axios/api.ts')
const useQueryHooksFile = project.createSourceFile('../generated/use-query-hooks.ts', ``, {
  overwrite: true,
})

// Add imports for all the generated APIs
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

const generatedHookNames: string[] = []
const importedTypes = new Set<string>()
const apiFactoryFunctions = generatedApisFile
  .getVariableDeclarations()
  .filter(v => v.isExported() && v.getName().endsWith('ControllerApiFactory'))

for (const apiFactory of apiFactoryFunctions) {
  useQueryHooksFile.addImportDeclaration({
    namedImports: [apiFactory.getName()],
    moduleSpecifier: `../generated/axios/${apiFactory.getSourceFile().getBaseName()}`,
  })

  // Get the paramCreator for the controller, as that contains information on the METHOD type, which we need
  const paramCreatorName = apiFactory.getName().replace('Factory', '') + 'AxiosParamCreator'
  const paramCreatorFunction = generatedApisFile
    .getVariableDeclarations()
    .find(v => v.isExported() && v.getName() === paramCreatorName)

  const returnStatement = paramCreatorFunction?.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0]
  if (!returnStatement) throw new Error('Return statement not found')
  const objExpr = returnStatement.getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
  const properties = objExpr.getProperties()

  const endpointMethodNames = properties.map(p =>
    p.asKind(SyntaxKind.PropertyAssignment)?.getName(),
  )
  // This handsome fellow traverses the AST to find the endpoint method names
  const endpointMethodRequestMethods = properties.map(p => {
    const initializer = p
      .asKind(SyntaxKind.PropertyAssignment)
      ?.getInitializerOrThrow()
      .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
      .find(v => v.getName() === 'localVarRequestOptions')
      ?.getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)
      .getFirstDescendantByKindOrThrow(SyntaxKind.PropertyAssignment)
      .getInitializer()

    return initializer?.getKind() === SyntaxKind.StringLiteral
      ? initializer.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralText()
      : initializer?.getText()
  })
  const endpointMethodReturnTypes = apiFactory
    .getFirstDescendantByKindOrThrow(SyntaxKind.ReturnStatement)
    .getFirstDescendantByKindOrThrow(SyntaxKind.ObjectLiteralExpression)

  const isPrimitive = (typeName: string) =>
    ['string', 'number', 'boolean', 'unknown', 'any', 'void', 'null', 'undefined'].includes(
      typeName.toLowerCase(),
    )

  const isMutation = (methodName: string) =>
    ['post', 'put', 'patch', 'delete'].includes(methodName.toLowerCase())

  for (let i = 0; i < endpointMethodNames.length; i++) {
    const endpointMethodName = endpointMethodNames[i] as string
    const endpointMethodRequestMethod = endpointMethodRequestMethods[i] as string

    // When getting the return type, we need to RECURSIVELY CHECK the type arguments, as they can be nested
    // This needs to be fixed, but should be good enough for now. Currently this is pretty shitty and only works for the first level of type arguments.
    const typeArgs = sanitizeTypeText(
      endpointMethodReturnTypes
        .getPropertyOrThrow(endpointMethodName)
        .asKindOrThrow(SyntaxKind.MethodDeclaration)
        .getReturnType()
        .getTypeArguments()[0]
        .getTypeArguments()[0]
        .getText(),
    )

    if (!isPrimitive(typeArgs)) {
      importedTypes.add(onlyAlphanumeric(typeArgs))
    }

    const endpointParameterNamesAndTypesText: { name: string; type: string }[] = []

    const endpointParameterNamesAndTypesTextParameter = endpointMethodReturnTypes
      .getPropertyOrThrow(endpointMethodName)
      .asKindOrThrow(SyntaxKind.MethodDeclaration)
      .getParameters()
    for (const param of endpointParameterNamesAndTypesTextParameter) {
      // All the params before are the parameters we actually use
      if (param.getName() == 'options') break
      const paramName = param.getName()
      const paramType = sanitizeTypeText(param.getType().getText())
      endpointParameterNamesAndTypesText.push({ name: paramName, type: paramType })
    }

    for (const param of endpointParameterNamesAndTypesText) {
      if (!isPrimitive(param.type)) {
        importedTypes.add(param.type)
      }
    }

    //Note: A bit unsure with hasQuestionToken. Seems to be best to default to requried.
    const extraHookParameters = endpointParameterNamesAndTypesText.map(param => {
      return { name: param.name, type: param.type, hasQuestionToken: false }
    })

    const hookName = `use${endpointMethodName[0].toUpperCase()}${endpointMethodName.slice(1)}`
    generatedHookNames.push(hookName)

    if (isMutation(endpointMethodRequestMethod)) {
      useQueryHooksFile.addFunction({
        name: hookName,
        isExported: true,
        parameters: [
          ...extraHookParameters,
          {
            name: 'options',
            type: 'RawAxiosRequestConfig',
            hasQuestionToken: true,
          },
          {
            name: 'mutationOptions',
            type: `Omit<UseMutationOptions< AxiosResponse<${typeArgs}>, Error, unknown>, 'mutationFn'>`,
            hasQuestionToken: true,
          },
        ],
        returnType: `UseMutationResult<AxiosResponse<${typeArgs}>, Error>`,
        statements: `
return useMutation<AxiosResponse<${typeArgs}>, Error, unknown>({
  mutationFn: async () => {
    const api = ${apiFactory.getName()}(new Configuration({ basePath: \`\${import.meta.env.VITE_BACKEND_URL}\` }));
    const res = await api.${endpointMethodName}(${extraHookParameters.map(p => p.name).join(', ')}${extraHookParameters.length > 0 ? ', ' : ''}{...options, withCredentials: true});
    return res;
  },
  ...mutationOptions
});
  `,
      })
    } else {
      useQueryHooksFile.addFunction({
        name: hookName,
        isExported: true,
        parameters: [
          ...extraHookParameters,
          {
            name: 'options',
            type: 'RawAxiosRequestConfig',
            hasQuestionToken: true,
          },
          {
            name: 'queryOptions',
            type: `Omit<UseQueryOptions<AxiosResponse<${typeArgs}>, Error, AxiosResponse<${typeArgs}>>, 'queryKey' | 'queryFn'>`,
            hasQuestionToken: true,
          },
        ],
        returnType: `UseQueryResult<AxiosResponse<${typeArgs}>, Error>`,
        statements: `
return useQuery<AxiosResponse<${typeArgs}>, Error, AxiosResponse<${typeArgs}>>({
  queryKey: ['${hookName}' ${extraHookParameters.length > 0 ? ', options?.params, options?.headers' : ''}],
  queryFn: async () => {
    const api = ${apiFactory.getName()}(new Configuration({ basePath: \`\${import.meta.env.VITE_BACKEND_URL}\` }));
    const res = await api.${endpointMethodName}(${extraHookParameters.map(p => p.name).join(', ')}${extraHookParameters.length > 0 ? ', ' : ''}{...options, withCredentials: true});
    return res;
  },
  ...queryOptions
});
  `,
      })
    }
  }
}

const indexFile = project.createSourceFile('../generated/index.ts', ``, { overwrite: true })
useQueryHooksFile.addImportDeclaration({
  namedImports: Array.from(importedTypes.values()),
  moduleSpecifier: '../generated/axios/api.ts',
  isTypeOnly: true,
})

// Add import for all hooks from the hooks file
indexFile.addImportDeclaration({
  namedImports: generatedHookNames,
  moduleSpecifier: './use-query-hooks',
})

// Export all hooks
indexFile.addExportDeclaration({
  namedExports: generatedHookNames,
})

indexFile.addExportDeclaration({
  moduleSpecifier: './axios/api.ts',
  isTypeOnly: true,
})

await project.save()

function sanitizeTypeText(typeText: string): string {
  return typeText
    .replace(/import\([^)]+\)\./g, '') // Remove import paths like import("...").
    .replace(/\s+/g, '') // Remove any whitespace.
    .replace(/^Promise<(.+)>$/, '$1') // Unwrap Promise if present.
}

function onlyAlphanumeric(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '')
}
