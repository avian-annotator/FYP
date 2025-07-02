# CustomErrorControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**handleError**](#handleerror) | **GET** /error | |

# **handleError**
> string handleError()


### Example

```typescript
import {
    CustomErrorControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomErrorControllerApi(configuration);

const { status, data } = await apiInstance.handleError();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

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

