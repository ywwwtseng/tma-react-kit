import {
  type ReactNode,
  type PropsWithChildren,
  type ElementType,
  CSSProperties,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Layout,
  TabBar,
  Route,
  useNavigate,
  useRoute,
  ScreenType,
  type Tab,
} from '@ywwwtseng/react-kit';
import { useTMASDK } from '../store/TMASDKContext';
import { useTMAStore } from '../store/TMAStoreContext';
import { Status } from '../constants';
import { TabBarItem } from './TabBarItem';
import { Typography } from './Typography';

export interface TMALayoutProps extends PropsWithChildren {
  headerLeft?: ReactNode | ((route: Route) => ReactNode);
  headerRight?: ReactNode | ((route: Route) => ReactNode);
  backIcon?: ReactNode;
  backText?: string;
  tabs?: (Tab & { modal?: ElementType })[];
  headerHeight?: number;
  tabBarHeight?: number;
  styles?: {
    root?: CSSProperties;
    header?: CSSProperties;
    headerLeft?: CSSProperties;
    headerRight?: CSSProperties;
    main?: CSSProperties;
    tabBar?: CSSProperties;
    tabBarItem?: CSSProperties;
  };
}

export function TMALayout({
  headerLeft = (route: Route) =>
    route.type === ScreenType.PAGE ? (
      <Typography size="6" weight={500} i18n={route.title} />
    ) : undefined,
  headerRight,
  backIcon,
  backText = 'Back',
  tabs = [],
  headerHeight = 56,
  tabBarHeight = 60,
  styles = {},
  children,
}: TMALayoutProps) {
  const route = useRoute();
  const navigate = useNavigate();
  const { status } = useTMAStore();
  const { platform } = useTMASDK();
  const [modal, setModal] = useState<ReactNode | null>(null);
  const safeAreaBottom = platform === 'ios' ? 20 : 12;

  return (
    <Layout.Root style={styles?.root}>
      {createPortal(
        <Layout.Header
          style={{
            ...styles?.header,
            height: headerHeight,
          }}
        >
          <Layout.HeaderLeft style={styles?.headerLeft}>
            <div
              className="animate-fade-in"
              style={{
                display: route.type === ScreenType.PAGE ? 'block' : 'none',
              }}
            >
              {headerLeft
                ? typeof headerLeft === 'function'
                  ? headerLeft(route)
                  : headerLeft
                : null}
            </div>
            <button
              className="animate-fade-in"
              style={{
                display: route.type === ScreenType.DRAWER ? 'flex' : 'none',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
                background: 'none',
                border: 'none',
              }}
              onClick={() => navigate(-1)}
            >
              {backIcon && backIcon}
              <Typography size="2" i18n={backText} />
            </button>
          </Layout.HeaderLeft>
          {route.title && route.type !== ScreenType.PAGE && (
            <Layout.HeaderTitle>
              <Typography size="3" i18n={route.title} noWrap />
            </Layout.HeaderTitle>
          )}
          <Layout.HeaderRight style={styles?.headerRight}>
            {headerRight
              ? typeof headerRight === 'function'
                ? headerRight(route)
                : headerRight
              : null}
          </Layout.HeaderRight>
        </Layout.Header>,
        document.body
      )}
      <Layout.Main
        style={{
          ...styles?.main,
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight + safeAreaBottom,
        }}
      >
        {children}
      </Layout.Main>
      <TabBar
        style={{
          ...styles?.tabBar,
          height: tabBarHeight + safeAreaBottom,
        }}
        items={tabs}
        renderItem={(tab: Tab & { modal?: ElementType }) => (
          <TabBarItem
            key={tab.name}
            style={styles?.tabBarItem}
            icon={tab.icon}
            text={tab.title}
            isActive={tab.name === route.name}
            onClick={() => {
              if (tab.modal) {
                const Modal = tab.modal;
                setModal(<Modal open onClose={() => setModal(null)} />);
              } else {
                navigate(tab.name);
              }
            }}
          />
        )}
      />
      {modal}
    </Layout.Root>
  );
}
