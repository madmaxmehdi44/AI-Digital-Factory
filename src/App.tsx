import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DigitalFactoryWizard } from "./components/DigitalFactoryWizard";
import { BusinessStrategyView } from "./components/BusinessStrategyView";
import { DesignSystemView } from "./components/DesignSystemView";
import { ThemeCompilerView } from "./components/ThemeCompilerView";
import { DeploymentEngineView } from "./components/DeploymentEngineView";
import { OperationsDashboard } from "./components/OperationsDashboard";
import { TroubleshootingView } from "./components/TroubleshootingView";
import { OptimizationEngineView } from "./components/OptimizationEngineView";
import { BackupDrEngineView } from "./components/BackupDrEngineView";
import { DeveloperToolsView } from "./components/DeveloperToolsView";
import { VoiceStudioModal } from "./components/VoiceStudioModal";
import { AiCopilotDrawer } from "./components/AiCopilotDrawer";
import { AuthModal } from "./components/AuthModal";
import { SystemHealthFooter } from "./components/SystemHealthFooter";


import {
  ActiveTab,
  BusinessInput,
  BusinessStrategy,
  DesignSystem,
  WordPressTheme,
  FleetSite,
  HostingConnector,
  IncidentRecord,
  UserProfile,
  PlanTier
} from "./types";

