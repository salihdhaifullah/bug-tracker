import { ReactElement } from "react";
import UserProvider from "./user";
import NotificationProvider from "./notification";

export default function Provider({ children }: { children: ReactElement[] }) {
  return (
    <UserProvider>
      <NotificationProvider>
        <>{children}</>
      </NotificationProvider>
    </UserProvider>
  )
}
