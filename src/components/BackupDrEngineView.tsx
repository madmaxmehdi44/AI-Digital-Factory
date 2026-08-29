import React, { useState } from "react";
import {
  RotateCcw,
  HardDrive,
  Cloud,
  ShieldCheck,
  Play,
  Copy,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  Archive,
  RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";
import { FleetSite } from "../types";

interface BackupDrEngineViewProps {
  fleet: FleetSite[];
}

export const BackupDrEngineView: React.FC<BackupDrEngineViewProps> = ({ fleet }) => {
  const [selectedSite, setSelectedSite] = useState<string>(fleet[0]?.domain || "velocehealth.org");
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const [snapshots, setSnapshots] = useState([
    {
      id: "snap_prod_091",
      siteDomain: "velocehealth.org",
      type: "FULL",
      timestamp: "Today, 04:00 AM UTC",
      sizeMb: 142.4,
      mysqlRows: 4820,
      storageLocation: "AWS S3 eu-central-1 (AES-256)",
      integrityStatus: "VERIFIED_CLEAN",
      isImmutable: true
    },
    {
      id: "snap_pre_update_090",
      siteDomain: "velocehealth.org",
      type: "DATABASE_ONLY",
      timestamp: "Yesterday, 18:30 UTC",
      sizeMb: 12.8,
      mysqlRows: 4810,
      storageLocation: "Google Cloud Storage (GCS)",
      integrityStatus: "VERIFIED_CLEAN",
      isImmutable: true
    },
    {
      id: "snap_auto_089",
      siteDomain: "velocehealth.org",
      type: "FULL",
      timestamp: "3 days ago",
      sizeMb: 139.1,
      mysqlRows: 4790,
      storageLocation: "Immutable Glacier Vault",
      integrityStatus: "VERIFIED_CLEAN",
      isImmutable: true
    }
  ]);

  const handleCreateNewSnapshot = async () => {
    setIsCreatingSnapshot(true);
    setBannerNotice("Initiating live point-in-time snapshot with atomic database freeze...");

    await new Promise(r => setTimeout(r, 1200));

    const created = {
      id: `snap_manual_${Date.now()}`,
      siteDomain: selectedSite,
      type: "FULL",
      timestamp: "Just now",
      sizeMb: 144.2,
      mysqlRows: 4832,
      storageLocation: "Google Cloud Storage & Cloudflare R2",
      integrityStatus: "VERIFIED_CLEAN",
      isImmutable: true
    };

    setSnapshots(prev => [created, ...prev]);
    setIsCreatingSnapshot(false);
    setBannerNotice(`✓ Snapshot '${created.id}' created and verified across multi-cloud storage.`);
    confetti({ particleCount: 80, spread: 60 });
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleRestoreSnapshot = async (snapId: string) => {
    setIsRestoring(true);
    setBannerNotice(`Restoring instance '${selectedSite}' from snapshot ${snapId}...`);

    await new Promise(r => setTimeout(r, 1500));

    setIsRestoring(false);
    setBannerNotice(`✓ Instance '${selectedSite}' restored successfully. Zero data loss verified.`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleCloneToStaging = async (snapId: string) => {
    setBannerNotice(`Creating isolated sandbox staging environment 'staging-${selectedSite}' from ${snapId}...`);
    await new Promise(r => setTimeout(r, 1400));
    setBannerNotice(`✓ Sandbox ready at https://staging-${selectedSite} (Protected by HTTP Basic Auth).`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bento-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Disaster Recovery & Immutable Snapshots</h2>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold">
              3-2-1 Redundancy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Atomic point-in-time recovery, one-click rollback time machine, and isolated sandbox staging forks.
          </p>
        </div>

        <button
          onClick={handleCreateNewSnapshot}
          disabled={isCreatingSnapshot}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black font-mono uppercase tracking-wider shadow-md shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isCreatingSnapshot ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Creating Atomic Snapshot...</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4" />
              <span>Take Live Snapshot Now</span>
            </>
          )}
        </button>
      </div>

      {/* Notice Banner */}
      {bannerNotice && (
        <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs font-mono text-sky-300 flex items-center justify-between animate-in fade-in duration-150">
          <span>{bannerNotice}</span>
          <span className="text-[10px] text-sky-400">GCS & AWS S3 Vault</span>
        </div>
      )}

      {/* 1. Recovery Architecture Overview Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Cloud className="w-4 h-4" />
            <span>Multi-Cloud Redundancy</span>
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">Dual S3 & GCS Storage</div>
          <p className="text-xs text-slate-400">
            Encrypted snapshots replicated automatically to geographically distributed object buckets.
          </p>
        </div>

        <div className="bento-card space-y-2">
          <div className="flex items-center gap-2 text-green-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Immutable WORM Storage</span>
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">Ransomware Protected</div>
          <p className="text-xs text-slate-400">
            Write-Once-Read-Many policies ensure snapshots cannot be overwritten or deleted for 90 days.
          </p>
        </div>

        <div className="bento-card space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Instant Staging Forks</span>
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">&lt; 30s Clone Time</div>
          <p className="text-xs text-slate-400">
            Clone any live production site or snapshot to an isolated staging subdomain in seconds.
          </p>
        </div>
      </div>

      {/* 2. Snapshot Time Machine List in Bento Card */}
      <div className="bento-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
            <Archive className="w-4 h-4 text-sky-400" />
            <span>Available Recovery Points ({snapshots.length} Snapshots)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Target: {selectedSite}</span>
        </div>

        <div className="space-y-3">
          {snapshots.map(snap => (
            <div
              key={snap.id}
              className="p-4 rounded-lg bg-[#0A0A0C] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-100">{snap.id}</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-mono uppercase font-semibold">
                    {snap.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono">
                    ✓ {snap.integrityStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{snap.timestamp}</span>
                  <span>•</span>
                  <span>{snap.sizeMb} MB</span>
                  <span>•</span>
                  <span>{snap.mysqlRows.toLocaleString()} DB Rows</span>
                  <span>•</span>
                  <span className="text-slate-500">{snap.storageLocation}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <button
                  onClick={() => handleCloneToStaging(snap.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c21] border border-[#27272A] text-xs font-medium text-slate-300 transition-colors"
                >
                  Clone to Staging
                </button>

                <button
                  onClick={() => handleRestoreSnapshot(snap.id)}
                  disabled={isRestoring}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all uppercase disabled:opacity-50"
                >
                  Restore Instance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
