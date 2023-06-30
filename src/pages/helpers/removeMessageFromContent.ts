export default function removeMessageFromContent(callback) {
  window.$connection.onMessage.removeListener(callback);
}
