export interface Options {
  has_next_page?: boolean;
  end_cursor?: string;
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  image: string;
  unFollowLoading?: boolean;
}
