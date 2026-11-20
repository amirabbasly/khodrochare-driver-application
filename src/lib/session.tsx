"use client";

import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from 'react';
import {api, ApiError, clearSession, type User} from './api';
import {APP_ROLE} from './role';

type SessionState = {
  status: 'checking' | 'authenticated' | 'anonymous' | 'error';
  user: User | null;
  error: string;
};
type SessionContextValue = SessionState & {retry: () => void; authenticate: (user: User) => void};
const SessionContext = createContext<SessionContextValue | null>(null);
const checking: SessionState = {status:'checking',user:null,error:''};
const anonymous: SessionState = {status:'anonymous',user:null,error:''};

export function SessionProvider({children}: {children: ReactNode}) {
  const [state,setState] = useState<SessionState>(checking);
  const [attempt,setAttempt] = useState(0);
  const authenticate = useCallback((user: User) => {
    if (user.role === APP_ROLE && user.id) setState({status:'authenticated',user,error:''});
  }, []);
  const retry = useCallback(() => {setState(checking); setAttempt(value => value + 1);}, []);

  useEffect(() => {
    const unauthorized = () => setState(anonymous);
    const updated = (event: Event) => authenticate((event as CustomEvent<User>).detail);
    window.addEventListener('khodrochare:unauthorized',unauthorized);
    window.addEventListener('khodrochare:user',updated);
    return () => {
      window.removeEventListener('khodrochare:unauthorized',unauthorized);
      window.removeEventListener('khodrochare:user',updated);
    };
  }, [authenticate]);

  useEffect(() => {
    const controller = new AbortController();
    void api<User>('/me',{signal:controller.signal}).then(user => {
      if (controller.signal.aborted) return;
      if (user.role !== APP_ROLE || !user.id) throw new ApiError('Invalid account role',403);
      authenticate(user);
    }).catch(error => {
      if (controller.signal.aborted) return;
      if (error instanceof ApiError && [401,403].includes(error.status)) {
        clearSession(); setState(anonymous);
      } else {
        setState({status:'error',user:null,error:'بررسی ورود انجام نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.'});
      }
    });
    return () => controller.abort();
  }, [attempt,authenticate]);

  return <SessionContext.Provider value={{...state,retry,authenticate}}>{children}</SessionContext.Provider>;
}

export function useSessionState() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
}
