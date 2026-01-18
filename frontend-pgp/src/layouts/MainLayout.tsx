import React, { useState, useEffect } from 'react';
import { 
  Box, IconButton, Typography, Sheet, Snackbar, Button, List, ListItemButton, ListItemDecorator
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import GridFuncoes from '../modules/GridFuncoes/GridFuncoes';

interface OpenTab {
  id: string;
  label: string;
  refreshKey: number; 
}

export default function MainLayout() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { id: 'home', label: 'Início', refreshKey: Date.now() }
  ]);
  
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  // ESTADO PARA O MENU DE CONTEXTO
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [tabToRefresh, setTabToRefresh] = useState<number | null>(null);

  // FECHAR MENU AO CLICAR EM QUALQUER LUGAR
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleGlobalClick);
    }
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [contextMenu]);

  const openNewTab = (id: string, label: string) => {
    const existingIndex = openTabs.findIndex(t => t.id === id);
    if (existingIndex !== -1) {
      setActiveTabIndex(existingIndex);
    } else {
      if (openTabs.length >= 10) {
        setIsSnackbarOpen(true);
        return;
      }
      setOpenTabs(prevTabs => {
        const newTabs = [...prevTabs, { id, label, refreshKey: Date.now() }];
        setTimeout(() => setActiveTabIndex(newTabs.length - 1), 0);
        return newTabs;
      });
    }
  };

  const closeTab = (index: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (openTabs[index].id === 'home') return; 
    const newTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(newTabs);
    if (activeTabIndex >= index) {
      setActiveTabIndex(Math.max(0, activeTabIndex - 1));
    }
  };

  const handleRefreshTab = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede o fechamento antes de processar
    if (tabToRefresh !== null) {
      setOpenTabs(prev => prev.map((tab, i) => 
        i === tabToRefresh ? { ...tab, refreshKey: Date.now() } : tab
      ));
      setContextMenu(null);
    }
  };

  const onRightClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault(); 
    setTabToRefresh(index);
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden',
      '& *': { '--joy-focus-thickness': '0px !important', outline: 'none !important' } 
    }}>
      
      <Snackbar autoHideDuration={4000} open={isSnackbarOpen} variant="solid" color="danger" size="lg" onClose={() => setIsSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} startDecorator={<WarningIcon />} endDecorator={<Button onClick={() => setIsSnackbarOpen(false)} size="sm" variant="soft" color="danger">Fechar</Button>}>
        Limite de 10 abas atingido.
      </Snackbar>

      {/* MENU DE CONTEXTO ROBUSTO */}
      {contextMenu && (
        <Box
          sx={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
            minWidth: 180,
            bgcolor: 'background.surface',
            boxShadow: 'md',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: 'divider',
            p: 0.5,
          }}
          onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro do menu
        >
          <List size="sm" sx={{ '--ListItem-radius': '8px' }}>
            <ListItemButton onClick={handleRefreshTab}>
              <ListItemDecorator><RefreshIcon fontSize="small" /></ListItemDecorator>
              <Typography level="body-sm">Atualizar Conteúdo</Typography>
            </ListItemButton>
          </List>
        </Box>
      )}

      <Sheet variant="soft" color="primary" sx={{ pt: 1, px: 1, width: '100%', display: 'flex', gap: 0.5, alignItems: 'flex-end', borderBottom: '1px solid', borderColor: 'divider' }}>
        {openTabs.map((tab, index) => {
          const isSelected = activeTabIndex === index;
          return (
            <Box
              key={tab.id}
              onClick={() => setActiveTabIndex(index)}
              onContextMenu={(e) => onRightClick(e, index)}
              sx={{
                minHeight: 52, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 1,
                cursor: isSelected ? 'default' : 'pointer', borderTopLeftRadius: '12px', borderTopRightRadius: '12px',
                bgcolor: isSelected ? 'background.body' : 'transparent',
                color: isSelected ? 'primary.plainColor' : 'rgba(255,255,255,0.7)',
                '&:hover': { bgcolor: isSelected ? 'background.body' : 'transparent', color: isSelected ? 'primary.plainColor' : 'rgba(255,255,255,0.8)' }
              }}
            >
              {tab.id === 'home' && <HomeIcon fontSize="small" />}
              <Typography level="title-sm" sx={{ color: 'inherit', fontWeight: isSelected ? 600 : 500 }}>
                {tab.label}
              </Typography>
              {tab.id !== 'home' && (
                <IconButton size="sm" variant="plain" onClick={(e) => closeTab(index, e)} sx={{ ml: 1, color: 'inherit', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', color: 'danger.plainColor' } }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          );
        })}
      </Sheet>

      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.body' }}>
        <Box key={openTabs[activeTabIndex]?.refreshKey} sx={{ height: '100%' }}>
          {openTabs[activeTabIndex]?.id === 'home' ? (
            <GridFuncoes onOpenModule={openNewTab} />
          ) : (
            <Box sx={{ p: 4 }}>
              <Typography level="h3">Módulo: {openTabs[activeTabIndex]?.label}</Typography>
              <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.400' }}>
                ID: {openTabs[activeTabIndex]?.id} | Render: {openTabs[activeTabIndex]?.refreshKey}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}