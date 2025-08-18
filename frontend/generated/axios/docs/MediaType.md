# MediaType


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [optional] [default to undefined]
**subtype** | **string** |  | [optional] [default to undefined]
**parameters** | **{ [key: string]: string; }** |  | [optional] [default to undefined]
**qualityValue** | **number** |  | [optional] [default to undefined]
**wildcardType** | **boolean** |  | [optional] [default to undefined]
**wildcardSubtype** | **boolean** |  | [optional] [default to undefined]
**subtypeSuffix** | **string** |  | [optional] [default to undefined]
**charset** | **string** |  | [optional] [default to undefined]
**concrete** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { MediaType } from './api';

const instance: MediaType = {
    type,
    subtype,
    parameters,
    qualityValue,
    wildcardType,
    wildcardSubtype,
    subtypeSuffix,
    charset,
    concrete,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
