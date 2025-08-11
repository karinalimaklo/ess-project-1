import React from 'react';
import CardWrapper from '../Card/Card';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function ReviewCard({ review }) {
  return (
    <Card>
        <Typography component="legend">{review.musica}</Typography>
        <Rating name="read-only" value={review.nota} readOnly/>
        <br/>
        <br/>
        <Typography component="legend">{review.user}</Typography>
    </Card>
  );
}
