import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MusicDetailsPage.css';
import Button from '../components/Button/Button';
import CardWrapper from '../components/Card/Card';
import Header from '../components/Header/Header';
import { getReviewsByMusic } from '../review/reviewAPI';
import StarRating from '../components/StarRating/StarRating';
import ReviewDetailModal from '../components/Modal/ReviewDetailModal';
import ReportModal from '../components/Modal/ReportModal';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import { createReport } from '../report/reportAPI';
import currentUser from '../currentUser';
import { deleteMusicById } from './musicAPI';
import { FaTrash } from 'react-icons/fa';

export default function MusicDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [music, setMusic] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState({ success: true, title: '', message: '' });

  useEffect(() => {
    async function fetchMusicDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/musics/${id}`);
        if (!res.ok) {
          throw new Error('Erro ao buscar detalhes da música.');
        }
        const data = await res.json();
        setMusic(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMusicDetails();
  }, [id]);

  useEffect(() => {
    if (music) {
      async function fetchReviews() {
        setReviewsLoading(true);
        try {
          const reviewsData = await getReviewsByMusic(music.title, music.artist);
          setReviews(reviewsData);
        } catch (err) {
          console.error("Erro ao buscar reviews:", err);
        } finally {
          setReviewsLoading(false);
        }
      }
      fetchReviews();
    }
  }, [music]);

  const handleOpenDetailModal = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReview(null);
  };

  const handleEditClick = (review) => {
    navigate(`/editar-review/${review._id}`, { state: { review } });
  };

  const handleOpenReportModal = () => {
    setIsDetailModalOpen(false);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReview(null);
  };

  const handleReportSubmit = async (motivo) => {
    if (!selectedReview) return;
    handleCloseReportModal();
    try {
      await createReport(selectedReview._id, motivo, currentUser._id);
      setConfirmationStatus({ success: true, title: 'Sucesso!', message: 'A sua denúncia foi enviada e será analisada pela nossa equipa.' });
    } catch (error) {
      setConfirmationStatus({ success: false, title: 'Erro!', message: 'Não foi possível enviar a sua denúncia.' });
    } finally {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleDeleteMusic = () => {
    setConfirmationStatus({
      isDeleteConfirmation: true,
      title: 'Confirmar Exclusão',
      message: 'Tem a certeza de que pretende excluir esta música e todas as suas reviews? Esta ação é irreversível.'
    });
    setIsConfirmationModalOpen(true);
  };

  const executeDelete = async () => {
    setIsConfirmationModalOpen(false);
    try {
      await deleteMusicById(id);
      setConfirmationStatus({
        success: true,
        title: 'Música Excluída',
        message: 'A música e todas as reviews associadas foram removidas com sucesso.'
      });
    } catch (err) {
      setConfirmationStatus({
        success: false,
        title: 'Erro na Exclusão',
        message: 'Não foi possível excluir a música. Por favor, tente novamente.'
      });
    } finally {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    if (confirmationStatus.success && confirmationStatus.title === 'Música Excluída') {
      navigate('/');
    }
  };

  if (loading) return <div className="loading-message">A carregar detalhes da música...</div>;
  if (error) return <div className="error-message">Erro: {error}</div>;
  if (!music) return <div className="not-found-message">Música não encontrada.</div>;

  return (
    <>
    <Header 
      onMenuClick={() => console.log("Abrir menu lateral")}
    />
    <div className="music-details">
      <CardWrapper className="music-header">
        {currentUser && currentUser.isAdmin && (
          <button className="delete-music-btn" onClick={handleDeleteMusic} title="Excluir Música Permanentemente">
            <FaTrash />
          </button>
        )}
        <img 
          src={music.cover} 
          alt={`Capa do álbum ${music.album}`} 
          className="cover-img" 
        />
        <div className="music-info">
          <h2>{music.title} - {music.artist}</h2>
          <p><strong>Álbum:</strong> {music.album}</p>
          <p><strong>Ano:</strong> {music.releaseYear}</p>
        </div>
      </CardWrapper>

      <div className="review-section">
        <Button
          className="review-btn"
          onClick={() => navigate('/criar-review', { state: { musica: music.title, artista: music.artist } })}
        >
          FAZER REVIEW
        </Button>
        <h3>Reviews dos Utilizadores:</h3>
        
        {reviewsLoading ? (
          <p className="loading-message">A carregar reviews...</p>
        ) : reviews.length > 0 ? (
          <ul className="reviews-list-container">
            {reviews.map(review => (
              <li key={review._id} className="review-card-item" onClick={() => handleOpenDetailModal(review)}>
                <span className="reviewer-name-list">{review.userId?.name || 'Utilizador Anónimo'}</span>
                <div className="review-card-right">
                  <StarRating rating={review.rating} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-review">Ainda não há reviews para esta música. Seja o primeiro!</p>
        )}
      </div>
    </div>

    <ReviewDetailModal
      isOpen={isDetailModalOpen}
      onClose={handleCloseDetailModal}
      review={selectedReview}
      onEdit={handleEditClick}
      onReport={handleOpenReportModal}
    />
    <ReportModal
      isOpen={isReportModalOpen}
      onClose={handleCloseReportModal}
      onSubmit={handleReportSubmit}
    />
    <ConfirmationModal
      isOpen={isConfirmationModalOpen}
      onClose={handleCloseConfirmationModal}
      onConfirm={executeDelete}
      title={confirmationStatus.title}
      message={confirmationStatus.message}
      success={confirmationStatus.success}
      isDeleteConfirmation={confirmationStatus.isDeleteConfirmation}
    />
    </>
  );
}
