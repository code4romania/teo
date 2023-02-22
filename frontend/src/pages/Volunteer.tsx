import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import i18n from '../common/config/i18n';
import { InternalErrors } from '../common/errors/internal-errors.class';
import EmptyContent from '../components/EmptyContent';
import LoadingContent from '../components/LoadingContent';
import PageHeader from '../components/PageHeader';
import ProfileCard from '../components/ProfileCard';
import VolunteerProfile from '../components/VolunteerProfile';
import { useErrorToast } from '../hooks/useToast';
import PageLayout from '../layouts/PageLayout';
import { useVolunteerQuery } from '../services/volunteer/volunteer.service';

const Volunteer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: volunteer, isLoading, error } = useVolunteerQuery(id as string);

  useEffect(() => {
    if (error) {
      useErrorToast(InternalErrors.VOLUNTEER_ERRORS.getError(error?.response?.data.code_error));
    }
  }, [error]);

  const onBackButtonPress = () => {
    navigate('/volunteers', { replace: true });
  };

  return (
    <PageLayout>
      <PageHeader onBackButtonPress={onBackButtonPress}>{i18n.t('volunteer:title')}</PageHeader>
      {isLoading && <LoadingContent />}
      {volunteer && !isLoading && (
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <ProfileCard
              name={volunteer.name}
              age={volunteer.age}
              sex={volunteer.sex}
              location={`${volunteer.city}, jud ${volunteer.county}`}
              logo={volunteer.profilePicture}
            />
          </div>
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <VolunteerProfile
              email={volunteer.email}
              phone={volunteer.phone}
              branch={volunteer.branch}
              status={volunteer.status}
              department={volunteer.department}
              startedOn={volunteer.startedOn}
              role={volunteer.role}
              createdOn={volunteer.createdOn}
            />
          </div>
        </div>
      )}
      {!volunteer && !isLoading && (
        <EmptyContent description={i18n.t('general:error.load_entries')} />
      )}
    </PageLayout>
  );
};

export default Volunteer;
