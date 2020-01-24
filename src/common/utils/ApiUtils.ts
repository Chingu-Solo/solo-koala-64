export async function get<T>(url: string): Promise<T | never> {
  const response: Response = await fetch(url);
  try {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (ex) {}
  return await response.json();




//export interface HttpResponse<T> extends Response {
//  parsedBody?: T;
//}
//
//export async function get<T>(
//  url: RequestInfo
//): Promise<HttpResponse<T>> {
//  const response: HttpResponse<T> = await fetch(
//    url
//  );
//
//  try {
//    // may error if there is no body
//    response.parsedBody = await response.json();
//  } catch (ex) {}
//  
//  try {
//    if (!response.ok) {
//      throw new Error(response.statusText);
//    }
//  } catch (ex) {}
//  return response;
//}
