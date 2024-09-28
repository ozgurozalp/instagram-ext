import React, { ReactNode } from "react";
import { User } from "@/src/types";
import { Button } from "@/pages/popup/components/index";
import openWindow from "@/pages/helpers/openWindow";
import { useMainStore } from "@/pages/popup/store";
import sendMessageFromPopup from "@/pages/helpers/sendMessageFromPopup";
import { TYPES } from "@/pages/constants";

interface ListProps {
  children: ReactNode;
  className?: string;
}

const openProfile = (userName: string) => {
  openWindow(`https://www.instagram.com/${userName}`);
};

export default function List({ children, ...props }: ListProps) {
  return <div {...props}>{children}</div>;
}

interface ListItemProps {
  user: User;
  className?: string;
}

export function ListItem({ user, className }: ListItemProps) {
  const { changeUserLoading, isInstagram } = useMainStore();
  const unFollow = async (user: User) => {
    changeUserLoading(user.id, true);
    await sendMessageFromPopup({
      type: TYPES.UNFOLLOW,
      user,
    });
  };

  return (
    <div className={className}>
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
          <span className="font-bold inline-block text-[13px]">
            {user.full_name}
            {user.isVerified && (
              <svg
                className="inline-block ml-1 -mt-0.5"
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
    </div>
  );
}
