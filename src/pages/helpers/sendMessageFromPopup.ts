import { TYPES } from "@/pages/constants";
import initTabSetup from "@/pages/helpers/initTabSetup";

type Data = {
  type: TYPES;
} & Record<string, string | number>;

let count = 0;

export default async function sendMessageFromPopup(data: Data) {
  try {
    window.$connection.postMessage(data);
  } catch {
    if (count > 5) throw new Error("Unable to connect to tab");
    await initTabSetup();
    await sendMessageFromPopup(data);
    count++;
  }
}
