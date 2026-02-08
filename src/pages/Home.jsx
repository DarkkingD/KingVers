import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import StoryCard from '../components/StoryCard.jsx';
import GroupCard from '../components/GroupCard.jsx';

const Home = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    api.get('/stories?limit=6').then((res) => setStories(res.data.stories || []));
    api.get('/groups').then((res) => setGroups((res.data.groups || []).slice(0, 6)));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/recommendations?limit=6').then((res) => setRecommendations(res.data.recommendations || []));
  }, [user]);

  return (
    <div className="space-y-12">
      <section className="card overflow-hidden p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/60">KingVerse</p>
            <h1 className="mt-3 text-4xl text-dusk">La plateforme ou les fanfictions deviennent des univers vivants.</h1>
            <p className="mt-3 text-sm text-ink/70">
              Ecris, lis, commente et rejoins des communautes. Un moteur intelligent te propose des histoires
              basees sur tes genres preferes et tes auteurs suivis.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link to="/feed" className="rounded-full bg-ink px-5 py-2 text-sm text-white">
                    Ouvrir le feed
                  </Link>
                  <Link to="/create" className="rounded-full border border-dusk/20 px-5 py-2 text-sm">
                    Ecrire une histoire
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="rounded-full bg-ink px-5 py-2 text-sm text-white">
                    Creer un compte
                  </Link>
                  <Link to="/login" className="rounded-full border border-dusk/20 px-5 py-2 text-sm">
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            <StatCard label="Fanfictions" value="1.2k" />
            <StatCard label="Communautes" value="320" />
            <StatCard label="Lecteurs actifs" value="8.4k" />
          </div>
        </div>
      </section>

      {user && recommendations.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            title="Recommandations personnalisees"
            subtitle="Basees sur tes lectures, tes likes et tes tags favoris."
            action={
              <Link to="/feed" className="text-sm text-ember">
                Voir le feed
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <StoryCard key={rec.story._id} story={rec.story} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeader
          title="Histoires tendance"
          subtitle="Les fanfictions qui montent cette semaine."
          action={
            <Link to="/stories" className="text-sm text-ember">
              Explorer
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Communautes actives"
          subtitle="Rejoins des groupes et lance des discussions en direct."
          action={
            <Link to="/groups" className="text-sm text-ember">
              Voir les groupes
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      </section>

      <section className="card p-6">
        <SectionHeader
          title="Comment ca marche"
          subtitle="Tout ce qu'il faut pour une experience complete."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-dusk/10 bg-white/70 p-4">
            <h3 className="text-lg text-dusk">Ecris</h3>
            <p className="text-sm text-ink/70">Publie des chapitres, ajoute des tags et une couverture.</p>
          </div>
          <div className="rounded-2xl border border-dusk/10 bg-white/70 p-4">
            <h3 className="text-lg text-dusk">Lis</h3>
            <p className="text-sm text-ink/70">Decouvre des histoires recommandees et sauvegarde tes coups de coeur.</p>
          </div>
          <div className="rounded-2xl border border-dusk/10 bg-white/70 p-4">
            <h3 className="text-lg text-dusk">Partage</h3>
            <p className="text-sm text-ink/70">Rejoins des groupes, commente et discute en temps reel.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
