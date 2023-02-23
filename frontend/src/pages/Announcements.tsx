import React from 'react';
import PageHeader from '../components/PageHeader';
import PageLayout from '../layouts/PageLayout';
import i18n from '../common/config/i18n';
import CardHeader from '../components/CardHeader';
import Card from '../layouts/CardLayout';
import CardBody from '../components/CardBody';
import Button from '../components/Button';
import { PlusIcon } from '@heroicons/react/24/solid';
import DataTableComponent from '../components/DataTableComponent';
import { IAnnouncement } from '../common/interfaces/announcement.interface';
import CellLayout from '../layouts/CellLayout';
import { TableColumn } from 'react-data-table-component';
import Popover from '../components/Popover';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AnnouncementStatus } from '../common/enums/announcement-status.enum';
import { formatDate } from '../common/utils/utils';

const AnnouncementTableHeader = [
  {
    id: 'name',
    name: i18n.t('announcement:header.name'),
    sortable: true,
    minWidth: '10rem',
    selector: (row: IAnnouncement) => row.name,
  },
  {
    id: 'status',
    name: i18n.t('announcement:header.status'),
    sortable: true,
    minWidth: '2rem',
    cell: (row: IAnnouncement) => (
      <CellLayout>
        <div className="flex flex-row gap-2">
          <span className="h-2 w-2 border-solid bg-green-500 rounded-full" />
          <p>{row.status}</p>
        </div>
      </CellLayout>
    ),
  },
  {
    id: 'updatedOn',
    name: i18n.t('announcement:header.updated_on'),
    sortable: true,
    minWidth: '5rem',
    selector: (row: IAnnouncement) => formatDate(row.updatedOn),
  },
  {
    id: 'publishedOn',
    name: i18n.t('announcement:header.published_on'),
    sortable: true,
    minWidth: '5rem',
    selector: (row: IAnnouncement) => formatDate(row.publishedOn),
  },
  {
    id: 'target',
    name: i18n.t('announcement:header.target'),
    sortable: true,
    minWidth: '10rem',
    cell: (row: IAnnouncement) => (
      <CellLayout>
        {row.targets
          ? row.targets.map((target) => (
              <p key={target.id}>
                {target.name} ({target.members})
              </p>
            ))
          : i18n.t('announcement:all_organization')}
      </CellLayout>
    ),
  },
];

const Announcements = () => {
  const buildAnnouncementActionColumn = (): TableColumn<IAnnouncement> => {
    const announcementMenuItems = [
      {
        label: i18n.t('announcement:publish'),
        icon: '',
        onClick: onPublish,
      },
      {
        label: i18n.t('general:edit', { item: '' }),
        icon: <PencilIcon className="menu-icon" />,
        onClick: onEdit,
      },
      {
        label: i18n.t('general:delete', { item: '' }),
        icon: <TrashIcon className="menu-icon" />,
        onClick: onDelete,
      },
    ];

    return {
      name: '',
      cell: (row: IAnnouncement) =>
        row.status === AnnouncementStatus.DRAFT && (
          <Popover<IAnnouncement> row={row} items={announcementMenuItems} />
        ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onAdd = () => {
    alert('Not yet implemented');
  };

  const onPublish = () => {
    alert('Not yet implemented');
  };

  const onEdit = () => {
    alert('Not yet implemented');
  };

  const onDelete = () => {
    alert('Not yet implemented');
  };

  return (
    <PageLayout>
      <PageHeader>{i18n.t('side_menu:options.announcements')}</PageHeader>
      <Card>
        <CardHeader>
          <h3>{i18n.t('announcements:title')}</h3>
          <Button
            icon={<PlusIcon className="h-5 w-5" />}
            className="btn-primary"
            label={i18n.t('general:add', { item: i18n.t('announcements:name') })}
            onClick={onAdd}
          />
        </CardHeader>
        <CardBody>
          <DataTableComponent<IAnnouncement>
            columns={[...AnnouncementTableHeader, buildAnnouncementActionColumn()]}
            pagination
          />
        </CardBody>
      </Card>
    </PageLayout>
  );
};

export default Announcements;