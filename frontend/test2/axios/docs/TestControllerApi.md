# TestControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getTest**](#gettest) | **GET** /test/{test}/b/{testNumb} | |
|[**postTest**](#posttest) | **POST** /test/{test}/b/{testNumb} | |

# **getTest**
> string getTest()


### Example

```typescript
import {
    TestControllerApi,
    Configuration,
    RequestParamDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new TestControllerApi(configuration);

let test: string; // (default to undefined)
let testNumb: number; // (default to undefined)
let testParam: string; // (default to undefined)
let requestParamDTO: RequestParamDTO; // (default to undefined)

const { status, data } = await apiInstance.getTest(
    test,
    testNumb,
    testParam,
    requestParamDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **test** | [**string**] |  | defaults to undefined|
| **testNumb** | [**number**] |  | defaults to undefined|
| **testParam** | [**string**] |  | defaults to undefined|
| **requestParamDTO** | **RequestParamDTO** |  | defaults to undefined|


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

# **postTest**
> string postTest(requestBodyDTO)


### Example

```typescript
import {
    TestControllerApi,
    Configuration,
    RequestParamDTO,
    RequestBodyDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new TestControllerApi(configuration);

let test: string; // (default to undefined)
let testNumb: number; // (default to undefined)
let testParam: string; // (default to undefined)
let requestParamDTO: RequestParamDTO; // (default to undefined)
let requestBodyDTO: RequestBodyDTO; //

const { status, data } = await apiInstance.postTest(
    test,
    testNumb,
    testParam,
    requestParamDTO,
    requestBodyDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBodyDTO** | **RequestBodyDTO**|  | |
| **test** | [**string**] |  | defaults to undefined|
| **testNumb** | [**number**] |  | defaults to undefined|
| **testParam** | [**string**] |  | defaults to undefined|
| **requestParamDTO** | **RequestParamDTO** |  | defaults to undefined|


### Return type

**string**

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

