import React, { useMemo, useState } from "react";
import { Smiley, List } from "@/pages/popup/components";
import { User } from "@/src/types";
import { ListItem } from "@/pages/popup/components/List";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  users: User[];
}

export default function UserList({ users }: Props): JSX.Element {
  const [onlyVerified, setOnlyVerified] = useState<boolean | undefined>(
    undefined
  );

  const filteredUsers = useMemo(() => {
    if (onlyVerified === undefined) return users;
    return users.filter((user) => user.isVerified === onlyVerified);
  }, [users, onlyVerified]);

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
        Seni geri takip etmeyen <strong>{filteredUsers.length}</strong> kişi var
      </p>
      <div className="flex justify-center mb-2 gap-x-1.5">
        <button
          className={`px-2 py-1 border rounded text-sm ${
            onlyVerified === undefined ? "ring ring-offset-1" : ""
          }`}
          onClick={() => setOnlyVerified(undefined)}
        >
          Tüm hesaplar
        </button>
        <button
          className={`px-2 py-1 border rounded text-sm ${
            onlyVerified === false ? "ring ring-offset-1" : ""
          }`}
          onClick={() => setOnlyVerified(false)}
        >
          Normal hesaplar
        </button>
        <button
          className={`px-2 py-1 border rounded text-sm ${
            onlyVerified === true ? "ring ring-offset-1" : ""
          }`}
          onClick={() => setOnlyVerified(true)}
        >
          Onaylı hesaplar
        </button>
      </div>
      <List className="grid">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ delay: (index < 10 ? index : 0) * 0.1 }}
              className="relative mb-2"
            >
              <ListItem
                user={user}
                className="border p-2 rounded shadow-md hover:scale-[1.01] transition-all ease-in-out"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </div>
  );
}
