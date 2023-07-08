import { Options, User } from "@/src/types";
import { TYPES } from "@/pages/constants";
import { _sharedData } from "@/pages/content/content";

export let followings: User[] = [];

export async function init() {
  clearStorage();
  await getFollowing();
  return getUnFollowers();
}

export async function unFollow(user) {
  const link = `https://www.instagram.com/web/friendships/${user.id}/unfollow/`;
  const response = await fetch(link, {
    headers: {
      "x-csrftoken": _sharedData.config.csrf_token,
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

function setFollowings(_followings) {
  for (const { node: following } of _followings) {
    followings.push({
      username: following.username,
      full_name: following.full_name,
      image: following.profile_pic_url,
      isFollowingMe: following.follows_viewer,
      isPrivate: following.is_private,
      isVerified: following.is_verified,
      id: following.id,
    });
  }
}
function getURL(data) {
  const url = new URL("https://www.instagram.com/graphql/query/");
  Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
  return url.toString();
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
  return followings.filter((following) => !following.isFollowingMe);
}
function clearStorage() {
  followings = [];
}
