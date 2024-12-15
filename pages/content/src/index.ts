import { captureException, getSharedData, Instagram, TYPES } from '@extension/shared';
import { sendMessageToBackground } from '@src/lib/utils';

export const initSharedData = async () => {
  const sharedData = await getSharedData();
  if (!sharedData) return;

  const instagram = new Instagram(sharedData);

  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    sendResponse({ reply: 'ok' }); // Required to send response

    if (request.type === TYPES.GET_PEOPLE) {
      try {
        const users = await instagram.getPeople();
        sendMessageToBackground({
          users,
          type: TYPES.SET_PEOPLE,
        }).catch(console.error);
      } catch (error) {
        captureException(error as Error);
      }
    }

    if (request.type === TYPES.UNFOLLOW) {
      const { status, deletedId } = await instagram.unFollow(request.user);
      sendMessageToBackground({
        status,
        type: status ? TYPES.UNFOLLOWED : TYPES.ERROR,
        user: request.user,
        deletedId,
      }).catch(console.error);
    }
  });
};

initSharedData();
