import axios from "axios";

export async function getAllReviews({ setReviews }) {
  try {
    const allReviewsResponse = axios.get("http://localhost:4000/reviews");
    setReviews(allReviewsResponse.data);
    return;
  } catch (error) {
    alert("Ocorreu um erro na listagem de reviews");
    return;
  }
}
