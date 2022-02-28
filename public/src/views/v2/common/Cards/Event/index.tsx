import moment from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { EventPost } from '../../../../../../../typescript/event';
import { ROUTES } from '../../../../../actions/goTo';
import { formatRoute } from '../../../../../utils/stringFormats';

const Container = styled.div`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 0.75rem;
  width: 100%;
  height: fit-content;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 0.5rem;
`;

const OrganizerName = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
`;

const ElapsedTime = styled.span`
  font-size: 0.75rem;
  color: #696969;
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: top;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem;
`;

const EventName = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const EventDescription = styled.p`
  font-size: 0.625rem;
`;

const ReadMore = styled.a`
  color: ${(props) => props.theme.primary.main};
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

interface Props {
  post: EventPost;
}

const EventCard: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { post } = props;

  const description = useMemo(
    () => post.quickDescription || post.description || '',
    [post.quickDescription, post.description]
  );

  return (
    <Container>
      <Header>
        <OrganizerName>{post.creator.name}</OrganizerName>
        <ElapsedTime>{moment(post.createdAt).fromNow()}</ElapsedTime>
      </Header>
      {post.photoUrl ? <Image src={post.photoUrl} /> : <></>}
      <Content>
        {post.name ? <EventName>{post.name}</EventName> : <></>}
        <EventDescription>{decodeURIComponent(description)}</EventDescription>
        <ReadMore href={formatRoute(ROUTES.entity, { id: post.eventId }, null)}>{t('home.read_more')}</ReadMore>
      </Content>
    </Container>
  );
};

export default EventCard;
