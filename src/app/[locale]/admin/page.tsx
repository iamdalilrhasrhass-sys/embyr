"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("reports");
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [ambassadorStats, setAmbassadorStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    Promise.all([
      fetch("/api/admin/reports").then(r => r.ok ? r.json() : []),
      fetch("/api/admin/users").then(r => r.ok ? r.json() : []),
      fetch("/api/admin/ambassadors").then(r => r.ok ? r.json() : [])
    ]).then(([reportsData, usersData, ambassadorsData]) => {
      setReports(reportsData);
      setUsers(usersData);
      setAmbassadors(ambassadorsData);
      const stats = { total: ambassadorsData.length, pending: 0, approved: 0, rejected: 0 };
      ambassadorsData.forEach((a: any) => {
        if (a.status === 'PENDING') stats.pending++;
        else if (a.status === 'APPROVED') stats.approved++;
        else if (a.status === 'REJECTED') stats.rejected++;
      });
      setAmbassadorStats(stats);
      setLoading(false);
    }).catch(() => {
      setError("Accès refusé. Vous devez être administrateur.");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleAction = async (action: string, targetId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir exécuter cette action ?")) return;
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId })
      });
      if (res.ok) {
        alert("Action exécutée avec succès.");
        fetchData();
      } else {
        alert("Erreur lors de l'action.");
      }
    } catch(err) {
      alert("Erreur réseau.");
    }
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-8 rounded-2xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Erreur 403</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/")} className="mt-6 bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20 text-white">Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      <div className="w-full md:w-1/4 glass-card p-4 rounded-3xl self-start md:sticky top-24">
        <h2 className="text-xl font-bold mb-6 px-4">Admin Embir</h2>
        <nav className="space-y-2">
          <button onClick={() => setTab("reports")} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${tab === 'reports' ? 'bg-[var(--color-premium-rose)] text-white' : 'hover:bg-white/5 text-gray-300'}`}>
            🚨 Signalements ({reports.filter(r => r.status === 'PENDING').length})
          </button>
          <button onClick={() => setTab("ambassadors")} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${tab === 'ambassadors' ? 'bg-[var(--color-premium-rose)] text-white' : 'hover:bg-white/5 text-gray-300'}`}>
             Ambassadrices ({ambassadorStats.pending})
          </button>
          <button onClick={() => setTab("users")} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${tab === 'users' ? 'bg-[var(--color-premium-rose)] text-white' : 'hover:bg-white/5 text-gray-300'}`}>
            👥 Utilisateurs ({users.length})
          </button>
          <button onClick={() => setTab("verifications")} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${tab === 'verifications' ? 'bg-[var(--color-premium-rose)] text-white' : 'hover:bg-white/5 text-gray-300'}`}>
            🛡️ Vérifications
          </button>
        </nav>
      </div>

      <div className="w-full md:w-3/4 glass-card p-8 rounded-3xl overflow-x-auto">
        {tab === "reports" && (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-gray-400 text-sm">Membres totaux</p>
              <h4 className="text-3xl font-bold">{users.length}</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-gray-400 text-sm">Premium Actifs</p>
              <h4 className="text-3xl font-bold text-[var(--color-premium-rose)]">{users.filter(u => u.profile?.isPremium).length}</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-gray-400 text-sm">Signalements</p>
              <h4 className="text-3xl font-bold text-yellow-400">{reports.filter(r => r.status === 'PENDING').length}</h4>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-gray-400 text-sm"> Ambassadrices</p>
              <h4 className="text-3xl font-bold text-[var(--color-premium-rose)]">{ambassadorStats.pending}</h4>
              <p className="text-xs text-gray-500 mt-1">{ambassadorStats.approved} approuvées</p>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6">Derniers Signalements</h3>
            {reports.length === 0 && <p className="text-gray-400">Aucun signalement.</p>}
            <div className="space-y-4">
               {reports.map((r: any) => (
                 <div key={r.id} className={`p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${r.status === 'DISMISSED' ? 'bg-white/5 opacity-50' : 'bg-red-500/10 border border-red-500/20'}`}>
                   <div>
                     <h4 className="font-bold text-red-400">Signalé: {r.reported?.profile?.username || r.reported?.email}</h4>
                     <p className="text-sm text-gray-400">Par: {r.reporter?.profile?.username || r.reporter?.email}</p>
                     <p className="text-sm mt-1">Motif: {r.reason}</p>
                     <p className="text-xs mt-1 text-gray-500">Statut: {r.status}</p>
                   </div>
                   {r.status === 'PENDING' && (
                     <div className="flex gap-2">
                       <button onClick={() => handleAction("dismiss_report", r.id)} className="bg-white/5 px-4 py-2 rounded-lg text-sm hover:bg-white/10">Ignorer</button>
                       <button onClick={() => handleAction("ban_user", r.reportedUserId)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">Bannir l'utilisateur</button>
                     </div>
                   )}
                 </div>
               ))}
            </div>
          </div>
        )}

        {tab === "pending" && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Modération d'identité</h3>
            <div className="text-gray-400">Aucun profil en attente de vérification pour le moment. L'upload des pièces d'identité est désactivé sur cette version.</div>
          </div>
        )}

        {tab === "users" && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Liste des membres</h3>
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Pseudo</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">{u.profile?.username || "-"}</td>
                    <td className="py-3">
                      {u.bannedAt ? <span className="text-red-500">Banni</span> : (u.role === 'ADMIN' ? <span className="text-[var(--color-premium-rose)]">Admin</span> : <span className="text-green-400">Actif</span>)}
                    </td>
                    <td className="py-3">
                      {!u.bannedAt && u.role !== 'ADMIN' && (
                        <button onClick={() => handleAction("ban_user", u.id)} className="text-red-400 text-sm hover:underline">Bannir</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "ambassadors" && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-4 rounded-2xl text-center">
                <p className="text-gray-400 text-xs">En attente</p>
                <h4 className="text-2xl font-bold text-yellow-400">{ambassadorStats.pending}</h4>
              </div>
              <div className="glass-card p-4 rounded-2xl text-center">
                <p className="text-gray-400 text-xs">Approuvées</p>
                <h4 className="text-2xl font-bold text-green-400">{ambassadorStats.approved}</h4>
              </div>
              <div className="glass-card p-4 rounded-2xl text-center">
                <p className="text-gray-400 text-xs">Rejetées</p>
                <h4 className="text-2xl font-bold text-red-400">{ambassadorStats.rejected}</h4>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6">Candidatures Ambassadrices</h3>
            {ambassadors.length === 0 && (
              <div className="text-gray-400 text-center py-12">
                <p className="text-5xl mb-4"></p>
                <p>Aucune candidature pour le moment.</p>
                <p className="text-sm mt-2 text-gray-500">Les candidatures apparaîtront ici quand des profils postuleront.</p>
              </div>
            )}
            <div className="space-y-4">
              {ambassadors.map((a: any) => (
                <div key={a.id} className={`p-5 rounded-2xl border ${a.status === 'PENDING' ? 'bg-yellow-500/5 border-yellow-500/30' : a.status === 'APPROVED' ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30 opacity-60'}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{a.name || a.email}</h4>
                      <p className="text-sm text-gray-400">{a.email} {a.instagram && `| @${a.instagram}`}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : a.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {a.status === 'PENDING' ? 'En attente' : a.status === 'APPROVED' ? 'Approuvée' : 'Rejetée'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                    {a.age && <span>🎂 {a.age} ans</span>}
                    {a.city && <span>📍 {a.city}{a.country ? `, ${a.country}` : ''}</span>}
                    {a.platform && <span>📱 {a.platform}</span>}
                    {a.followers && <span>👥 {a.followers} followers</span>}
                  </div>
                  {a.notes && <p className="text-sm text-gray-500 mb-3 border-l-2 border-white/10 pl-3 italic">{a.notes}</p>}
                  {a.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <button onClick={async () => {
                        if (!confirm(`Valider ${a.name || a.email} comme ambassadrice ? Cela créera un compte VIP.`)) return;
                        await fetch("/api/admin/ambassadors/action", {
                          method: "POST",
                          headers: {"Content-Type":"application/json"},
                          body: JSON.stringify({ action: "approve", ambassadorId: a.id })
                        });
                        fetchData();
                      }} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
                        ✅ Valider (créer VIP)
                      </button>
                      <button onClick={async () => {
                        const reason = prompt("Raison du rejet (optionnel) :");
                        await fetch("/api/admin/ambassadors/action", {
                          method: "POST",
                          headers: {"Content-Type":"application/json"},
                          body: JSON.stringify({ action: "reject", ambassadorId: a.id, reason })
                        });
                        fetchData();
                      }} className="bg-white/5 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20 text-red-400">
                        ❌ Rejeter
                      </button>
                    </div>
                  )}
                  {a.referralCode && (
                    <p className="text-xs text-gray-500 mt-2">🔗 Code parrainage : <code className="bg-white/10 px-2 py-0.5 rounded">{a.referralCode}</code></p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "verifications" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🛡️ Vérifications en attente</h2>
            {verifications.length === 0 ? (
              <p className="text-gray-400">Aucune vérification en attente.</p>
            ) : (
              <div className="space-y-4">
                {verifications.map((v: any) => (
                  <div key={v.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Code : {v.code}</p>
                      <p className="text-gray-400 text-sm">Envoyé le {new Date(v.submittedAt).toLocaleDateString("fr-FR")}</p>
                      {v.photoPath && <img src={v.photoPath} alt="Selfie de vérification" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">✅ Valider</button>
                      <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">❌ Rejeter</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
