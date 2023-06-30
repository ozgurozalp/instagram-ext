import { useEffect, useMemo, useState } from "react";
import { UserList, Loading, Button } from "@pages/popup/components";
import { useUpdateEffect } from "@pages/popup/hooks";
import { TYPES } from "@pages/constants";
import {
  removeMessageFromContent,
  sendMessageFromPopup,
  openWindow,
  onMessageFromContent,
} from "@pages/helpers";

export default function Popup() {
  const [loading, setLoading] = useState(true);
  const [isInstagram, setIsInstagram] = useState(false);
  const [users, setUsers] = useState(null);
  const notInstagramText = "Instagram'a git";

  const text = useMemo(() => {
    if (!users) return "Geri Takip Etmeyenleri Göster";
    else if (users.length === 0) return "Yeniden Kontrol Et";
    else return "Listeyi Yenile";
  }, [users]);

  useEffect(() => {
    sendMessageFromPopup({
      type: TYPES.CHECK_URL,
    });
    setUsers(localStorage.users ? JSON.parse(localStorage.users) : null);
    setLoading(false);

    onMessageFromContent(callback);

    return () => {
      removeMessageFromContent(callback);
    };
  }, []);

  function callback(request) {
    switch (request.type) {
      case TYPES.SET_PEOPLE: {
        setUsers(request.users);
        setLoading(false);
        break;
      }
      case TYPES.UNFOLLOWED: {
        if (request.status) {
          setUsers((prev) => {
            return prev.filter((user) => user.id !== request.deletedId);
          });
        }
        break;
      }
      case TYPES.ERROR: {
        setUsers((prev) => {
          return prev.map((user) => {
            if (user.id === request.deletedId) user.unFollowLoading = false;
            return user;
          });
        });
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        break;
      }
      case TYPES.IS_INSTAGRAM: {
        setIsInstagram(request.status);
      }
    }
  }

  useUpdateEffect(() => {
    localStorage.users = JSON.stringify(users);
  }, [users]);

  const getPeople = async () => {
    if (!isInstagram) {
      return sendMessageFromPopup({
        type: TYPES.REDIRECT_TO_INSTAGRAM,
      });
    }
    setLoading(true);
    await sendMessageFromPopup({
      type: TYPES.GET_PEOPLE,
    });
  };
  const unFollow = (user) => {
    const copyOfUsers = [...users];
    const currentUser = copyOfUsers.find((_user) => _user.id === user.id);
    currentUser.unFollowLoading = true;
    setUsers(copyOfUsers);
    sendMessageFromPopup({
      type: TYPES.UNFOLLOW,
      user,
    });
  };
  const openProfile = (userName) => {
    openWindow(`https://www.instagram.com/${userName}`);
  };

  if (loading) {
    return (
      <div className="h-full grid content-center">
        <Loading className="justify-self-center" />
      </div>
    );
  }
  return (
    <div className="h-full grid content-center pb-4">
      <div className="bg-white sticky top-0 z-10 pt-4 pb-3 px-4 -mx-4">
        <Button className="w-full" disabled={loading} onClick={getPeople}>
          {isInstagram ? text : notInstagramText}
        </Button>
      </div>
      <UserList
        users={users}
        isInstagram={isInstagram}
        openProfile={openProfile}
        unFollow={unFollow}
      />
    </div>
  );
}
