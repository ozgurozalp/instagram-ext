import { Options, User } from "@/src/types";
import { TYPES } from "@/pages/constants";
import { _sharedData } from "@/pages/content/content";

export let followers: User[] = [];
export let followings: User[] = [];

export async function init() {
  clearStorage();
  await getFollowers();
  await getFollowing();
  return getUnFollowers();
}

export async function unFollow(user) {
  const link = `https://www.instagram.com/web/friendships/${user.id}/unfollow/`;
  const response = await fetch(link, {
    headers: {
      accept: "*/*",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua":
        '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrftoken": _sharedData.config.csrf_token,
      "x-ig-app-id": "936619743392459",
      "x-ig-www-claim": "hmac.AR2gPuqOExWHghvGUOPSA7ZA7qbJKx93hiRQOsbe0Mkwo-dO",
      "x-instagram-ajax": "f08288f4f45b",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: `https://www.instagram.com/${user.username}/`,
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  const data = await response.json();
  return {
    status: data.status === "ok",
    deletedId: user.id,
  };
}

function setFollowers(_followers) {
  for (const { node } of _followers) {
    followers.push({
      username: node.username,
      full_name: node.full_name,
      image: node.profile_pic_url,
      id: node.id,
    });
  }
}
function setFollowings(_followings) {
  for (const { node } of _followings) {
    followings.push({
      username: node.username,
      full_name: node.full_name,
      image: node.profile_pic_url,
      id: node.id,
    });
  }
}
function getURL(data) {
  const url = new URL("https://www.instagram.com/graphql/query/");
  Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
  return url.toString();
}
async function getFollowers(options: Options = {}) {
  const urlParams = {
    query_hash: TYPES.FOLLOWERS_HASH,
    variables: JSON.stringify({
      id: _sharedData.config.viewerId,
      include_reel: true,
      fetch_mutual: true,
      first:
        _sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
          ?.edge_followed_by?.count ?? 100,
      ...(options.has_next_page && { after: options.end_cursor }),
    }),
  };

  const url = getURL(urlParams);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();

  setFollowers(data.user.edge_followed_by.edges);

  const { has_next_page, end_cursor } = data.user.edge_followed_by.page_info;

  if (has_next_page) {
    return await getFollowers({ has_next_page, end_cursor });
  }

  return Promise.resolve();
}
async function getFollowing(options: Options = {}) {
  const urlParams = {
    query_hash: TYPES.FOLLOWING_HASH,
    variables: JSON.stringify({
      id: _sharedData.config.viewerId,
      include_reel: true,
      fetch_mutual: false,
      first:
        _sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user
          ?.edge_followed_by?.count ?? 100,
      ...(options.has_next_page && { after: options.end_cursor }),
    }),
  };

  const url = getURL(urlParams);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
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
  return followings.filter(
    (following) =>
      !followers.find((follower) => follower.username === following.username)
  );
}
function clearStorage() {
  followers = [];
  followings = [];
}
