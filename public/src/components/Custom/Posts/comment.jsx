import React, { useContext, useState, useEffect } from 'react';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function PostComment(props) {
  const { isLiked, postId, entityId } = props;
  const {
    state: { userInfo },
  } = useContext(Store);

  const [liked, setLiked] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (liked === true) {
      const { status } = await api(
        formatRoute('/api/posts/like', null, {
          entityId: userInfo.primaryPerson.entity_id,
          postId,
        }),
        {
          method: 'DELETE',
        }
      );
      if (status) setLiked(!liked);
    } else {
      const { status } = await api('/api/posts/like', {
        method: 'POST',
        body: JSON.stringify({
          entityId: userInfo.primaryPerson.entity_id,
          postId,
        }),
      });
      if (status) setLiked(!liked);
    }
  };

  useEffect(() => {
    setLiked(isLiked === 1);
  }, []);

  return (
    <div>
      <div>
        <pre onClick={handleLike}>Like</pre> comment Share
      </div>
      <div>Espace commentaire</div>
    </div>
  );
}
