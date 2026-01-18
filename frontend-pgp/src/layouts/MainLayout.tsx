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
      bgcolor: '#F8FAFC',
      '& *': { '--joy-focus-thickness': '0px !important', outline: 'none !important' } 
    }}>
      
      <Snackbar autoHideDuration={4000} open={isSnackbarOpen} variant="solid" color="danger" size="lg" onClose={() => setIsSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} startDecorator={<WarningIcon />} endDecorator={<Button onClick={() => setIsSnackbarOpen(false)} size="sm" variant="soft" color="danger">Fechar</Button>}>
        Limite de 10 abas atingido.
      </Snackbar>

      {contextMenu && (
        <Box sx={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, minWidth: 180, bgcolor: 'background.surface', boxShadow: 'md', borderRadius: 'md', border: 'none', p: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <List size="sm" sx={{ '--ListItem-radius': '8px' }}>
            <ListItemButton onClick={handleRefreshTab}>
              <ListItemDecorator><RefreshIcon fontSize="small" /></ListItemDecorator>
              <Typography level="body-sm">Atualizar Conteúdo</Typography>
            </ListItemButton>
          </List>
        </Box>
      )}

      {/* HEADER COM DEGRADÊ */}
      <Sheet 
        variant="solid" 
        sx={{ 
          pt: 1, px: 2, 
          background: 'linear-gradient(to right, #0c1e41, #1e3a8a)', 
          display: 'flex', 
          gap: 0.5, 
          alignItems: 'flex-end',
          borderBottom: 'none',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, overflow: 'hidden' }}>
          {openTabs.map((tab, index) => {
            const isSelected = activeTabIndex === index;
            const isHome = tab.id === 'home';

            return (
              <Box 
                key={tab.id} 
                onClick={() => setActiveTabIndex(index)} 
                onContextMenu={(e) => onRightClick(e, index)}
                sx={{
                  width: isHome ? 'auto' : 180,
                  minWidth: isHome ? 60 : 120,
                  flexShrink: 0,
                  minHeight: 50, 
                  padding: isHome ? '0 15px' : '0 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: isHome ? 'center' : 'space-between',
                  gap: 1, 
                  cursor: 'pointer', 
                  borderTopLeftRadius: '8px', 
                  borderTopRightRadius: '8px',
                  bgcolor: isSelected ? '#F8FAFC' : 'transparent', 
                  color: isSelected ? '#2563EB' : 'rgba(255,255,255,0.8)',
                  transition: '0.2s',
                  '&:hover': { 
                    bgcolor: isSelected ? '#F8FAFC' : 'rgba(255,255,255,0.1)', 
                    color: isSelected ? '#2563EB' : '#FFFFFF' 
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                  {isHome && <HomeIcon sx={{ fontSize: 18 }} />}
                  <Typography 
                    level="title-sm" 
                    sx={{ 
                      color: 'inherit', 
                      fontWeight: isSelected ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: isHome && !isSelected ? 'none' : 'block' 
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>

                {!isHome && (
                  <IconButton 
                    size="sm" 
                    variant="plain" 
                    onClick={(e) => closeTab(index, e)} 
                    sx={{ 
                      p: 0, minWidth: 24, minHeight: 24,
                      color: 'inherit', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '50%' } 
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 0, ml: 'auto' }} />

        {/* PERFIL */}
        <Box 
  onClick={(event) => setAnchorEl(event.currentTarget)} 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5, 
    mb: 1, 
    ml: 2, 
    cursor: 'pointer', 
    p: 0.5, 
    px: 1, // Um pouco mais de respiro lateral
    borderRadius: 'md', 
    transition: '0.2s',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
  }}
>
  <Typography 
    level="title-sm" 
    sx={{ 
      color: 'white', 
      fontWeight: 500,
      opacity: 0.9 // Deixa o nome sutilmente menos brilhante que o ícone
    }}
  >
    {userName}
  </Typography>
  
  <Avatar 
    size="sm" 
    variant="solid" // Mudamos de soft para solid para dar mais peso
    sx={{ 
      bgcolor: 'rgba(255,255,255,0.25)', // Branco suave
      color: '#FFFFFF', // Ícone totalmente branco
      border: '1px solid rgba(255,255,255,0.3)' // Borda fina para dar nitidez
    }}
  >
    <PersonIcon sx={{ fontSize: 20 }} />
  </Avatar>
</Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} size="sm" placement="bottom-end" sx={{ borderRadius: '8px', minWidth: 190, boxShadow: 'lg', border: 'none' }}>
          <MenuItem onClick={() => { setAnchorEl(null); openNewTab('admin', 'Administração'); }}>
            <ListItemDecorator><SettingsIcon fontSize="small" /></ListItemDecorator>
            Administração
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogoutClick} sx={{ color: '#DC2626' }}>
            <ListItemDecorator><LogoutIcon fontSize="small" sx={{ color: '#DC2626' }} /></ListItemDecorator>
            Sair do sistema
          </MenuItem>
        </Menu>
      </Sheet>

      {/* CONTEÚDO */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#F8FAFC' }}>
        <Box key={openTabs[activeTabIndex]?.refreshKey} sx={{ height: '100%', p: 4 }}>
          {openTabs[activeTabIndex]?.id === 'home' ? (
            <GridFuncoes onOpenModule={openNewTab} />
          ) : (
            <Box>
              <Typography level="h2">
                {openTabs[activeTabIndex]?.label}
              </Typography>
              <Typography level="body-md" sx={{ mt: 1, color: '#475569' }}>
                Este módulo está em desenvolvimento.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}