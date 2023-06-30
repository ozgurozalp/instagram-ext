export default async function onMessageFromContent(callback) {
  window.$connection.onMessage.addListener(callback);
}
