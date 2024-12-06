import type { Options, User } from '.';
import { TYPES } from '.';

export class Instagram {
  sharedData: any;
  followings: User[] = [];

  constructor(sharedData: any) {
    this.sharedData = sharedData;
  }

  async getPeople() {
    this.clearStorage();
    await this.getFollowing();
    return this.getUnFollowers();
  }

  async unFollow(user: User) {
    const link = `https://www.instagram.com/web/friendships/${user.id}/unfollow/`;
    const response = await fetch(link, {
      headers: {
        'x-csrftoken': this.sharedData.config.csrf_token,
      },
      referrer: `https://www.instagram.com/${user.username}/`,
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const data = await response.json();
    return {
      status: data.status === 'ok',
      deletedId: user.id,
    };
  }

  async getFollowing(options: Options = {}): Promise<void> {
    const urlParams = {
      query_hash: TYPES.FOLLOWING_HASH,
      variables: JSON.stringify({
        id: this.sharedData.config.viewerId,
        include_reel: true,
        fetch_mutual: false,
        first: this.sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_followed_by?.count ?? 100,
        ...(options.has_next_page && { after: options.end_cursor }),
      }),
    };

    const url = getURL(urlParams);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { data } = await response.json();

    this.setFollowings(data.user.edge_follow.edges);

    const { has_next_page, end_cursor } = data.user.edge_follow.page_info;

    if (has_next_page) {
      return this.getFollowing({ has_next_page, end_cursor });
    }

    return Promise.resolve();
  }
  setFollowings(_followings: any[]) {
    for (const { node: following } of _followings) {
      this.followings.push({
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

  getUnFollowers() {
    return this.followings.filter(following => !following.isFollowingMe);
  }
  clearStorage() {
    this.followings = [];
  }
}

function getURL(data: any) {
  const url = new URL('https://www.instagram.com/graphql/query/');
  Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
  return url.toString();
}

export async function getSharedData() {
  if (!location.href.includes('instagram.com')) return;

  const res = await fetch('/data/shared_data/');
  return res.json();
}
