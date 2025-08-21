function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* eslint-disable */
// @ts-nocheck
import { http, HttpResponse } from 'msw'
import users from './data/users.json'
import workspaces from './data/workspaces.json'

const images = Array.from({ length: 5 }, (_, i) => ({
  filename: `Image${i + 1}`,
  url: `https://picsum.photos/seed/${i + 1}/300/200`,
}))


// @ts-ignore
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const handlers = [


  //----------------------------------------------------------------------

  http.get('/api/workspaces/:workspaceId/images', () => {
    const mockResponse = {
      content: images,
      totalPages: 1,
      first: true,
      last: true,
      totalElements: images.length,
      number: 0,
      numberOfElements: images.length,
      size: 10,
    };
    
    return HttpResponse.json(mockResponse, { status: 200 });
  }),
  
]
