import { ReactElement } from "react";
import UserProvider from "./user";
import NotificationProvider from "./notification";
import ThemeProvider from "./theme";
import ModalProvider from "./modal";

export default function Provider({ children }: { children: (ReactElement | null)[] | ReactElement | null }) {
  return (
      <UserProvider>
        <ThemeProvider>
          <NotificationProvider>
            <ModalProvider>
              <>{children}</>
            </ModalProvider>
          </NotificationProvider>
        </ThemeProvider>
      </UserProvider>
  )
}
