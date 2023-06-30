import { getSharedData } from "@pages/helpers";
import { TYPES } from "../constants";
import { instagram } from "@pages/services";

export let _sharedData;

(async () => {
  _sharedData = await getSharedData();

  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (request) => {
      switch (request.type) {
        case TYPES.GET_PEOPLE: {
          const users = await instagram.init();
          port.postMessage({
            users,
            type: TYPES.SET_PEOPLE,
          });
          break;
        }
        case TYPES.UNFOLLOW: {
          const { status, deletedId } = await instagram.unFollow(request.user);
          port.postMessage({
            status,
            type: status ? TYPES.UNFOLLOWED : TYPES.ERROR,
            user: request.user,
            deletedId,
          });
          break;
        }
        case TYPES.REDIRECT_TO_INSTAGRAM: {
          location.href = "https://www.instagram.com/";
          break;
        }
        case TYPES.CHECK_URL: {
          port.postMessage({
            status: location.href.startsWith("https://www.instagram.com"),
            type: TYPES.IS_INSTAGRAM,
          });
        }
      }
    });
  });
})();
