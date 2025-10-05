# MeControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteMe**](#deleteme) | **DELETE** /api/me | |
|[**editMe**](#editme) | **PATCH** /api/me | |
|[**getMe**](#getme) | **GET** /api/me | |

# **deleteMe**
> deleteMe()


### Example

```typescript
import {
    MeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeControllerApi(configuration);

const { status, data } = await apiInstance.deleteMe();
```

### Parameters
This endpoint does not have any parameters.


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

# **editMe**
> UserResponseDTO editMe(editUserRequestBodyDTO)


### Example

```typescript
import {
    MeControllerApi,
    Configuration,
    EditUserRequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new MeControllerApi(configuration);

let editUserRequestBodyDTO: EditUserRequestBodyDTO; //

const { status, data } = await apiInstance.editMe(
    editUserRequestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **editUserRequestBodyDTO** | **EditUserRequestBodyDTO**|  | |


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

# **getMe**
> UserResponseDTO getMe()


### Example

```typescript
import {
    MeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeControllerApi(configuration);

const { status, data } = await apiInstance.getMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponseDTO**

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

