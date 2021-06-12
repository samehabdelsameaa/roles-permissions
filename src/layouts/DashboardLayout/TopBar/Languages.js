import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import PopoverMenu from 'src/components/PopoverMenu';
import { makeStyles } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { MIconButton } from 'src/theme';
import useSettings from 'src/hooks/useSettings';

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg'
  },
  {
    value: 'ar',
    label: 'العربية',
    icon: '/static/icons/ic_flag_de.svg'
  }
];

const useStyles = makeStyles((theme) => ({
  btnLang: {
    padding: 0,
    width: 44,
    height: 44
  },
  isSelected: {
    backgroundColor: theme.palette.background.selected
  }
}));

function Languages() {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const { themeDirection, selectDirection } = useSettings();

  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage);

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const handleThemeDirection = (lang) => {
    lang === 'ar' ? selectDirection('rtl') : selectDirection('ltr');
    setOpen(false);
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        className={clsx(classes.btnLang, { [classes.isSelected]: isOpen })}
      >
        <img src={currentLang.icon} alt={currentLang.label} />
      </MIconButton>

      <PopoverMenu
        width={200}
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ py: 1 }}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === langStorage}
              onClick={() => {
                handleChangeLanguage(option.value);
                handleThemeDirection(option.value);
              }}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>

              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </PopoverMenu>
    </>
  );
}

export default Languages;
