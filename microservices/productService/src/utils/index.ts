import { CUSTOMER_BASE_URL } from '@/config'
import axios from 'axios'

//Raise Events

/**
 * Publishes a customer event.
 * @param payload The payload of the event.
 * @returns A Promise that resolves when the event is published.
 */
export async function publishCustomerEvent(payload: any): Promise<void> {
  //   await axios.post("http://customer:8001/app-events/", {
  //     payload,
  //   });

  await axios({
    url: `${CUSTOMER_BASE_URL}/app-events`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: payload
  })
}

/**
 * Publishes a shopping event.
 * @param payload - The payload of the event.
 * @returns A promise that resolves when the event is published.
 */
// export async function publishShoppingEvent(payload: any): Promise<void> {
//   axios.post('http://shopping:8003/app-events/', {
//     payload,
//   });
// }