import {
  mockBusinesses,
  mockStrategy,
  mockDesignSystem,
  mockFleetSites,
  mockHostingConnectors,
  mockIncidents
} from "./data/mockData";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>("factory_wizard");

  // Multi-business state
  const [allBusinesses, setAllBusinesses] = useState<BusinessInput[]>(() => {
    const saved = localStorage.getItem("adf_businesses");
    return saved ? JSON.parse(saved) : mockBusinesses;
  });
  const [currentBusiness, setCurrentBusiness] = useState<BusinessInput>(
    allBusinesses[0] || mockBusinesses[0]
  );

  // Business Artifacts
  const [strategy, setStrategy] = useState<BusinessStrategy | null>(mockStrategy);
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(mockDesignSystem);
  const [theme, setTheme] = useState<WordPressTheme | null>(null);

  // Operations & Infrastructure Fleet
  const [fleet, setFleet] = useState<FleetSite[]>(() => {
    const saved = localStorage.getItem("adf_fleet");
    return saved ? JSON.parse(saved) : mockFleetSites;
  });
  const [connectors, setConnectors] = useState<HostingConnector[]>(() => {
    const saved = localStorage.getItem("adf_connectors");
    return saved ? JSON.parse(saved) : mockHostingConnectors;
  });
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    const saved = localStorage.getItem("adf_incidents");
    return saved ? JSON.parse(saved) : mockIncidents;
  });

  // User Profile & Platform Plan
  const [user, setUser] = useState<UserProfile>({
    uid: "chief_architect_01",
    email: "architect@aidigitalfactory.dev",
    displayName: "Lead DevOps Architect",
    role: "admin",
    plan: "Enterprise"
  });

  // Modals & Drawers
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [troubleshootInitialDomain, setTroubleshootInitialDomain] = useState("velocehealth.org");

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("adf_businesses", JSON.stringify(allBusinesses));
  }, [allBusinesses]);

  useEffect(() => {
    localStorage.setItem("adf_fleet", JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem("adf_connectors", JSON.stringify(connectors));
  }, [connectors]);

  useEffect(() => {
    localStorage.setItem("adf_incidents", JSON.stringify(incidents));
  }, [incidents]);

  const handleSelectBusiness = (biz: BusinessInput) => {
    setCurrentBusiness(biz);
  };

  const handleNewBusiness = () => {
    const newBiz: BusinessInput = {
      id: `biz_${Date.now()}`,
      name: "New Enterprise Initiative",
      type: "agency",
      industry: "Digital Transformation & Cloud",
      location: "San Francisco & Global",
      targetAudience: "Global enterprise stakeholders",
      goals: "Lead generation, autonomous operations, 100/100 Core Web Vitals",
      personality: "Authoritative, modern, high-contrast, technical",
      stylePreference: "dark_titanium",
      createdAt: new Date().toISOString()
    };

    setAllBusinesses(prev => [newBiz, ...prev]);
    setCurrentBusiness(newBiz);
    setTheme(null);
    setActiveTab("factory_wizard");
  };

  const handleApplyVoiceTranscript = (transcript: string) => {
    const updated = {
      ...currentBusiness,
      goals: `${currentBusiness.goals}. Voice Intake: ${transcript}`
    };
    setCurrentBusiness(updated);
    setAllBusinesses(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    setActiveTab("factory_wizard");
  };

  const handleNavigateToTroubleshoot = (domain: string) => {
    setTroubleshootInitialDomain(domain);
    setActiveTab("troubleshooting");
  };

  const handleAddIncident = (newInc: IncidentRecord) => {
    setIncidents(prev => [newInc, ...prev]);
    // update fleet site status if matching
    setFleet(prev =>
      prev.map(s => (s.domain === newInc.siteDomain ? { ...s, status: "healthy" } : s))
    );
  };

  const handleAddConnector = (newConn: HostingConnector) => {
    setConnectors(prev => [newConn, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0A0C] text-slate-100 antialiased overflow-hidden font-sans selection:bg-sky-500 selection:text-black">
      {/* 1. Master Header */}
      <Header
        currentBusiness={currentBusiness}
        allBusinesses={allBusinesses}
        onSelectBusiness={handleSelectBusiness}
        onNewBusiness={handleNewBusiness}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        plan={user.plan}
        onSelectPlan={(p: PlanTier) => setUser(u => ({ ...u, plan: p }))}
      />

      {/* 2. Main Body with Sidebar + Active View Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          compiledThemeReady={!!theme}
          unresolvedIncidentsCount={incidents.filter(i => i.status !== "RESOLVED").length}
          availableOptimizationsCount={4}
        />

        {/* Center Workspace Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0C]">
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14, scale: 0.995, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, scale: 0.995, filter: "blur(4px)" }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="w-full"
              >
                {activeTab === "factory_wizard" && (
                  <DigitalFactoryWizard
                    currentBusiness={currentBusiness}
                    onUpdateBusiness={b => {
                      setCurrentBusiness(b);
                      setAllBusinesses(prev => prev.map(item => (item.id === b.id ? b : item)));
                    }}
                    strategy={strategy}
                    onUpdateStrategy={setStrategy}
                    designSystem={designSystem}
                    onUpdateDesignSystem={setDesignSystem}
                    theme={theme}
                    onUpdateTheme={setTheme}
                    onNavigateTab={setActiveTab}
                    onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                  />
                )}

                {activeTab === "business_ai" && (
                  <BusinessStrategyView
                    business={currentBusiness}
                    strategy={strategy}
                    onUpdateStrategy={setStrategy}
                  />
                )}

                {activeTab === "design_system" && (
                  <DesignSystemView
                    business={currentBusiness}
                    designSystem={designSystem}
                    onUpdateDesignSystem={setDesignSystem}
                  />
                )}

                {activeTab === "theme_compiler" && (
                  <ThemeCompilerView
                    business={currentBusiness}
                    theme={theme}
                    designSystem={designSystem}
                    strategy={strategy}
                    onUpdateTheme={setTheme}
                  />
                )}

                {activeTab === "deployment" && (
                  <DeploymentEngineView
                    business={currentBusiness}
                    theme={theme}
                    designSystem={designSystem}
                    strategy={strategy}
                    connectors={connectors}
                    onAddConnector={handleAddConnector}
                  />
                )}

                {activeTab === "operations_fleet" && (
                  <OperationsDashboard
                    fleet={fleet}
                    onTriggerFleetAudit={() => {}}
                    onFlushFleetCache={() => {}}
                    onUpdateSite={updated =>
                      setFleet(prev => prev.map(s => (s.id === updated.id ? updated : s)))
                    }
                    onNavigateToTroubleshoot={handleNavigateToTroubleshoot}
                  />
                )}

                {activeTab === "troubleshooting" && (
                  <TroubleshootingView
                    initialDomain={troubleshootInitialDomain}
                    incidents={incidents}
                    onAddIncident={handleAddIncident}
                  />
                )}

                {activeTab === "optimization" && <OptimizationEngineView fleet={fleet} />}

                {activeTab === "backup_vault" && <BackupDrEngineView fleet={fleet} />}

                {activeTab === "developer_tools" && <DeveloperToolsView />}

                {activeTab === "voice_studio" && (
                  <div className="p-12 text-center space-y-4 max-w-lg mx-auto bento-card">
                    <h2 className="text-xl font-bold text-slate-100">Voice AI Studio</h2>
                    <p className="text-xs text-slate-400">
                      Use Gemini Audio Transcription to rapidly dictate digital business requirements, brand identities, and deployment configurations.
                    </p>
                    <button
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="px-6 py-3 rounded-lg bg-sky-500 font-bold text-xs text-black uppercase tracking-wider shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:scale-105 transition-all"
                    >
                      Launch Voice Recording Studio
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bento Grid Persistent Real-time System Health Monitor Footer */}
          <SystemHealthFooter />
        </div>
      </div>

      {/* 3. Global Modals & Drawers */}
      <VoiceStudioModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onApplyTranscript={handleApplyVoiceTranscript}
      />

      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeContext={`Current Business: ${currentBusiness.name} (${currentBusiness.industry}), Active Tab: ${activeTab}`}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onUpdateUser={setUser}
      />
    </div>
  );
}
