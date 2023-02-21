import React, { useEffect } from 'react';
import i18n from '../common/config/i18n';
import Button from '../components/Button';
import PageLayout from '../layouts/PageLayout';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router';
import Card from '../layouts/CardLayout';
import CardHeader from '../components/CardHeader';
import CardBody from '../components/CardBody';
import { useActivityCategoriesQuery } from '../services/activity-category/activity-categories.service';
import EmptyContent from '../components/EmptyContent';
import LoadingContent from '../components/LoadingContent';
import { useErrorToast } from '../hooks/useToast';
import { InternalErrors } from '../common/errors/internal-errors.class';
import ActivityButton from '../components/ActivityButton';

export enum CategoryStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface IActivityCategory {
  id: string;
  name: string;
  icon: string;
  role: string;
  department: string;
  branch: string;
  status: CategoryStatus;
}

const ActivityCategories = () => {
  const navigate = useNavigate();

  const {
    data: activityCategories,
    error: activityCategoriesError,
    isLoading: isActivityCategoriesLoading,
  } = useActivityCategoriesQuery();

  useEffect(() => {
    if (activityCategoriesError)
      useErrorToast(
        InternalErrors.ACTIVITY_CATEGORY_ERRORS.getError(
          activityCategoriesError.response?.data.code_error,
        ),
      );
  }, [activityCategoriesError]);

  const onAdd = () => {
    navigate('add');
  };

  const handleActivityClick = (id: string) => {
    navigate(`edit/${id}`);
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <h1>{i18n.t('side_menu:options.activity_categories')}</h1>
        <Button
          label={i18n.t('general:add', { item: i18n.t('general:category').toLowerCase() })}
          className="btn-primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={onAdd}
        />
      </div>
      {isActivityCategoriesLoading && <LoadingContent />}
      {activityCategories && !isActivityCategoriesLoading && (
        <Card>
          <CardHeader>
            <h2>{i18n.t('side_menu:options.activity_categories')}</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activityCategories.map((activity: IActivityCategory) => (
                <ActivityButton
                  key={activity.id}
                  id={activity.id}
                  status={activity.status}
                  icon={activity.icon}
                  name={activity.name}
                  onClick={handleActivityClick}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      )}
      {!activityCategories && !isActivityCategoriesLoading && (
        <EmptyContent description={i18n.t('general:error.load_entries')} />
      )}
    </PageLayout>
  );
};

export default ActivityCategories;