import React, { useState, useRef } from 'react';
import { Card, Typography, Input, Box, AspectRatio, IconButton } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';

const FUNCOES = [
  { id: 'prontuario', label: 'Prontuário', icon: <MedicalInformationIcon />, color: 'primary' },
  { id: 'agenda', label: 'Agenda', icon: <EventNoteIcon />, color: 'primary' },
  { id: 'estoque', label: 'Estoque', icon: <InventoryIcon />, color: 'primary' },
  { id: 'faturamento', label: 'Faturamento', icon: <ReceiptLongIcon />, color: 'primary' },
  { id: 'pacientes', label: 'Pacientes', icon: <PersonAddIcon />, color: 'primary' }, 
  { id: 'admin', label: 'Administração', icon: <SettingsIcon />, color: 'primary' },
];

interface GridFuncoesProps {
  onOpenModule: (id: string, label: string) => void;
}

export default function GridFuncoes({ onOpenModule }: GridFuncoesProps) {
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const funcoesFiltradas = FUNCOES.filter(f => 
    f.label.toLowerCase().includes(search.toLowerCase())
  );

  const mostrarSetas = funcoesFiltradas.length > 18;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      overflow: 'hidden', // Mata qualquer scroll acidental no container pai
      p: 2
    }}>
      
      <Box sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
        <Input
          size="lg"
          placeholder="Pesquisar função"
          startDecorator={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center' }}>
        
        {mostrarSetas && (
          <IconButton
            variant="plain"
            onClick={() => scroll('left')}
            sx={{ position: 'absolute', left: -60, zIndex: 10, borderRadius: '50%' }}
          >
            <ChevronLeftIcon sx={{ fontSize: '3rem' }} />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, auto)', // Altura fixa para as 3 linhas
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc((100% - (5 * 12px)) / 6)', 
            gap: 1.5,
            overflowX: 'auto',
            overflowY: 'hidden', // GARANTE que não haja scroll vertical
            scrollSnapType: 'x mandatory',
            width: '100%',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            p: 0.5 // Padding reduzido para não empurrar os cards
          }}
        >
          {funcoesFiltradas.map((item) => (
          <Card
            key={item.id} // Agora que os IDs são únicos, o React funcionará corretamente
            variant="plain"
            onClick={() => onOpenModule(item.id, item.label)}
              sx={{
                cursor: 'pointer',
                scrollSnapAlign: 'start',
                transition: '0.2s',
                p: 0, // Remove padding do card para o AspectRatio ocupar tudo
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  bgcolor: 'primary.softHoverBg',
                },
              }}
            >
              {/* AspectRatio centraliza o conteúdo automaticamente se usarmos flex dentro dele */}
              <AspectRatio ratio="1" variant="plain" sx={{ bgcolor: 'transparent' }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%' 
                }}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { 
  sx: { fontSize: '2rem', mb: 1, color: '#1e3a8a' } 
})}
                  <Typography level="title-sm" mt={1} textAlign="center">
                    {item.label}
                  </Typography>
                </Box>
              </AspectRatio>
            </Card>
          ))}
        </Box>

        {mostrarSetas && (
          <IconButton
            variant="plain"
            onClick={() => scroll('right')}
            sx={{ position: 'absolute', right: -60, zIndex: 10, borderRadius: '50%' }}
          >
            <ChevronRightIcon sx={{ fontSize: '3rem' }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}