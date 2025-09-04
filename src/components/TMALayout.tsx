import { type ReactElement } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Typography } from './Typography';
import { View } from '../types';

export interface TMALayoutProps {
  headerLeft: ReactElement;
  backIcon?: ReactElement;
  backText?: string;
  headerRight: ReactElement;
  views?: View[];
}

export function TMALayout({
  headerLeft,
  headerRight,
  backIcon,
  backText = 'Back',
  views = [],
}: TMALayoutProps) {
  const tabs = views.filter((view) => view.tab);
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = views.find((view) => view.path === location.pathname);

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.HeaderLeft>
          <div
            className="animation-fade-in"
            style={{
              display: !!currentView?.tab ? 'block' : 'none',
            }}
          >
            {headerLeft}
          </div>
          <button
            className="animation-fade-in"
            style={{
              display: !!currentView?.tab ? 'none' : 'flex',
              alignItems: 'center',
              gap: '8px',
              outline: 'none',
              background: 'none',
              border: 'none',
            }}
            onClick={() => navigate(-1)}
          >
            {backIcon && backIcon}
            <Typography size="4" i18n={backText} />
          </button>
        </Layout.HeaderLeft>
        <Layout.HeaderRight>
          {headerRight}
        </Layout.HeaderRight>
      </Layout.Header>
      <Layout.Main>
        <Routes>
          {views.map((view) => (
            view.path ? <Route key={view.path} path={view.path} element={view.element} /> : undefined
          ))}
        </Routes>
      </Layout.Main>
      <Layout.TabBar>
        {tabs.map(({ path, tab }) => (
          <NavLink key={tab!.text} to={path}>
            {({ isActive }) => (
              <Layout.TabBarItem
                key={tab!.text}
                icon={tab!.icon}
                text={tab!.text}
                isActive={isActive}
              />
            )}
          </NavLink>
          
        ))}
      </Layout.TabBar>
    </Layout.Root>
  );
}
