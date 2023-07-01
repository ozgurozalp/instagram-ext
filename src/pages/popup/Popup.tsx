import { useEffect, useMemo, useState } from "react";
import { UserList, Loading, Button } from "@pages/popup/components";
import { useMainStore } from "@pages/popup/store";
import { TYPES } from "@pages/constants";
import {
  removeMessageFromContent,
  sendMessageFromPopup,
  openWindow,
  onMessageFromContent,
} from "@pages/helpers";

export default function Popup() {
  const { unfollowers, setUnfollowers, removeUnfollower, changeUserLoading } =
    useMainStore();
  const [loading, setLoading] = useState(true);
  const [isInstagram, setIsInstagram] = useState(false);
  const notInstagramText = "Instagram'a git";

  const text = useMemo(() => {
    if (!unfollowers) return "Geri Takip Etmeyenleri Göster";
    else if (unfollowers.length === 0) return "Yeniden Kontrol Et";
    else return "Listeyi Yenile";
  }, [unfollowers]);

  useEffect(() => {
    sendMessageFromPopup({
      type: TYPES.CHECK_URL,
    });
    setLoading(false);
    onMessageFromContent(callback);
    return () => {
      removeMessageFromContent(callback);
    };
  }, []);

  function callback(request) {
    switch (request.type) {
      case TYPES.SET_PEOPLE: {
        setUnfollowers(request.users);
        setLoading(false);
        break;
      }
      case TYPES.UNFOLLOWED: {
        if (request.status) removeUnfollower(request.deletedId);
        break;
      }
      case TYPES.ERROR: {
        changeUserLoading(request.deletedId, false);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        break;
      }
      case TYPES.IS_INSTAGRAM: {
        setIsInstagram(request.status);
      }
    }
  }

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
    changeUserLoading(user.id, true);
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
      <div className="bg-white sticky top-0 z-10 pb-3 px-4 -mx-4">
        <Button className="w-full" disabled={loading} onClick={getPeople}>
          {isInstagram ? text : notInstagramText}
        </Button>
      </div>
      <UserList
        users={unfollowers}
        isInstagram={isInstagram}
        openProfile={openProfile}
        unFollow={unFollow}
      />
    </div>
  );
}
