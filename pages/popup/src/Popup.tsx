import { captureException, withErrorBoundary, withSuspense } from '@extension/shared';
import { Button, cn, Toaster } from '@extension/ui';
import { Trans, useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';
import Loading from '@src/components/Loading';
import UserList from '@src/components/UserList';
import { useMainStore } from '@src/store';
import { TYPES } from '@src/constants';
import type { Request } from '@src/types';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import sendMessage from '@src/helpers/sendMessage';

function Popup() {
  const { t } = useTranslation();
  const { unfollowers, isInstagram, setUnfollowers, removeUnfollower, changeUserLoading } = useMainStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const port = chrome.runtime.connect();
    port.onMessage.addListener(callback);
    return () => {
      port.onMessage.removeListener(callback);
    };
  }, []);

  function callback(request: Request) {
    switch (request.type) {
      case TYPES.SET_PEOPLE: {
        setUnfollowers(request.users ?? []);
        setLoading(false);
        break;
      }
      case TYPES.UNFOLLOWED: {
        if (request.status && request.deletedId) removeUnfollower(request.deletedId);
        break;
      }
      case TYPES.ERROR: {
        if (request.deletedId) changeUserLoading(request.deletedId, false);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        break;
      }
    }
  }

  const getPeople = async () => {
    if (loading) return;

    if (!isInstagram) {
      chrome.tabs.create({ url: 'https://www.instagram.com/', active: true }).catch(console.error);
      return;
    }

    try {
      setLoading(true);
      await sendMessage({ type: TYPES.GET_PEOPLE });
    } catch (error: any) {
      toast.error(t('notConnected'), { position: 'top-center' });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid h-full content-center">
        <Loading className="justify-self-center" />
      </div>
    );
  }

  let buttonText = t('refresh');
  if (!unfollowers) {
    buttonText = t('showUnfollowers');
  }

  const showButtonIcon = isInstagram && unfollowers !== null;

  return (
    <>
      <div
        className={cn(
          'app grid h-full py-4',
          !showButtonIcon && 'items-center',
          Array.isArray(unfollowers) ? 'not-fist-time' : 'first-time',
        )}
      >
        <button
          onClick={() => {
            captureException(new Error('Görüceksin'));
            throw new Error('görmeyeceksin');
          }}
        >
          Break the world
        </button>
        {unfollowers === null && (
          <div className="mb-4 space-y-4 text-center">
            <p className="text-2xl">{t('firstTime')}</p>
            {isInstagram ? (
              <p className="text-balance text-lg">
                <Trans i18nKey="infoInInstagram" values={{ buttonText }} components={{ bold: <strong /> }} />
              </p>
            ) : (
              <p className="text-balance text-2xl">{t('infoNotInInstagram')}</p>
            )}
          </div>
        )}

        <Button className="h-10 min-h-10 w-full" variant="outline" disabled={loading} onClick={getPeople}>
          <RefreshCw className={cn('size-3', !showButtonIcon && 'hidden')} />
          {isInstagram ? buttonText : t('goToInstagram')}
        </Button>
        <UserList users={unfollowers} />
      </div>
      <Toaster richColors />
    </>
  );
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
