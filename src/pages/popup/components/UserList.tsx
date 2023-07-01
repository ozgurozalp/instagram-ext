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
          <List.Item className="border p-2 rounded shadow-md" key={user.id}>
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
                <span className="font-bold text-[13px]">{user.full_name}</span>
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
