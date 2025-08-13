# WorkspaceControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addUserToWorkspace**](#addusertoworkspace) | **POST** /api/workspaces/{workspaceId}/users | |
|[**createWorkspace**](#createworkspace) | **POST** /api/workspaces | |
|[**deleteWorkspace**](#deleteworkspace) | **DELETE** /api/workspaces/{workspaceId} | |
|[**editWorkspace**](#editworkspace) | **PATCH** /api/workspaces/{workspaceId} | |
|[**getWorkspaces**](#getworkspaces) | **GET** /api/workspaces | |

# **addUserToWorkspace**
> addUserToWorkspace(addUserToWorkspaceRequestBodyDTO)


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    AddUserToWorkspaceRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let addUserToWorkspaceRequestBodyDTO: AddUserToWorkspaceRequestBodyDTO; //

const { status, data } = await apiInstance.addUserToWorkspace(
    workspaceId,
    addUserToWorkspaceRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addUserToWorkspaceRequestBodyDTO** | **AddUserToWorkspaceRequestBodyDTO**|  | |
| **workspaceId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createWorkspace**
> WorkspaceResponseDTO createWorkspace(createWorkspaceRequestBodyDTO)


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    CreateWorkspaceRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let createWorkspaceRequestBodyDTO: CreateWorkspaceRequestBodyDTO; //

const { status, data } = await apiInstance.createWorkspace(
    createWorkspaceRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createWorkspaceRequestBodyDTO** | **CreateWorkspaceRequestBodyDTO**|  | |


### Return type

**WorkspaceResponseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteWorkspace**
> deleteWorkspace()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteWorkspace(
    workspaceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **editWorkspace**
> WorkspaceResponseDTO editWorkspace(editWorkspaceRequestBodyDTO)


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    EditWorkspaceRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let editWorkspaceRequestBodyDTO: EditWorkspaceRequestBodyDTO; //

const { status, data } = await apiInstance.editWorkspace(
    workspaceId,
    editWorkspaceRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editWorkspaceRequestBodyDTO** | **EditWorkspaceRequestBodyDTO**|  | |
| **workspaceId** | [**number**] |  | defaults to undefined|


### Return type

**WorkspaceResponseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getWorkspaces**
> PageAccessibleWorkspaceResponseDTO getWorkspaces()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getWorkspaces(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageAccessibleWorkspaceResponseDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

