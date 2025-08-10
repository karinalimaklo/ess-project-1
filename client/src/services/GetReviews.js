import axios from 'axios'

export async function getAllReviews(){
    try{
        const allReviewsResponse = axios.get('http://localhost:4000/reviews');
        return allReviewsResponse.data;
    } catch(error){
        alert("Ocorreu um erro na listagem de reviews");
        return;
    }
}