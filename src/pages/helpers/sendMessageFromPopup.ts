import { TYPES } from "@pages/constants";

export default async function sendMessageFromPopup(
  data: {
    type?: keyof typeof TYPES;
  } = {}
) {
  window.$connection.postMessage(data);
}
