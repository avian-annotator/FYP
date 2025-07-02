# GreetingControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**hello**](#hello) | **GET** /greeting/hello | |

# **hello**
> string hello()


### Example

```typescript
import {
    GreetingControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GreetingControllerApi(configuration);

const { status, data } = await apiInstance.hello();
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

