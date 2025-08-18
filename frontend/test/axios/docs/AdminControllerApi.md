# AdminControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createNewUser**](#createnewuser) | **POST** /api/admin/users | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/admin/users/{id} | |
|[**editUser**](#edituser) | **PATCH** /api/admin/users/{id} | |
|[**getAllUsers**](#getallusers) | **GET** /api/admin/users | |

# **createNewUser**
> UserResponseDTO createNewUser(createUserRequestBodyDTO)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    CreateUserRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let createUserRequestBodyDTO: CreateUserRequestBodyDTO; //

const { status, data } = await apiInstance.createNewUser(
    createUserRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserRequestBodyDTO** | **CreateUserRequestBodyDTO**|  | |


### Return type

**UserResponseDTO**

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

# **deleteUser**
> deleteUser()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **editUser**
> UserResponseDTO editUser(editUserRequestBodyDTO)


### Example

```typescript
import {
    AdminControllerApi,
    Configuration,
    EditUserRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

let id: number; // (default to undefined)
let editUserRequestBodyDTO: EditUserRequestBodyDTO; //

const { status, data } = await apiInstance.editUser(
    id,
    editUserRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editUserRequestBodyDTO** | **EditUserRequestBodyDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**UserResponseDTO**

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

# **getAllUsers**
> Array<UserResponseDTO> getAllUsers()


### Example

```typescript
import {
    AdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminControllerApi(configuration);

const { status, data } = await apiInstance.getAllUsers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UserResponseDTO>**

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

