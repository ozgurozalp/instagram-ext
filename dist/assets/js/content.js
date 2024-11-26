import { T as TYPES } from "./constants.js";
let followings = [];
async function init() {
  clearStorage();
  await getFollowing();
  return getUnFollowers();
}
async function unFollow(user) {
  const link = `https://www.instagram.com/web/friendships/${user.id}/unfollow/`;
  const response = await fetch(link, {
    headers: {
      "x-csrftoken": _sharedData.config.csrf_token
    },
    referrer: `https://www.instagram.com/${user.username}/`,
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    mode: "cors",
    credentials: "include"
  });
  const data = await response.json();
  return {
    status: data.status === "ok",
    deletedId: user.id
  };
}
function setFollowings(_followings) {
  for (const { node: following } of _followings) {
    followings.push({
      username: following.username,
      full_name: following.full_name,
      image: following.profile_pic_url,
      isFollowingMe: following.follows_viewer,
      isPrivate: following.is_private,
      isVerified: following.is_verified,
      id: following.id
    });
  }
}
function getURL(data) {
  const url = new URL("https://www.instagram.com/graphql/query/");
  Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
  return url.toString();
}
async function getFollowing(options = {}) {
  var _a, _b, _c, _d, _e, _f, _g;
  const urlParams = {
    query_hash: TYPES.FOLLOWING_HASH,
    variables: JSON.stringify({
      id: _sharedData.config.viewerId,
      include_reel: true,
      fetch_mutual: false,
      first: (_g = (_f = (_e = (_d = (_c = (_b = (_a = _sharedData == null ? void 0 : _sharedData.entry_data) == null ? void 0 : _a.ProfilePage) == null ? void 0 : _b[0]) == null ? void 0 : _c.graphql) == null ? void 0 : _d.user) == null ? void 0 : _e.edge_followed_by) == null ? void 0 : _f.count) != null ? _g : 100,
      ...options.has_next_page && { after: options.end_cursor }
    })
  };
  const url = getURL(urlParams);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const { data } = await response.json();
  setFollowings(data.user.edge_follow.edges);
  const { has_next_page, end_cursor } = data.user.edge_follow.page_info;
  if (has_next_page) {
    return await getFollowing({ has_next_page, end_cursor });
  }
  return Promise.resolve();
}
function getUnFollowers() {
  return followings.filter((following) => !following.isFollowingMe);
}
function clearStorage() {
  followings = [];
}
async function getSharedData() {
  if (!location.href.includes("instagram.com"))
    return;
  const res = await fetch("/data/shared_data/");
  return res.json();
}
let _sharedData;
(async () => {
  _sharedData = await getSharedData();
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (request) => {
      switch (request.type) {
        case TYPES.GET_PEOPLE: {
          const users = await init();
          port.postMessage({
            users,
            type: TYPES.SET_PEOPLE
          });
          break;
        }
        case TYPES.UNFOLLOW: {
          const { status, deletedId } = await unFollow(request.user);
          port.postMessage({
            status,
            type: status ? TYPES.UNFOLLOWED : TYPES.ERROR,
            user: request.user,
            deletedId
          });
          break;
        }
        case TYPES.REDIRECT_TO_INSTAGRAM: {
          location.href = "https://www.instagram.com/";
          break;
        }
      }
    });
  });
})();
export {
  _sharedData
};
