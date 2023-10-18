import { useEffect, useState } from "react";
import { UserList, Loading, Button } from "@/pages/popup/components";
import { useMainStore } from "@/pages/popup/store";
import { TYPES } from "@/pages/constants";
import sendMessageFromPopup from "@/pages/helpers/sendMessageFromPopup";
import onMessageFromContent from "@/pages/helpers/onMessageFromContent";
import removeMessageFromContent from "@/pages/helpers/removeMessageFromContent";
import { Request } from "@/src/types";

export default function Popup() {
  const {
    unfollowers,
    isInstagram,
    setUnfollowers,
    removeUnfollower,
    changeUserLoading,
    btnText,
    noInstagramText,
  } = useMainStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onMessageFromContent(callback).catch(console.error);
    return () => {
      removeMessageFromContent(callback);
    };
  }, []);

  function callback(request: Request) {
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
    }
  }

  const getPeople = async () => {
    if (!isInstagram) {
      return sendMessageFromPopup({
        type: TYPES.REDIRECT_TO_INSTAGRAM,
      });
    }
    setLoading(true);
    sendMessageFromPopup({
      type: TYPES.GET_PEOPLE,
    }).catch(console.error);
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
      <div className="bg-white sticky top-0 pt-4 z-10 pb-3 px-4 -mx-4">
        <Button className="w-full" disabled={loading} onClick={getPeople}>
          {isInstagram ? btnText() : noInstagramText}
        </Button>
      </div>
      <UserList users={unfollowers} />
    </div>
  );
}
