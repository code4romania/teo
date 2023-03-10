import React from 'react';
import { IChildRoute, IRoute } from '../common/interfaces/route.interface';
import MenuLink from './MenuLink';
import { classNames } from '../common/utils/utils';

interface MenuItemProps {
  item: IRoute;
  activeParentRoute: IRoute;
  activeSubRoute?: IChildRoute | null;
  isNarrow?: boolean;
  onClick: (item: IRoute, childRoute?: IChildRoute) => void;
}

const MenuItem = ({
  item,
  activeParentRoute,
  activeSubRoute,
  isNarrow,
  onClick,
}: MenuItemProps) => {
  const onChildRouteClick = (childRoute: IRoute) => {
    onClick(item, childRoute);
  };

  return item.childRoutes ? (
    <div
      className={classNames(
        item.id === activeParentRoute.id && !isNarrow ? 'pb-4' : '',
        'flex flex-col gap-2',
      )}
    >
      <MenuLink
        item={item}
        active={item.id === activeParentRoute.id}
        isNarrow={isNarrow}
        onClick={onClick}
      />
      {item.id === activeParentRoute.id &&
        !isNarrow &&
        item.childRoutes.map((childRoute) => (
          <MenuLink
            key={childRoute.id}
            item={childRoute}
            active={childRoute.id === activeSubRoute?.id}
            isNarrow={isNarrow}
            onClick={onChildRouteClick}
          />
        ))}
    </div>
  ) : (
    <MenuLink
      item={item}
      active={item.id === activeParentRoute.id}
      isNarrow={isNarrow}
      onClick={onClick}
    />
  );
};

export default MenuItem;
