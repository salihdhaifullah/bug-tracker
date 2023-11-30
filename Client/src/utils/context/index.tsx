import { ReactElement } from "react";
import UserProvider from "./user";
import NotificationProvider from "./notification";
import ThemeProvider from "./theme";

export default function Provider({ children }: { children: ReactElement[] }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <NotificationProvider>
          <>{children}</>
        </NotificationProvider>
      </ThemeProvider>
    </UserProvider>
  )
}
