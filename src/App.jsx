import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Feed from './pages/Feed.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StoryList from './pages/StoryList.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import StoryCreate from './pages/StoryCreate.jsx';
import Profile from './pages/Profile.jsx';
import Groups from './pages/Groups.jsx';
import Chat from './pages/Chat.jsx';
import Search from './pages/Search.jsx';
import Admin from './pages/Admin.jsx';
import GoogleCallback from './pages/GoogleCallback.jsx';
import { useAuth } from './context/AuthContext.jsx';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Protected><Feed /></Protected>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/google" element={<GoogleCallback />} />
      <Route path="/stories" element={<StoryList />} />
      <Route path="/stories/:id" element={<StoryDetail />} />
      <Route path="/create" element={<Protected><StoryCreate /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/groups" element={<Protected><Groups /></Protected>} />
      <Route path="/chat" element={<Protected><Chat /></Protected>} />
      <Route path="/search" element={<Search />} />
      <Route path="/admin" element={<Protected><Admin /></Protected>} />
    </Routes>
  </Layout>
);

export default App;
