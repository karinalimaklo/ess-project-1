import "./App.css";
import { Routes, Route } from "react-router-dom";

// Componentes de Rota e Páginas de Status
import ProtectedRoute from './components/ProtectedRoute';
import SuspendedPage from './moderation/SuspendedPage';
import DeletedPage from './moderation/DeletedPage';

// Páginas Públicas e Protegidas
import Layout from './Pages/Layout';
import MainPage from './Pages/MainPage';
import MyProfilePage from './follow/MyProfilePage';
import VisitProfilePage from './follow/VisitProfilePage';
import FollowersPage from './follow/FollowersPage';
import FollowingPage from './follow/FollowingPage';
import NotificationsPage from './follow/NotificationsPage';

//Páginas de review
import CriarReview from "./review/createReviewPage";
import EditarReview from "./review/editReviewPage";

//Páginas de música
import MusicDetailsPage from "./music/MusicDetailsPage";
import CadastroPage from "./music/CadastroPage";
import EditarPage from "./music/EditarPage";

// Página de Admin
import ModerationPage from './moderation/ModerationPage';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas e de Status */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
      </Route>
      <Route path="/conta-suspensa" element={<SuspendedPage />} />
      <Route path="/conta-excluida" element={<DeletedPage />} />

      {/* Rotas Protegidas para user*/}
      <Route element={<ProtectedRoute />}>
        {/* Páginas de Perfil/Follow */}
        <Route path="/meu-perfil" element={<MyProfilePage />} />
        <Route path="/perfil/:id" element={<VisitProfilePage />} />
        <Route path="/seguidores/:userId" element={<FollowersPage />} />
        <Route path="/seguindo/:userId" element={<FollowingPage />} />
        <Route path="/notificacoes" element={<NotificationsPage />} />

        {/* Páginas de Review */}
        <Route path="/criar-review" element={<CriarReview />} />
        <Route path="/editar-review/:id" element={<EditarReview />} />

        {/* Páginas de Música */}
        <Route path="/details/:id" element={<MusicDetailsPage/>} />
        <Route path="cadastro" element={<CadastroPage />} />
        <Route path="editar-musica/:id" element={<EditarPage />} />
      </Route>

      {/* Rota Protegida Apenas para Administradores */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/moderation" element={<ModerationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
