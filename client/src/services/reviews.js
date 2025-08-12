import axios from "axios";

export async function getAllReviews() {
  try {
    const allReviewsResponse = axios.get("http://localhost:4000/reviews");
    return allReviewsResponse;
  } catch (error) {
    alert("Ocorreu um erro na listagem de reviews");
    return;
  }
}


export async function deleteReview(id, requesterId) {
  try {
    const deleteResponse = await axios.delete(
      `http://localhost:4000/reviews/${id}`,
      {
        data: { requesterId }, // envia requesterId no body
      }
    );
    return deleteResponse;
  } catch (error) {
    alert("Ocorreu um erro ao deletar a review");
    return;
  }
}
