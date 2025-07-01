import { Project, ReturnStatement } from "ts-morph";

const project = new Project({
  manipulationSettings: {
    // @ts-ignore - this is correct, but ts is being an idiot
    indentationText: "  ",
  },
})

const generatedApisFile = project.addSourceFileAtPath("../generated/out/api.ts")
const useQueryHooksFile = project.createSourceFile("../generated/use-query-hooks.ts", ``, { overwrite: true })
useQueryHooksFile.addStatements(`
// This is an auto-generated file. Do not edit manually, instead run the generate.bash`)
useQueryHooksFile.addImportDeclaration({
  namedImports: ["useQuery"],
  moduleSpecifier: `@tanstack/react-query`
})

useQueryHooksFile.addImportDeclaration({
  defaultImport: "axios",
  namedImports: ["AxiosResponse", "RawAxiosRequestConfig"],
  moduleSpecifier: "axios"
});

useQueryHooksFile.addImportDeclaration({
  namedImports: ["Configuration"],
  moduleSpecifier: `../generated/out/configuration.ts`
})

const generatedHookNames: string[] = []

const apiFactoryFunctions = generatedApisFile.getVariableDeclarations()
  .filter(v => v.isExported() && v.getName().endsWith("ControllerApiFactory"))

for (const apiFactory of apiFactoryFunctions) {
  useQueryHooksFile.addImportDeclaration({
    namedImports: [apiFactory.getName()],
    moduleSpecifier: `../generated/out/${apiFactory.getSourceFile().getBaseNameWithoutExtension()}.ts`
  })
  const api = apiFactory.getVariableStatement()
    ?.getDeclarationList()
    .getDeclarations()[0]
    .getInitializer()
    ?.getChildAtIndex(4)
    .getChildAtIndex(1)
    .getChildAtIndex(1)
    .getChildAtIndex(1)
    .getChildAtIndex(1)
    .getChildAtIndex(0)

  if (!api) {
    console.error("Could not find API name for", apiFactory.getText());
    continue;
  }

  const apiName = api.getChildAtIndex(1).getText()
  const hookName = `use${apiName[0].toUpperCase()}${apiName.slice(1)}`
  const returnInterface = api.getChildAtIndex(6).getChildAtIndex(2)
  generatedHookNames.push(hookName)

  const isPrimitive = ["string", "number", "boolean", "unknown", "any", "void", "null", "undefined"]
    .includes(returnInterface.getText().toLowerCase());


  if (!isPrimitive) {
    useQueryHooksFile.addImportDeclaration({
      namedImports: [returnInterface.getText()],
      moduleSpecifier: `../generated/out/${api.getSourceFile().getBaseNameWithoutExtension()}.ts`
    })
  }

  useQueryHooksFile.addFunction({
    name: hookName,
    isExported: true,
    parameters: [
      {
        name: "options",
        type: "RawAxiosRequestConfig",
        hasQuestionToken: true
      }
    ],
    returnType: `{data: ${returnInterface.getText()} | undefined, isLoading: boolean, isError: boolean}`,
    statements: `
const { data, isLoading, isError } = useQuery({
  queryKey: ['${apiName}', options?.params, options?.headers],
  queryFn: async () => {
    const api = ${apiFactory.getName()}(new Configuration({ basePath: \`\${import.meta.env.VITE_BACKEND_URL}\` }));
    const res: AxiosResponse<${returnInterface.getText()}> = await api.${apiName}({...options, withCredentials: true});
    return res.data;
  },
});
return { data, isLoading, isError };
    `
  })
}

const indexFile = project.createSourceFile("../generated/index.ts", ``, { overwrite: true })

// Add import for all hooks from the hooks file
indexFile.addImportDeclaration({
  namedImports: generatedHookNames,
  moduleSpecifier: "./use-query-hooks"
});

// Export all hooks
indexFile.addExportDeclaration({
  namedExports: generatedHookNames
});

indexFile.addExportDeclaration({
  moduleSpecifier: "./out/api.ts",
  isTypeOnly: true,
})
await project.save();