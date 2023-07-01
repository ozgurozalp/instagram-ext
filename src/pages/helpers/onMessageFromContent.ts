import initTabSetup from "@/pages/helpers/initTabSetup";
let count = 0;

export default async function onMessageFromContent(callback) {
  try {
    window.$connection.onMessage.addListener(callback);
  } catch (e) {
    if (count > 5) throw new Error("Unable to add listener");
    await initTabSetup();
    await onMessageFromContent(callback);
    count++;
  }
}
