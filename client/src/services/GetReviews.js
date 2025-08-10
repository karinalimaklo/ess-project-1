import axios from 'axios'

export async function getAllReviews(){
    const allReviewsResponse = axios.get('http://localhost:4000/reviews')
}