# WorkspaceControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addUserToWorkspace**](#addusertoworkspace) | **POST** /api/workspaces/{workspaceId}/users | |
|[**createWorkspace**](#createworkspace) | **POST** /api/workspaces | |
|[**deleteImage**](#deleteimage) | **DELETE** /api/workspaces/{workspaceId}/images/{imageId} | |
|[**deleteWorkspace**](#deleteworkspace) | **DELETE** /api/workspaces/{workspaceId} | |
|[**editImageDetails**](#editimagedetails) | **PATCH** /api/workspaces/{workspaceId}/images/{imageId} | |
|[**editWorkspace**](#editworkspace) | **PATCH** /api/workspaces/{workspaceId} | |
|[**generatePresignedDownloadUrlForImage**](#generatepresigneddownloadurlforimage) | **GET** /api/workspaces/{workspaceId}/images/{imageId} | |
|[**generatePresignedDownloadUrlForImages**](#generatepresigneddownloadurlforimages) | **GET** /api/workspaces/{workspaceId}/images | |
|[**generatePresignedUploadUrl**](#generatepresigneduploadurl) | **POST** /api/workspaces/{workspaceId}/images | |
|[**getUsersFromWorkspace**](#getusersfromworkspace) | **GET** /api/workspaces/{workspaceId}/users | |
|[**getWorkspaces**](#getworkspaces) | **GET** /api/workspaces | |
|[**removeUserFromWorkspace**](#removeuserfromworkspace) | **DELETE** /api/workspaces/{workspaceId}/users/{userId} | |

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

# **deleteImage**
> deleteImage()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let imageId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteImage(
    workspaceId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|
| **imageId** | [**string**] |  | defaults to undefined|


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

# **editImageDetails**
> EditImageDetailsResponseDTO editImageDetails(editImageRequestBodyDTO)


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    EditImageRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let imageId: string; // (default to undefined)
let editImageRequestBodyDTO: EditImageRequestBodyDTO; //

const { status, data } = await apiInstance.editImageDetails(
    workspaceId,
    imageId,
    editImageRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editImageRequestBodyDTO** | **EditImageRequestBodyDTO**|  | |
| **workspaceId** | [**number**] |  | defaults to undefined|
| **imageId** | [**string**] |  | defaults to undefined|


### Return type

**EditImageDetailsResponseDTO**

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

# **generatePresignedDownloadUrlForImage**
> ImageResponseDTO generatePresignedDownloadUrlForImage()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    AnnotationRequestParamDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let imageId: string; // (default to undefined)
let requestParam: AnnotationRequestParamDTO; // (default to undefined)

const { status, data } = await apiInstance.generatePresignedDownloadUrlForImage(
    workspaceId,
    imageId,
    requestParam
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|
| **imageId** | [**string**] |  | defaults to undefined|
| **requestParam** | **AnnotationRequestParamDTO** |  | defaults to undefined|


### Return type

**ImageResponseDTO**

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

# **generatePresignedDownloadUrlForImages**
> PageWrapperImageResponseDTO generatePresignedDownloadUrlForImages()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    AnnotationRequestParamDTO,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let requestParam: AnnotationRequestParamDTO; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.generatePresignedDownloadUrlForImages(
    workspaceId,
    requestParam,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|
| **requestParam** | **AnnotationRequestParamDTO** |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageWrapperImageResponseDTO**

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

# **generatePresignedUploadUrl**
> generatePresignedUploadUrl(createImageRequestBodyDTO)


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    CreateImageRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let createImageRequestBodyDTO: CreateImageRequestBodyDTO; //

const { status, data } = await apiInstance.generatePresignedUploadUrl(
    workspaceId,
    createImageRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createImageRequestBodyDTO** | **CreateImageRequestBodyDTO**|  | |
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

# **getUsersFromWorkspace**
> PageWrapperUserResponseDTO getUsersFromWorkspace()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration,
    GetUsersFromWorkspaceRequestParamDTO,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let param: GetUsersFromWorkspaceRequestParamDTO; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getUsersFromWorkspace(
    workspaceId,
    param,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|
| **param** | **GetUsersFromWorkspaceRequestParamDTO** |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**PageWrapperUserResponseDTO**

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

# **getWorkspaces**
> PageWrapperAccessibleWorkspaceResponseDTO getWorkspaces()


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

**PageWrapperAccessibleWorkspaceResponseDTO**

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

# **removeUserFromWorkspace**
> removeUserFromWorkspace()


### Example

```typescript
import {
    WorkspaceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WorkspaceControllerApi(configuration);

let workspaceId: number; // (default to undefined)
let userId: number; // (default to undefined)

const { status, data } = await apiInstance.removeUserFromWorkspace(
    workspaceId,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workspaceId** | [**number**] |  | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|


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

