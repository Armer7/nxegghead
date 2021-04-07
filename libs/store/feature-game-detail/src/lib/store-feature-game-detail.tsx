import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { formatRating } from '@nxegghead/store/util-formatters';
import { CardMedia } from '@material-ui/core';
import { Game } from '@nxegghead/api/util-interfaces';
type TParams = { id: string};


export interface StoreFeatureGameDetailProps
  extends RouteComponentProps<TParams> {styles: any}

export const StoreFeatureGameDetail = (props: StoreFeatureGameDetailProps) => {
  const [state, setState] = useState<{
    data: Game;
    loadingState: 'success' | 'error' | 'loading';
  }>({
    data: null,
    loadingState: 'success',
  });

  const {styles} = props;
  useEffect(() => {
    setState({
      ...state,
      loadingState: 'loading',
    });
    const gameId = props.match.params.id;

    fetch(`/api/games/${gameId}`)
      .then((x) => x.json())
      .then((res) => {
        setState({
          ...state,
          data: res,
          loadingState: 'success',
        });
      })
      .catch((err) => {
        setState({
          ...state,
          loadingState: 'error',
        });
      });
  }, [props.match.params.id]);
  return (
    <div className={styles.container}>
      {state.loadingState === 'loading' ? (
        'Loading...'
      ) : state.loadingState === 'error' ? (
        <div>Error fetching data</div>
      ) : state.data === null ? (
        ''
      ) : (
      <Card>
        <CardActionArea>
          <CardMedia
            className={styles.game_card_media}
            image={state.data.image}
            title={state.data.name}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {state.data.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={styles.game_rating}
            >
              <strong>Rating:</strong> {formatRating(state.data.rating)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
        )}
    </div>
  );
};

export default StoreFeatureGameDetail;
