import React, {useEffect, useState} from 'react';
import styles from './app.module.scss';
import { Header } from '@nxegghead/store/ui-shared';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { formatRating } from '@nxegghead/store/util-formatters';
import { Route, useHistory } from 'react-router-dom';
import { StoreFeatureGameDetail } from '@nxegghead/store/feature-game-detail';
import { Game } from '@nxegghead/api/util-interfaces';

export function App() {
  const history = useHistory();
  const [state, setState] = useState<{
    data: Game[];
    loadingState: 'success' | 'error' | 'loading';
  }>({
    data: [],
    loadingState: 'success',
  });
  useEffect(() => {
    setState({
      ...state,
      loadingState: 'loading',
    });
    fetch('/api/games')
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
  }, []);
  return (
    <>
      <Header title='Board Game Hoard'/>
      <div className={styles.container} data-testid='app-container'>
        <div className={styles.games_layout}>

          {state.loadingState === 'loading'
            ? 'loading...'
            : state.loadingState === 'error'
            ? '<div>Error retrieving data<div>'
              : state.data.map((x) => (
            <Card key={x.id} className={styles.game_card}
            onClick={() => history.push(`/game/${x.id}`)}
            >
              <CardActionArea>
                <CardMedia
                  className={styles.game_card_media}
                  image={x.image}
                  title={x.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {x.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {x.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={styles.game_rating}
                  >
                    <strong>Rating:</strong> {formatRating(x.rating)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </div>

      <Route path="/game/:id" render={(routeProps) =>{
        const proper= {...routeProps, styles: styles};
        return <StoreFeatureGameDetail  {...proper}/>
      }} />
    </>
  );
}

export default App;
