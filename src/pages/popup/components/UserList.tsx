import React from "react";
import { Smiley, List, Button } from "@/pages/popup/components";
import { User } from "@/src/types";

interface Props {
  users: User[];
  openProfile: (username: string) => void;
  isInstagram: boolean;
  unFollow: (user: User) => void;
}

export default function UserList({
  users,
  openProfile,
  isInstagram,
  unFollow,
}: Props): JSX.Element {
  if (!users) return;

  if (users.length === 0) {
    return (
      <div className="w-full grid justify-items-center h-44 gap-2">
        <Smiley className="max-w-full w-28 h-28 aspect-square" />
        <p className="font-semibold text-lg text-center">
          <span className="text-2xl">Harika !!!</span>
          <br /> Seni geri takip etmeyen arkadaşın yok.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center text-sm mb-3">
        Seni geri takip etmeyen <strong>{users.length}</strong> kişi var
      </p>
      <List className="grid gap-3">
        {users.map((user) => (
          <List.Item
            className="border p-2 rounded shadow-md hover:scale-[1.01] transition-all ease-in-out"
            key={user.id}
          >
            <figure className="flex items-center gap-3">
              <img
                className="w-14 rounded-full drop-shadow-xl border"
                draggable="false"
                src={user.image}
                alt={user.username}
                crossOrigin="anonymous"
              />
              <figcaption
                className="grid cursor-pointer"
                onClick={() => openProfile(user.username)}
              >
                <span className="font-bold flex items-center gap-1 text-[13px]">
                  {user.full_name}
                  {user.isVerified && (
                    <svg
                      aria-label="Verified"
                      color="rgb(0, 149, 246)"
                      fill="rgb(0, 149, 246)"
                      height="1em"
                      role="img"
                      viewBox="0 0 40 40"
                      width="1em"
                    >
                      <title>Verified</title>
                      <path
                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                        fillRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-gray-600">{user.username}</span>
              </figcaption>

              {isInstagram && (
                <Button
                  loading={user.unFollowLoading}
                  onClick={() => unFollow(user)}
                  className="ml-auto text-xs whitespace-nowrap"
                >
                  Takipten Çık
                </Button>
              )}
            </figure>
          </List.Item>
        ))}
      </List>
    </div>
  );
}
