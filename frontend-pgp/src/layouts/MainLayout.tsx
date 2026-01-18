import React, { useState, useEffect } from 'react';
import { 
  Box, IconButton, Typography, Sheet, Snackbar, Button, List, ListItemButton, 
  ListItemDecorator, Avatar, Menu, MenuItem, Divider
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import GridFuncoes from '../modules/GridFuncoes/GridFuncoes';

interface OpenTab {
  id: string;
  label: string;
  refreshKey: number; 
}

interface MainLayoutProps {
  userName?: string;
  onLogout: () => void;
}

export default function MainLayout({ userName = "Administrador", onLogout }: MainLayoutProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { id: 'home', label: 'Início', refreshKey: Date.now() }
  ]);
  
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [tabToRefresh, setTabToRefresh] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleGlobalClick);
    }
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [contextMenu]);

  const openNewTab = (id: string, label: string) => {
    const existingIndex = openTabs.findIndex(t => 
      t.id.toLowerCase() === id.toLowerCase() || 
      t.label.toLowerCase() === label.toLowerCase()
    );

    if (existingIndex !== -1) {
      setActiveTabIndex(existingIndex);
    } else {
      if (openTabs.length >= 10) {
        setIsSnackbarOpen(true);
        return;
      }
      const newTab = { id, label, refreshKey: Date.now() };
      setOpenTabs(prev => [...prev, newTab]);
      setTimeout(() => {
        setOpenTabs(current => {
          setActiveTabIndex(current.length - 1);
          return current;
        });
      }, 0);
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
    e.stopPropagation();
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

  const handleLogoutClick = () => {
    setAnchorEl(null);
    onLogout();
  };

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden',
      '& *': { '--joy-focus-thickness': '0px !important', outline: 'none !important' } 
    }}>
      
      <Snackbar autoHideDuration={4000} open={isSnackbarOpen} variant="solid" color="danger" size="lg" onClose={() => setIsSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} startDecorator={<WarningIcon />} endDecorator={<Button onClick={() => setIsSnackbarOpen(false)} size="sm" variant="soft" color="danger">Fechar</Button>}>
        Limite de 10 abas atingido.
      </Snackbar>

      {contextMenu && (
        <Box sx={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, minWidth: 180, bgcolor: 'background.surface', boxShadow: 'md', borderRadius: 'md', border: '1px solid', borderColor: 'divider', p: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <List size="sm" sx={{ '--ListItem-radius': '8px' }}>
            <ListItemButton onClick={handleRefreshTab}>
              <ListItemDecorator><RefreshIcon fontSize="small" /></ListItemDecorator>
              <Typography level="body-sm">Atualizar Conteúdo</Typography>
            </ListItemButton>
          </List>
        </Box>
      )}

      <Sheet variant="soft" color="primary" sx={{ pt: 1, px: 2, width: '100%', display: 'flex', gap: 0.5, alignItems: 'flex-end', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, overflow: 'hidden' }}>
          {openTabs.map((tab, index) => {
            const isSelected = activeTabIndex === index;
            return (
              <Box key={tab.id} onClick={() => setActiveTabIndex(index)} onContextMenu={(e) => onRightClick(e, index)}
                sx={{
                  minHeight: 52, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 1, cursor: isSelected ? 'default' : 'pointer', borderTopLeftRadius: '12px', borderTopRightRadius: '12px',
                  bgcolor: isSelected ? 'background.body' : 'transparent', color: isSelected ? 'primary.plainColor' : 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: isSelected ? 'background.body' : 'rgba(255,255,255,0.05)', color: isSelected ? 'primary.plainColor' : 'rgba(255,255,255,0.9)' }
                }}
              >
                {tab.id === 'home' && <HomeIcon fontSize="small" />}
                <Typography level="title-sm" sx={{ color: 'inherit', fontWeight: isSelected ? 600 : 500 }}>{tab.label}</Typography>
                {tab.id !== 'home' && (
                  <IconButton size="sm" variant="plain" onClick={(e) => closeTab(index, e)} sx={{ ml: 1, color: 'inherit', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', color: 'danger.plainColor' } }}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 0, ml: 'auto' }} />

        <Box onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, ml: 2, cursor: 'pointer', p: 0.8, borderRadius: 'md', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <Typography level="title-sm" sx={{ color: 'white', fontWeight: 600 }}>{userName}</Typography>
          <Avatar size="sm" variant="soft" color="primary"><PersonIcon /></Avatar>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} size="sm" placement="bottom-end" sx={{ '--ListItem-radius': '8px', minWidth: 190, boxShadow: 'md', zIndex: 10000 }}>
          <MenuItem onClick={() => { setAnchorEl(null); openNewTab('admin', 'Administração'); }}>
            <ListItemDecorator><SettingsIcon fontSize="small" /></ListItemDecorator>
            Administração
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogoutClick} sx={{ color: 'danger.plainColor' }}>
            <ListItemDecorator><LogoutIcon fontSize="small" color="error" /></ListItemDecorator>
            Sair do sistema
          </MenuItem>
        </Menu>
      </Sheet>

      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.body' }}>
        <Box key={openTabs[activeTabIndex]?.refreshKey} sx={{ height: '100%' }}>
          {openTabs[activeTabIndex]?.id === 'home' ? (
            <GridFuncoes onOpenModule={openNewTab} />
          ) : (
            <Box sx={{ p: 4 }}>
              {openTabs[activeTabIndex]?.id === 'admin' ? (
                <Box>
                  <Typography level="h2">Administração do Sistema</Typography>
                  <Typography level="body-md" sx={{ color: 'neutral.500', mb: 3 }}>
                    Gerencie usuários, permissões e configurações gerais.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography level="h3">Módulo: {openTabs[activeTabIndex]?.label}</Typography>
                  <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.400' }}>
                    ID: {openTabs[activeTabIndex]?.id} | Render: {openTabs[activeTabIndex]?.refreshKey}
                  </Typography>
                  <Typography level="body-md" sx={{ mt: 2 }}>
                    Este módulo está em desenvolvimento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}